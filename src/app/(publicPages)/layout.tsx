import MedReserveBreadCrumbs from "@/components/atoms/breadcrumbs/MedReserveBreadCrumbs";
import Footer from "@/components/footer/Footer";
import PageHeaders from "@/components/headers/PageHeaders";
import MainNavbar from "@/components/navbar/MainNavbar";
import NavContent from "@/components/navbar/NavContent";
import { Box } from "@mantine/core";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <MainNavbar />
      <section className=" overflow-hidden w-full bg-[#EBF6FA] ">
        <NavContent py="30" bg="" />
        <Box
          className="max-w-[calc(100%-316px)] mt-[101px] mb-[130px] space-y-[13px]"
          mx="auto"
        >
          <PageHeaders />
          <MedReserveBreadCrumbs />
        </Box>
      </section>
      {children}
      <Footer/>
    </main>
  );
}
