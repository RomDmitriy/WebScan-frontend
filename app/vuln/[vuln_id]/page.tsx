'use client';

import Hyperlink from '@/components/Hyperlink';
import { Reference } from '@/types/references.types';
import { vulnerabilities } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

type vulnerabilityWithRefs = vulnerabilities & { references: Reference[] };

export default function VulnPage({ params }: { params: { vuln_id: string } }) {
	useSession({
		required: true,
		onUnauthenticated() {
			redirect('/auth');
		},
	});

	const [isLoading, setIsLoading] = useState(true);
	const [vulnData, setVulnData] = useState<vulnerabilityWithRefs>();

	useEffect(() => {
		const getInfo = async () => {
			let response = await fetch(`/api/vulnerability?vuln_id=${params.vuln_id}`, {
				method: 'GET',
			});

			const data: vulnerabilityWithRefs = await response.json();
			response = await fetch(`/api/references?vuln_id=${params.vuln_id}`, {
				method: 'GET',
			});
			data.references = await response.json();
			setVulnData(data);
			setIsLoading(false);
		};
		getInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return isLoading ? (
		<p>Загрузка...</p>
	) : (
		<div className='w-fit h-fit flex flex-col justify-center items-center'>
			<p className='text-3xl text-center font-bold'>{params.vuln_id}</p>
			<VulnBlock vulnData={vulnData!} />
		</div>
	);
}

function VulnBlock({ vulnData }: { vulnData: vulnerabilityWithRefs }) {
	return (
		<div className='bg-block_background p-6 mt-6 w-2/3 rounded'>
			<table className='border-separate border-spacing-x-4 border-spacing-y-1' align='left'>
				<tbody>
					<tr>
						<th scope='row' className='align-top text-left'>
							Источник:
						</th>
						<td>
							<Hyperlink
								href={`https://osv.dev/vulnerability/` + vulnData.id}
								text={`https://osv.dev/vulnerability/` + vulnData.id}
							/>
						</td>
					</tr>
					<tr>
						<th scope='row' className='align-top text-left'>
							Псевдонимы:
						</th>
						<td>
							<MarkedListStr list={vulnData.aliases} />
						</td>
					</tr>
					<tr>
						<th scope='row' className='align-top text-left'>
							Опубликовано:
						</th>
						<td>{vulnData.published.toString()}</td>
					</tr>
					<tr>
						<th scope='row' className='align-top text-left'>
							Изменено:
						</th>
						<td>{vulnData.modified.toString()}</td>
					</tr>
					<tr className='h-6'></tr>
					<tr>
						<th scope='row' className='align-top text-left'>
							Кратко (англ.):
						</th>
						<td>{vulnData.summary}</td>
					</tr>
					<tr>
						<th scope='row' className='align-top text-left'>
							Детали (англ.):
						</th>
						<td>{vulnData.details}</td>
					</tr>
					<tr className='h-6'></tr>
					<tr>
						<th scope='row' className='align-top text-left'>
							Ссылки:
						</th>
						<td>
							<MarkedListRefs list={vulnData.references} />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

function MarkedListStr({ list }: { list: string[] }) {
	if (!list.length) return <p>Пусто</p>;

	const elements = list.map((elem) => <li key={elem}>{elem}</li>);

	return <ul className='list-disc ml-5'>{elements}</ul>;
}

function MarkedListRefs({ list }: { list: Reference[] }) {
	if (!list.length) return <p>Пусто</p>;

	const elements = list.map((elem) => (
		<li key={elem.id}>
			<Hyperlink href={elem.url} text={elem.type} />
		</li>
	));

	return <ul className='list-disc ml-5'>{elements}</ul>;
}
