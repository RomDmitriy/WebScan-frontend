import Link from 'next/link';

export default function ButtonSeverityDetails({ text, href }: { text: string; href: string }) {
	return (
		<Link className='py-2 bg-stroke text-center text-xl max-w-[250px] min-w-[180px] h-2/4 rounded mr-3' href={href}>
			{text}
		</Link>
	);
}
