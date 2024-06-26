import { MouseEventHandler } from 'react';

export default function ButtonActionSmall({
	text,
	action,
}: {
	text: string;
	action?: MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<button className='py-2 bg-green_button text-xl max-w-[250px] min-w-[180px] h-3/4 rounded' onClick={action}>
			{text}
		</button>
	);
}
