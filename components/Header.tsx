'use client';

import Image from 'next/image';
import logo from '@/public/logo-header.png';
import Link from 'next/link';
import { RxExit } from 'react-icons/rx';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
	return (
		<header className='px-9 py-8 flex justify-between w-full bg-background'>
			<Link href='/'>
				<Image src={logo} width={181} className='m-4' alt='logo' />
			</Link>
			<UserData />
		</header>
	);
}

function UserData() {
	const { data: session, status } = useSession();

	if (status === 'authenticated') {
		return (
			<div className='flex flex-row items-center gap-4'>
				<Link href='/dashboard' className='flex flex-row items-center gap-1'>
					<Image
						src={session.user?.image as string}
						width={48}
						height={48}
						className='rounded-full m-2'
						alt=''
					/>
					<p className='text-xl'>{session.user?.username}</p>
				</Link>
				<button onClick={() => signOut({ callbackUrl: '/', redirect: true })} title='Выйти'>
					<RxExit size={26} />
				</button>
			</div>
		);
	}
}
