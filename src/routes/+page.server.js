import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request }) => {
		console.log('Hello!');

		const data = await request.formData();
		const password = data.get('password');

		console.log(password);

		if (password == env.admin_password) {
			console.log('Success!');
			cookies.set('authenticated', password, {
				secure: true,
				httpOnly: false,
				path: '/'
			});
			throw redirect(301, '/admin');
		}
	}
};
