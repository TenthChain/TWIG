import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
	console.log('Got request');

	console.log(event.request.headers.get('cookie'));

	if (event.url?.pathname?.includes('admin')) {
		if (
			event.request.headers.get('cookie')?.indexOf(`authenticated=${encodeURI(env.admin_password)}`)
		) {
			console.log('Found!');
		} else {
			console.log('Not found');
			throw redirect(301, '/');
		}
	}

	const response = await resolve(event);
	return response;
}
