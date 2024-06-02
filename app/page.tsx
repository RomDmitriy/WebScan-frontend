'use client';

import Link from 'next/link';

export default function MainPage() {
	return (
		<div className='w-[36%]'>
			<div className='text-8xl text-center font-bold'>WebScan</div>
			<div className='text-3xl text-center'>
				это универсальная система для анализа и поиска уязвимостей в Ваших проектах
			</div>
			<div className='flex justify-between pt-[38px]'>
				<MainPageButton text='Подробнее' href='/about' />
				<MainPageButton text='Войти' href='/auth' />
			</div>
		</div>
	);
}

//TODO: добавить картинку на задний фон

function MainPageButton({ text, href }: { text: string; href: string }) {
	return (
		<Link
			className={`bg-red_button p-[6px] w-2/5 h-[60px] text-2xl flex justify-center items-center pt-3]`}
			href={href}
		>
			{text}
		</Link>
	);
}
