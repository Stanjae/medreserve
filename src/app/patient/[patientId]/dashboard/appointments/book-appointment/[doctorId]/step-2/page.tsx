"use client";
import { Button } from "@mantine/core";
import React from "react";
import PaystackPop from "@paystack/inline-js";

const page = () => {
  const handleTransaction = async () => {
    const popup = new PaystackPop();
    const response = await fetch("/api/paystack/initialize-transaction", {
      method: "POST",
      body: JSON.stringify({ email: "jerry@gmail.com", amount: 20000.00 }),
    });
    const data = await response.json();
      const resume = popup.resumeTransaction(data?.data?.access_code, {
          onSuccess: (transaction) => {
            console.log("success", transaction);
      }});
    console.log("response", data, resume);
  };

  const handlePurge = async () => {
    const params = {
      email: "customer@email.com",
      amount: "500000",
    };

    const query = {
      ref: "abc123",
      type: "init",
    };

    // Combine both objects into one
    const allParams = { ...params, ...query };

    // Create query string
    const queryString = new URLSearchParams(allParams).toString();
    const url = `/api/initialize?${queryString}`;
    console.log("url", url);
    console.log('params', allParams)
    
  }
  return (
    <div>
      purge
      <Button onClick={handleTransaction}>initialize Payment</Button>
      <Button onClick={handlePurge}>purge</Button>
    </div>
  );
};

export default page;
