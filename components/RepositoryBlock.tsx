import { repo_status } from '@prisma/client';
import ButtonAction from './ButtonAction';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { RepositoryInfo } from '@/types/repository.types';
import { VulnerabiliesCount } from '@/types/vulnerabilities.types';

export default function RepositoryBlock({ repository }: { repository: RepositoryInfo }) {
	const [isLinked, setIsLinked] = useState(repository.status === repo_status.Scanned);

	return isLinked ? (
		<Link href={`/repo/${repository.id}`}>
			<RepositoryBlockInternal repository={repository} setIsLinked={setIsLinked} />
		</Link>
	) : (
		<RepositoryBlockInternal repository={repository} setIsLinked={setIsLinked} />
	);
}

function RepositoryBlockInternal({
	repository,
	setIsLinked,
}: {
	repository: RepositoryInfo;
	setIsLinked: Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<div className='h-[200px] w-full flex flex-row'>
			<div className='h-[200px] w-3/4 bg-block_background flex flex-col justify-center pl-8 rounded-l'>
				<div className='text-4xl'>{repository.name}</div>
				<div className='text-xl'>{repository.description}</div>
			</div>
			<div className='h-[200px] w-1/4 bg-block_background_light rounded-r'>
				<StatusInfoBlock repository={repository} setIsLinked={setIsLinked} />
			</div>
		</div>
	);
}

function StatusInfoBlock({
	repository,
	setIsLinked,
}: {
	repository: RepositoryInfo;
	setIsLinked: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
	const [statusBlock, setStatusBlock] = useState(<></>);
	const [buttonClicked, setButtonClicker] = useState(false);
	const { data: statusSession } = useSession();

	useEffect(() => {
		console.log('USE EFFECT - STATUS');
		const fetchRepos = async () => {
			setStatusBlock(<Scanning />);
			const response = await fetch(`/api/worker`, {
				method: 'POST',
				body: JSON.stringify({
					id: statusSession!.user.id,
					repo: repository.name,
					repoId: repository.id,
					token: statusSession!.accessToken,
					user: statusSession!.user.username,
				}),
			});

			const data: VulnerabiliesCount = await response.json();
			repository.status = repo_status.Scanned;
			repository.severity = data;
			setIsLinked(true);
			setStatusBlock(<Scanned severities={repository.severity} />);
		};

		if (!buttonClicked) {
			setStatusBlock(<NotScanned setState={setButtonClicker} />);
		} else {
			fetchRepos();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [buttonClicked]);

	switch (repository.status) {
		case repo_status.NotScanned:
			return statusBlock;
		case repo_status.Scanning:
			return <Scanning />;
		case repo_status.Scanned:
			return <Scanned severities={repository.severity} />;
		default:
			return <></>;
	}
}

function NotScanned({ setState }: { setState: Function }) {
	return (
		<div className='h-full flex flex-col justify-center gap-4'>
			<p className='w-full text-center text-2xl'>Сканирование не проводилось</p>
			<div className='w-full flex justify-center'>
				<ButtonAction
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

function Scanned({ severities }: { severities: VulnerabiliesCount }) {
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
