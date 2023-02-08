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

// @ts-ignore
export const GET = (({ url }) => {
    const splitUrl = url.pathname.split("/")[2].split(",");
    let responseString = `You got it! from url ${url}\n you want to alter ${splitUrl[0]}`;

    if(splitUrl.length > 1) {
        responseString += `. With ${splitUrl.length - 1} more elements`;
    }


    return new Response(responseString);
});

