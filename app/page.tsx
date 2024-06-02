'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function MainPage() {
	const { status } = useSession();
	let buttonText = 'Войти';
	let buttonHref = '/auth';

	if (status === 'authenticated') {
		buttonText = 'В профиль';
		buttonHref = '/dashboard';
	}

	return (
		<div className='w-[36%] flex flex-col justify-end mt-44'>
			<div className='text-8xl text-center font-bold'>WebScan</div>
			<div className='text-3xl text-center'>
				это универсальная система для анализа и поиска уязвимостей в Ваших проектах
			</div>
			<div className='flex justify-between pt-[38px]'>
				<MainPageButton text={buttonText} href={buttonHref} />
			</div>
		</div>
	);
}

function MainPageButton({ text, href }: { text: string; href: string }) {
	return (
		<Link
			className={`bg-red_button p-[6px] w-full h-[60px] text-2xl flex justify-center items-center pt-3] rounded`}
			href={href}
		>
			{text}
		</Link>
	);
}
