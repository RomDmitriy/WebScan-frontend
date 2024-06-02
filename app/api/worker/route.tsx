import { NextRequest, NextResponse } from 'next/server';

async function POST(req: NextRequest) {
	const response = await fetch(`${process.env.WORKER_URL}/parse?service=github`, {
		method: 'POST',
		body: JSON.stringify(await req.json()),
	});

	const data: { Low: number; Moderate: number; High: number } = await response.json();
	return NextResponse.json(
		{
			low: data.Low,
			moderate: data.Moderate,
			high: data.High,
		},
		{ status: 200 },
	);
}

export { POST };
