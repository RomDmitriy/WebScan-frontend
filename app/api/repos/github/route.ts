'use server';

import { auth } from '@/auth';
import prisma from '@/prisma/db';
import { repo_status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_STATUS: repo_status | null = null;
const DEFAULT_SEVERITY: { low: number; moderate: number; high: number } | null = null;

async function GET(req: NextRequest) {
  const session = await auth();

  if (session && session.user.username && session.accessToken) {
    const accessToken = session.accessToken as string;

    const search = req.nextUrl.searchParams.get('search');

    const response = await fetch(`https://api.github.com/users/${session.user.username}/repos?sort=pushed`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let repositories = ((await response.json()) as { id: number; name: string; description: string }[])
      .map(({ id, name, description }) => ({
        id,
        name,
        description,
        status: DEFAULT_STATUS,
        severity: DEFAULT_SEVERITY,
      }))
      .slice(0, 5);
    //TODO: убрать slice
    //TODO: пофиксить, что если много репозиториев, то верняя часть не видна

    if (search) {
      repositories = repositories.filter((repo) => repo.name.includes(search));
    }

    const dbRepos = await prisma.repos.findMany({
      where: {
        id: {
          in: repositories.map((repo) => repo.id),
        },
      },
    });

    for (let i = 0; i < repositories.length; i++) {
      for (const dbRepository of dbRepos) {
        if (repositories[i].id === dbRepository.id) {
          repositories[i].status = dbRepository.status;
        }
      }

      // Если в БД нет такого репозитория
      if (repositories[i].status === null) {
        // то создаём его
        const newRepository = await prisma.repos.create({
          data: {
            id: repositories[i].id,
            owner_id: Number(session.user.id),
          },
        });
        repositories[i].status = newRepository.status;
      }

      // Получаем результаты сканирования
      if (repositories[i].status === repo_status.Scanned) {
        const scanRes = await prisma.scans.findFirst({
          where: {
            repo_id: repositories[i].id,
          },
          orderBy: {
            scanned_time: 'desc',
          },
          select: {
            low_severity: true,
            moderate_severity: true,
            high_severity: true,
          },
        });

        if (scanRes) {
          repositories[i].severity = {
            low: scanRes.low_severity,
            moderate: scanRes.moderate_severity,
            high: scanRes.high_severity,
          };
        }
      }
    }

    // console.log(repositories);

    return NextResponse.json({ repositories }, { status: 200 });
  }

  return NextResponse.json(undefined, { status: 401 });
}

export { GET };
