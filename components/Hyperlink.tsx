import Link from 'next/link';
import { GoLinkExternal } from 'react-icons/go';

export default function Hyperlink({ href, text }: { href: string; text: string }) {
	return (
		<Link href={href} className='flex flex-row gap-1 underline text-nowrap'>
			{text}
			<GoLinkExternal />
		</Link>
	);
}
