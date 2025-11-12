import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);

    const response = await fetch(
      `https://api.paystack.co/bank/resolve?account_number=${queryParams.accountNumber}&bank_code=${queryParams.bankCode}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY!}`, // Replace with your actual secret key or use env variable
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
