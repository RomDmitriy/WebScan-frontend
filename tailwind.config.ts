/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: '#292929',
				red_button: '#C5221F',
				green_button: '#39A904',
				block_background: '#3D3D3D',
				block_background_light: '#535353',
				block_background_lighter: '#5A5A5A',
				stroke: '#747474',
				severity_high_level: '#C93C37',
				severity_moderate_level: '#E09900',
				severity_low_level: '#8C9AAB',
			},
			fontSize: {
				mainMenuButton: '28px',
			},
		},
	},
	plugins: [],
};
