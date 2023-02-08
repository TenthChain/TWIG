/*

Example "url" object

URL {
  href: 'http://localhost:5173/led/123,456,789',
  origin: 'http://localhost:5173',
  protocol: 'http:',
  username: '',
  password: '',
  host: 'localhost:5173',
  hostname: 'localhost',
  port: '5173',
  pathname: '/led/123,456,789',
  search: '',
  searchParams: URLSearchParams {},
  hash: ''
}
*/

// Import Environment variables from .env file
import { env } from "$env/dynamic/private";

// Import pocketbase
import PocketBase from "pocketbase";

// Setup pocketbase client for communicating to server with. Plus auth 
// to prevent random users from submitting requests unless authored by SvelteKit
const pb = new PocketBase("http://127.0.0.1:8090");
const userData = await pb.collection('users').authWithPassword(env.pb_username, env.pb_username);

// @ts-ignore
export const GET = ( async ({ url }) => {

    const record = await pb.collection('settings').getOne('pds4l4a8k1jjtvm');
    
    const splitUrl = url.pathname.split("/")[2].split(",");
    let responseString = `You got it! from url ${url}\n you want to alter ${splitUrl[0]}`;

    if(splitUrl.length > 1) {
        responseString += `. With ${splitUrl.length - 1} more elements \n\nwith record returning ${record["setting_name"]}`;
    }

    const data = {
        "led_to_update": 123,
        "requested_by": url.host,
        "r": 123,
        "g": 123,
        "b": 123,
        "brightness": 100,
        "completed": false
    };

    try {
        const newRecord = await pb.collection('led_requests').create(data);
        console.log(newRecord); 
        responseString +=  `\n\nAnd the response from pb being created on ${newRecord["created"]}`
    } catch (error) {
        responseString +=  `\n\nAnd the        ERROR        from pb being ${error}`
    }

    return new Response(responseString);
});

