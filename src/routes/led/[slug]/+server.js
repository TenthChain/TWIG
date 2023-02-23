/*

Example "url" object

URL {
  href: "http://localhost:5173/led/123,456,789", localhost:5173/led/5,100,255,255,255
  origin: "http://localhost:5173",
  protocol: "http:",
  username: "",
  password: "",
  host: "localhost:5173",
  hostname: "localhost",
  port: "5173",
  pathname: "/led/123,456,789",
  search: "",
  searchParams: URLSearchParams {},
  hash: ""
}
*/

// Import Environment variables from .env file
import { env } from "$env/dynamic/private";

// Import pocketbase
import PocketBase from "pocketbase";

// Setup pocketbase client for communicating to server with. Plus auth 
// to prevent random users from submitting requests unless authored by SvelteKit
const pb = new PocketBase(env.pb_url);
const userData = await pb.collection("users").authWithPassword(env.pb_username, env.pb_username);

// @ts-ignore
export const GET = ( async ({ url }) => {

    console.log("Got request!")

    const isServerEnabledRecord = await pb.collection('settings').getFirstListItem('setting_name="server_enabled"');

    if (!isServerEnabledRecord["value"]) {
        return new Response("Failed. Server not enabled.");
    }

    let led = -1;
    let bri = -1;
    let r = -1;
    let g = -1;
    let b = -1;
    
    const splitUrl = url.pathname.split("/")[2].split(",");
    let responseString = `You got it! from url ${url}\n you want to alter ${splitUrl[0]}`;

    switch (splitUrl.length) {
        // Toggle on/off for LED
        case 1:
            led = splitUrl[0];
            break;

        // Set LED brightness
        case 2:
            led = splitUrl[0];
            bri = splitUrl[1];
            break;
    
        // Set LED colour
        case 4:
            led = splitUrl[0];
            r = splitUrl[1];
            g = splitUrl[2];
            b = splitUrl[3];
            break;

        // Set LED brightness and colour
        case 5:
            led = splitUrl[0];
            bri = splitUrl[1];
            r = splitUrl[2];
            g = splitUrl[3];
            b = splitUrl[4];
            break;

        // ???
        default:
            responseString += `\n\n Really...? Only ${splitUrl.length} parameters?`;
            break;
    }

    const data = {
        "led_to_update": led,
        "requested_by": url.host,
        "r": r,
        "g": g,
        "b": b,
        "brightness": bri,
        "completed": false
    };

    responseString += `\n\n Final data being \nled_to_update being ${led}, \nrequested_by being ${url.host}, \nr being ${r}, \ng being ${g}, \nb being ${b}, \nbrightness being ${bri}, \ncompleted being ${false}`;

    try {
        const newRecord = await pb.collection("led_requests").create(data);
        responseString +=  `\n\nAnd the response from pb being created on ${newRecord["created"]}`;
    } catch (error) {
        responseString +=  `\n\nAnd the        ERROR        from pb being ${error}`;
    }

    return new Response(responseString);
});

