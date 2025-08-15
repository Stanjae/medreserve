"use client";
import { addUpdateReviewAction } from "@/lib/actions/actions";
import { ReviewParams } from "@/types/actions.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useHandleReviews = (editMode: boolean, type: ReviewParams["type"]) => {
    const queryClient = useQueryClient();
    
  console.log('editMode', editMode);
  const addReview = useMutation({
    mutationFn: async (params: ReviewParams) =>
      await addUpdateReviewAction(params, editMode),
    onSettled: (data) => {
      if (data?.code == 500) {
        toast.error(data?.message);
      } else {
        toast.success(data?.message);
      }
      queryClient.invalidateQueries({
        queryKey:
          type === "doctor" ? ["doctor-reviews"] : ["appointment-reviews"],
      });
    },
  });
  return { addReview };
};

export default useHandleReviews;
