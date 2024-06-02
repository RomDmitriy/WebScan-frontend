import prisma from '@/prisma/db';
import { PackageWithSeverity, SourceInfo } from '@/types/source.types';
import { NextRequest, NextResponse } from 'next/server';

async function GET(req: NextRequest) {
	const repoId = parseInt(req.nextUrl.searchParams.get('repo_id') as string);
	if (!repoId) {
		console.error('Ошибка парса ID репозитория');
		return NextResponse.json([], {
			status: 400,
		});
	}

	const scanInfo = await prisma.scans.findFirst({
		where: {
			repo_id: {
				equals: repoId,
			},
		},
		orderBy: {
			scanned_time: 'desc',
		},
		select: {
			id: true,
		},
	});

	if (!scanInfo) {
		console.error('Не найдена информация о сканировании');
		return NextResponse.json([], {
			status: 404,
		});
	}

	const sourcesWithPackages = await prisma.sources.findMany({
		where: {
			scan: scanInfo,
		},
		select: {
			path: true,
			packagesInSources: true,
		},
	});

	if (!sourcesWithPackages.length) {
		console.warn('Lock-файлы не найдены');
		return NextResponse.json(
			{
				sources: [],
			},
			{
				status: 200,
			},
		);
	}

	const pkgsFromDB = await prisma.packages.findMany({
		where: {
			id: {
				in: sourcesWithPackages.map((source) => source.packagesInSources.map((pkg) => pkg.package_id)).flat(1),
			},
		},
		select: {
			id: true,
			name: true,
			ecosystem: true,
			severities: true,
		},
	});

	console.debug('Количество пакетов:', pkgsFromDB.length);

	const result: SourceInfo[] = [];
	sourcesWithPackages.forEach((source) => {
		const packages: PackageWithSeverity[] = [];
		source.packagesInSources
			.map((pkgWithSrc) => pkgWithSrc.package_id)
			.forEach((pkgId) => {
				const pkg = pkgsFromDB.find((fullyPkg) => {
					return pkgId === fullyPkg.id;
				});
				if (!pkg) return;

				pkg.severities.forEach((severity) => {
					packages.push({
						name: pkg.name,
						ecosystem: pkg.ecosystem,
						severity: {
							id: severity.id,
							severity: severity.severity,
						},
					});
				});
			});

		result.push({
			path: source.path,
			packages: packages,
		});
	});

	return NextResponse.json(
		{ sources: result },
		{
			status: 200,
		},
	);
}

export { GET };
