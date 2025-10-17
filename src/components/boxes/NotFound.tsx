'use client';
import { Button } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  pageType?: 'content' | 'page'
  errorCode?: '404' | '500'
}

export default function NotFound404({pageType ="page", errorCode = '404'}:Props) {
  const router = useRouter()
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-600">{errorCode}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            {pageType === "content" ? "Content" : "Page"} not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Sorry, we couldn’t find the{" "}
            {pageType === "content" ? "Content" : "Page"} you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="md" onClick={() => router.back()}>
              Go Back
            </Button>
            <Link
              href="/contact-us"
              className="text-sm font-semibold text-gray-900"
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
