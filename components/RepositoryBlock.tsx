import { repo_status } from '@prisma/client';
import ActionButton from './ActionButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export interface Severity {
	low: number;
	moderate: number;
	high: number;
}

export interface RepositoryInfo {
	id: string;
	name: string;
	description: string;
	status: repo_status;
	severity: Severity;
}

export default function RepositoryBlock({ repository }: { repository: RepositoryInfo }) {
	if (repository.status === repo_status.Scanned) {
		return (
			<Link href={`/dashboard/repo/${repository.id}`}>
				<RepositoryBlockInternal repository={repository} />
			</Link>
		);
	}

	return <RepositoryBlockInternal repository={repository} />;
}

function RepositoryBlockInternal({ repository }: { repository: RepositoryInfo }) {
	return (
		<div className='h-[200px] w-full flex flex-row'>
			<div className='h-[200px] w-3/4 bg-block_background flex flex-col justify-center pl-8'>
				<div className='text-4xl'>{repository.name}</div>
				<div className='text-xl'>{repository.description}</div>
			</div>
			<div className='h-[200px] w-1/4 bg-block_background_light'>
				<StatusInfoBlock
					status={repository.status}
					repo_name={repository.name}
					repo_id={Number(repository.id)}
					severities={repository.severity}
				/>
			</div>
		</div>
	);
}

function StatusInfoBlock({
	status,
	repo_name,
	repo_id,
	severities,
}: {
	status: repo_status;
	repo_name: string;
	repo_id: number;
	severities: Severity;
}): JSX.Element {
	const [statusBlock, setStatusBlock] = useState(<></>);
	const [buttonClicked, setButtonClicker] = useState(false);
	const { data: statusSession } = useSession();

	useEffect(() => {
		console.log('USE EFFECT');
		const fetchRepos = async () => {
			setStatusBlock(<Scanning />);
			const response = await fetch(`http://localhost:1323/parse?service=github`, {
				method: 'POST',
				body: JSON.stringify({
					id: statusSession!.user.id,
					repo: repo_name,
					repoId: repo_id,
					token: statusSession!.accessToken,
					user: statusSession!.user.username,
				}),
			});

			const data: { Low: number; Moderate: number; High: number } = await response.json();
			setStatusBlock(
				<Scanned
					severities={{
						low: data.Low,
						moderate: data.Moderate,
						high: data.High,
					}}
				/>,
			);
		};

		if (!buttonClicked) {
			setStatusBlock(<NotScanned setState={setButtonClicker} />);
		} else {
			fetchRepos();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buttonClicked]);

	switch (status) {
		case repo_status.NotScanned:
			return statusBlock;
		case repo_status.Scanning:
			return <Scanning />;
		case repo_status.Scanned:
			return <Scanned severities={severities} />;
		default:
			return <></>;
	}
}

function NotScanned({ setState }: { setState: Function }) {
	return (
		<div className='h-full flex flex-col justify-center gap-4'>
			<p className='w-full text-center text-2xl'>Сканирование не проводилось</p>
			<div className='w-full flex justify-center'>
				<ActionButton
					text='Сканировать'
					action={async () => {
						return setState(true);
					}}
				/>
			</div>
		</div>
	);
}

function Scanning() {
	return (
		<p className='w-full h-full flex justify-center items-center text-2xl text-center'>Сканирование в процессе</p>
	);
}

function Scanned({ severities }: { severities: Severity }) {
	return (
		<div className='h-full items-center flex flex-col justify-center'>
			<p className='text-2xl'>Уязвимости</p>
			<div className='w-full flex flex-row justify-center text-2xl mt-5 gap-[6%] flex-wrap'>
				<div className='flex flex-col items-center'>
					<p>Низкий</p>
					<p>{severities.low}</p>
				</div>
				<div className='flex flex-col items-center'>
					<p>Средний</p>
					<p>{severities.moderate}</p>
				</div>
				<div className='flex flex-col items-center'>
					<p>Высокий</p>
					<p>{severities.high}</p>
				</div>
			</div>
		</div>
	);
}
