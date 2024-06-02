import Link from 'next/link';

export default function ButtonMainPage({ text, href }: { text: string; href: string }) {
	return (
		<Link
			className={`bg-red_button p-[6px] w-full h-[60px] text-2xl flex justify-center items-center pt-3] rounded`}
			href={href}
		>
			{text}
		</Link>
	);
}
