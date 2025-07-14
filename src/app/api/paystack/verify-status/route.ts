import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${queryParams.ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY!}`, // Replace with your actual secret key or use env variable
          "Content-Type": "application/json",
        },
      }
    );
    const data = await paystackRes.json();
    console.log("unit", data);
    // Return the Paystack response to the client
    return NextResponse.json(await data, { status: paystackRes.status });
  } catch (error) {
    // Handle errors gracefully
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
