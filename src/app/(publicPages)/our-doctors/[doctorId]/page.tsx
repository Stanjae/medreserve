import DoctorDetails from "@/components/boxes/DoctorDetails";
import ReviewsBox from "@/components/boxes/ReviewsBox";
import ReviewForm from "@/components/forms/ReviewForm";
import MedReserveLoader from "@/components/loaders/MedReserveLoader";
import React, { Suspense } from "react";

const page = async ({ params }: { params: Promise<{ doctorId: string }> }) => {
  const { doctorId } = await params;
  return (
    <main className="py-1">
      <section className="p-1">
        <div className=" mx-auto md:max-w-[calc(100%-316px)]">
          <section className=" mt-[150px]">
            <Suspense
              key={doctorId}
              fallback={
                <div className=" flex items-center justify-center">
                  <MedReserveLoader />
                </div>
              }
            >
              <DoctorDetails doctorId={doctorId} />
            </Suspense>
          </section>

          {/* reviews section */}
          <section className="mt-[10px]">
            <div className=" flex pt-[40px] pb-[25px] mb-[20px]  justify-center">
              <h2 className="text-secondary text-[30px] leading-[30px] font-extrabold tracking-[-0.6px] ">
                Reviews and ratings
              </h2>
            </div>
            <ReviewsBox doctorId={doctorId} />
            {/* add your code here */}
          </section>
        </div>
      </section>

      <section id="reviews" className="p-1 bg-[#EBF6FA]">
        <div className=" mx-auto md:max-w-[calc(100%-726px)]">
          {/* reviews section */}
          <section className="my-[120px]">
            <div className=" pb-[40px] mb-[10px] ">
              <h2 className="text-secondary text-[40px] leading-[70px] font-extrabold tracking-[-0.8px] text-center md:text-left ">
                Write a review
              </h2>
            </div>
            {/* add your code here */}
            <ReviewForm doctorId={doctorId} />
          </section>
        </div>
      </section>
    </main>
  );
};

export default page;
