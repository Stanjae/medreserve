// app/api/initialize-transaction/route.js

import { NextResponse } from "next/server";

/**
 * Handles the POST request to initialize a transaction with Paystack.
 * 
 * This function receives a request containing transaction details, such as
 * email and amount, and sends this information to the Paystack API to 
 * initialize a transaction. It then returns Paystack's response to the client.
 * 
 * @param {Request} request - The incoming HTTP request object.
 * 
 * @returns {Promise<NextResponse>} - Returns a JSON response containing either
 * the Paystack response data or an error message.
 * 
 * The function attempts to extract the email and amount from the request body.
 * If these fields are not provided, it falls back to default values. It then
 * makes a POST request to the Paystack transaction initialization endpoint,
 * including authorization and content-type headers.
 * 
 * Errors during the process are caught and a JSON response with a status of 
 * 500 is returned, containing the error message.
 */

export async function POST(request: Request) { 
    try {
      const body = await request.json();

    // Prepare payload (use body params or fallback to defaults)
    const payload = {
      email: body?.email || "customer@email.com",
      amount: body?.amount || 500000,
    };

    // Make the request to Paystack
    const paystackRes = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY!}`, // Replace with your actual secret key or use env variable
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await paystackRes.json();

    // Return the Paystack response to the client
    return NextResponse.json(await data, { status: paystackRes.status });
  } catch (error) {
    // Handle errors gracefully
    return NextResponse.json({ error: `${error}` }, { status: 500 });
  }
}
