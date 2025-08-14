"use client";
import { useMedStore } from "@/providers/med-provider";
import {
  Avatar,
  Grid,
  GridCol,
  Group,
  Rating,
  Switch,
  Textarea,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import SubmitBtn from "../CButton/SubmitBtn";
import useHandleReviews from "@/hooks/useHandleReviews";
import { ReviewParams } from "@/types/actions.types";
import useCheckPatientHasReviewed from "@/hooks/useCheckPatientHasReviewed";
import Link from "next/link";

type Props = {
  doctorId: string;
};

const ReviewForm = ({ doctorId }: Props) => {
  const { credentials } = useMedStore((store) => store);

  const { data } = useCheckPatientHasReviewed(
    credentials?.databaseId as string,
    doctorId
  );

  const [reviewData, setReviewData] = useState<ReviewParams>({
    rating: 0,
    reviewText: "",
    type: "doctor",
    doctorId: doctorId,
    patientId: credentials?.databaseId as string,
    anonymous: false,
  });
  const [disabled, setDisabled] = useState(true);

  function validateReviewData(data: ReviewParams) {
    const errors = [];
    if (!data.rating || data.rating <= 0)
      errors.push("Rating must be greater than 0");
    if (!data.reviewText || data.reviewText.trim() === "")
      errors.push("Review text is required");
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  useEffect(() => {
    if (data) {
      setReviewData(data);
    }
  }, [data]);

  useEffect(() => {
    const validationResult = validateReviewData(reviewData);
    if (validationResult.isValid) {
      setDisabled(false);
    }
  }, [reviewData]);

  const {
    addReview: { mutateAsync, isPending },
  } = useHandleReviews(!!data, "doctor");

  const handleChange = (e: string | number | boolean, field: string) => {
    setReviewData({ ...reviewData, [field]: e });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutateAsync({
      ...reviewData,
      patientId: credentials?.databaseId as string,
    });
    };
    if(!credentials?.userId) {
        return <div className=" py-20">
          <Link className=" text-blue-500 text-center text-lg no-underline block" href="/auth/login">Login to leave a review</Link>
      </div>
    }

  return (
    <form onSubmit={handleSubmit}>
      <Grid gutter={"md"} overflow="hidden">
        <GridCol className="space-y-3" span={{ base: 12, md: 6 }}>
          {credentials?.userId && (
            <div className="flex items-center gap-x-3 bg-background rounded-full py-1 pl-2">
              <Avatar color="initials" radius="xl">
                {credentials?.username?.slice(0, 2)}
              </Avatar>
              <p className="text-lg capitailze font-medium">
                {credentials?.username}
              </p>
            </div>
          )}

          <div className="flex items-center gap-x-3 bg-background rounded-full py-1 pl-2">
            <p className="text-lg capitailze font-medium">Rating</p>
            <Rating
              size="md"
              name="rating"
              fractions={2}
              value={reviewData.rating}
              onChange={(e) => handleChange(e, "rating")}
            />
          </div>
          <div className="flex items-center gap-x-3 bg-background rounded-full py-2 pl-2">
            <Switch
              label="Post Anonymously"
              styles={{ label: { color: "m-gray", fontSize: "16px" } }}
              checked={reviewData.anonymous}
              onChange={(event) =>
                handleChange(event.currentTarget.checked, "anonymous")
              }
            />
          </div>
        </GridCol>
        <GridCol className="flex" span={{ base: 12, md: 6 }}>
          <Textarea
            onChange={(e) => handleChange(e.target.value, "reviewText")}
            value={reviewData.reviewText}
            className=" flex-1  grow  w-full"
            styles={{
              input: { height: "100%" },
              wrapper: {
                height: "100%",
              },
            }}
            size="lg"
            resize="none"
            radius={"lg"}
            placeholder="Enter your review"
          />
        </GridCol>
      </Grid>
      <Group justify="center" className="mt-4">
        <SubmitBtn
          text="Submit Review"
          size="md"
          radius={35}
          loading={isPending}
          type="submit"
          color="m-orange"
          disabled={disabled}
        />
      </Group>
    </form>
  );
};

export default ReviewForm;
