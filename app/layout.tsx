import Header from '@/components/Header';
import { Overpass } from 'next/font/google';

import './globals.css';
import SessionProvider from '@/components/SessionProvider';
import { auth } from '@/auth';

const overpass = Overpass({
	subsets: ['cyrillic'],
	fallback: ['Arial'],
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await auth();

	return (
		<html lang='ru' className='h-full'>
			<body className='h-full flex flex-col' style={overpass.style}>
				<SessionProvider session={session}>
					<Header />
					<div className='flex items-center justify-center pb-[50px]'>{children}</div>
				</SessionProvider>
			</body>
		</html>
	);
}
