'use client';

import { IoIosArrowDropdown, IoIosArrowDropright } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { severity_type } from '@prisma/client';
import { PackageWithVulnerability, SourceInfo } from '@/types/source.types';
import ButtonSeverityDetails from './ButtonSeverityDetails';

export default function SourceBlock({ src }: { src: SourceInfo }) {
	const [isOpened, setIsOpened] = useState(false);

	useEffect(() => {
		setIsOpened(isOpened);
	}, [isOpened]);

	return (
		<div className='flex flex-col my-4'>
			<div
				className='flex justify-between mx-8 px-6 py-4 bg-block_background_lighter border-stroke border cursor-pointer select-none  rounded'
				onClick={async () => setIsOpened(!isOpened)}
			>
				<div className='flex flex-row gap-3'>
					{isOpened ? <IoIosArrowDropdown size={30} /> : <IoIosArrowDropright size={30} />}
					<p className='text-2xl'>{src.path}</p>
				</div>
				<p className='text-2xl'>
					{src.packages.length} {getDeclination(src.packages.length)}
				</p>
			</div>
			<div className={`flex flex-col mx-8 ${isOpened ? 'flex' : 'hidden'}`}>
				<Severities packages={src.packages} />
			</div>
		</div>
	);
}

enum _severityPower {
	High = 2,
	Moderate = 1,
	Low = 0,
}

function Severities({ packages }: { packages: PackageWithVulnerability[] }) {
	return packages.length ? (
		packages
			.sort((a, b) => {
				return _severityPower[b.severity.severity] - _severityPower[a.severity.severity];
			})
			.map((pkg) => <SeverityBlock key={pkg.severity.id} pkg={pkg} />)
	) : (
		<p className='w-full flex justify-center text-3xl mt-5'>Уязвимостей нет</p>
	);
}

function SeverityBlock({ pkg }: { pkg: PackageWithVulnerability }) {
	return (
		<div className='w-full bg-block_background_light flex flex-row px-4 py-3 justify-between border-stroke border-x border-b'>
			<div className='flex flex-row gap-2 items-center'>
				<SeverityLevelBlock severity={pkg.severity.severity} />
				<p className='text-xl'>
					{pkg.ecosystem} package - {pkg.name} @ {pkg.version}
				</p>
			</div>
			<ButtonSeverityDetails text='Подробнее' href={`/vuln/${pkg.severity.id}`} />
		</div>
	);
}

function getDeclination(num: number): string {
	const lastNum = num % 10;
	if (num >= 5 && num <= 20) return 'уязвимостей';
	if (lastNum === 0 || lastNum >= 5) return 'уязвимостей';
	if (lastNum >= 2 && lastNum <= 4) return 'уязвимости';
	if (lastNum === 1) return 'уязвимость';

	console.error('Неподдерживаемое кол-во уязвимостей:', num);
	return 'уязвимость(-ей)';
}

function SeverityLevelBlock({ severity }: { severity: severity_type }): React.JSX.Element {
	switch (severity) {
		case severity_type.High: {
			return <High />;
		}
		case severity_type.Moderate: {
			return <Moderate />;
		}
		case severity_type.Low: {
			return <Low />;
		}
	}
}

function High() {
	return (
		<div className='border border-severity_high_level rounded-full w-[80px] text-center text-severity_high_level p-1'>
			High
		</div>
	);
}

function Moderate() {
	return (
		<div className='border border-severity_moderate_level rounded-full w-[80px] text-center text-severity_moderate_level p-1'>
			Moderate
		</div>
	);
}

function Low() {
	return (
		<div className='border border-severity_low_level rounded-full w-[80px] text-center text-severity_low_level p-1'>
			Low
		</div>
	);
}
