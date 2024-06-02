import prisma from '@/prisma/db';
import { NextRequest, NextResponse } from 'next/server';

async function GET(req: NextRequest) {
	const vulnId = req.nextUrl.searchParams.get('vuln_id') as string;
	if (!vulnId) {
		console.error('Ошибка парса ID уязвимости');
		return NextResponse.json(
			{},
			{
				status: 400,
			},
		);
	}

	const references = await prisma.references.findMany({
		where: {
			vulnerabilitiesId: {
				equals: vulnId,
			},
		},
	});

	if (!references.length) {
		console.error('Ссылки не найдены');
		return NextResponse.json(
			{},
			{
				status: 404,
			},
		);
	}

	return NextResponse.json(references, {
		status: 200,
	});
}

export { GET };
