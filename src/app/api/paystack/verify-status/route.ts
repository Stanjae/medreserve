import { NextResponse } from "next/server";

  export async function GET(request: Request) { 
      try {
        const body = await request.json();
  
      // Prepare payload (use body params or fallback to defaults)
      const payload = {
        reference: body?.email || "customer@email.com",
        amount: body?.amount || 500000,
      };
  
      // Make the request to Paystack
      const paystackRes = await fetch(
        `https://api.paystack.co/transaction/verify/:reference`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY!}`, // Replace with your actual secret key or use env variable
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      console.log('unit', paystackRes)
      const data = await paystackRes.json();
  
      // Return the Paystack response to the client
      return NextResponse.json(await data, { status: paystackRes.status });
    } catch (error) {
      // Handle errors gracefully
      return NextResponse.json({ error: `${error}` }, { status: 500 });
    }
  }