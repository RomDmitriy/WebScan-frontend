'use client';

import SmallActionButton from '@/components/SmallActionButton';
import SourceBlock from '@/components/SourceBlock';
import { SourceInfo } from '@/types/source.types';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RepoPage({ params }: { params: { repo_id: string } }) {
	useSession({
		required: true,
		onUnauthenticated() {
			redirect('/auth');
		},
	});

	const [name, setName] = useState('Загрузка...');

	useEffect(() => {
		const fetchName = async () => {
			const response = await fetch(`/api/repos/nameById?repo_id=${params.repo_id}`);
			const data = (await response.json()) as { name: string };
			setName(data.name);
		};

		fetchName();
	}, [params.repo_id]);

	return (
		<div className='flex flex-col justify-center w-full items-center gap-y-4'>
			<p className='text-5xl'>{name}</p>
			<SmallActionButton text='Сканировать' />
			<Sources repo_id={params.repo_id} />
		</div>
	);
}

function Sources({ repo_id }: { repo_id: string }) {
	const [isLoading, setIsLoading] = useState(true);
	const [sources, setSources] = useState<SourceInfo[]>([]);

	//TODO: возможно сломается на проде, т.к. useEffect не отработает в первый раз
	useEffect(() => {
		console.log('USE EFFECT - SOURCES');
		setIsLoading(true);
		const fetchSources = async () => {
			const response = await fetch(`/api/scans?repo_id=${repo_id}`);
			const data = (await response.json()) as { sources: SourceInfo[] };
			setSources(data.sources);
			console.log(data);
			setIsLoading(false);
		};

		fetchSources();
	}, [repo_id]);

	return isLoading ? (
		<p className='text-3xl w-full flex justify-center items-center h-[115px]'>Загрузка...</p>
	) : (
		<div className='h-fit w-2/3 bg-block_background flex flex-col justify-center'>
			<div className='py-2'>
				{sources.length ? (
					sources.map((src) => <SourceBlock key={src.path} src={src} />)
				) : (
					<p className='w-full flex justify-center text-3xl py-10'>Lock-файлы не найдены</p>
				)}
			</div>
		</div>
	);
}