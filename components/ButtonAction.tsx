import { MouseEventHandler } from 'react';

export default function ButtonAction({
	text,
	action,
}: {
	text: string;
	action?: MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<button className='py-3 bg-green_button max-w-[250px] min-w-[180px] rounded' onClick={action}>
			{text}
		</button>
	);
}
