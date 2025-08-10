import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `https://api.paystack.co/bank?country=nigeria`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY!}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Request failed");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
