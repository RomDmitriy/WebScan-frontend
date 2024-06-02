'use client';

import LoginGithub from '@/components/LoginGithub';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Auth() {
	const { status } = useSession();

	if (status === 'authenticated') redirect('/dashboard');

	return (
		<div className='window flex justify-center flex-col h-fit mt-44'>
			<p className='text-center font-bold text-[46px]'>Войти в аккаунт</p>
			<LoginGithub />
		</div>
	);
}
