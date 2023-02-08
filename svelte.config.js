import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	"paths": {
		"$lib": [
			"src/lib"
		],
		"$lib/*": [
			"src/lib/*"
		]
	},
};

export default config;
