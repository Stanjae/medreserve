export function GET(request: Request) {
    console.log("Hello from Vercel!", request.url);
  return new Response("Hello from Vercel!");
}
