import prisma from '@/prisma/db';
import { PackageWithSeverity, SourceInfo } from '@/types/source.types';
import { NextRequest, NextResponse } from 'next/server';

async function GET(req: NextRequest) {
	const repoId = parseInt(req.nextUrl.searchParams.get('repo_id') as string);
	if (!repoId) {
		console.error('Ошибка парса ID репозитория');
		return NextResponse.json(
			{
				name: 'Безымянный',
			},
			{
				status: 400,
			},
		);
	}

	const name = await prisma.repos.findFirst({
		where: {
			id: {
				equals: repoId,
			},
		},
		select: {
			name: true,
		},
	});

	if (!name) {
		console.error('Репозиторий не найден');
		return NextResponse.json(
			{
				name: 'Безымянный',
			},
			{
				status: 404,
			},
		);
	}

	return NextResponse.json(name, {
		status: 200,
	});
}

export { GET };
