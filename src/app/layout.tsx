import type { Metadata } from "next";
import "./globals.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "@/constants/theme";
import "@mantine/dates/styles.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { MedStoreProvider } from "@/providers/med-provider";
import { checkAuthStatus } from "@/lib/actions/authActions";
import { Toaster } from "sonner";
import QueryProviders from "@/providers/query-provider";
import AuthInitializer from "@/providers/AuthInitializer";
import { Suspense } from "react";
import ToastHandler from "@/providers/ToastHandler";

dayjs.extend(customParseFormat);

export const metadata: Metadata = {
  title: "MedReserve",
  description: "...Getting you the best care",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = await checkAuthStatus();

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning className={`demo antialiased`}>
        <MantineProvider theme={theme}>
          <MedStoreProvider>
            <AuthInitializer auth={auth} />
            <Suspense fallback={null}>
              <ToastHandler />
            </Suspense>
            <QueryProviders>{children}</QueryProviders>
            <Toaster position="top-right" richColors />
          </MedStoreProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
