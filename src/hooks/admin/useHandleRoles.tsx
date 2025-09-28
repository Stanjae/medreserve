"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DefaultRoles, ModifiedRoles } from "../../../types/appwrite";
import { bulkAssignUsersToNewRoleAction, createRoleAction, deleteRoleAction, updateRoleAction } from "@/lib/actions/adminActions";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/queryclient/querk-keys";
import { AssignUsersToNewRoleParams } from "@/types/actions.types";

const useHandleRoles = () => {
  const queryClient = useQueryClient();

  const addRole = useMutation({
    mutationFn: async (params: DefaultRoles) => await createRoleAction(params),
    onSettled: (data) => {
      if (data?.code == 200) {
        toast.success(data?.message);
      } else {
         toast.error(data?.message);
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLES.getAllRoles],
      });
    },
  });

  const updateRole = useMutation({
    mutationFn: async (params: ModifiedRoles) => await updateRoleAction(params),
    onSuccess: (data) => {
      if (data?.code == 200) {
         toast.success(data?.message);
      } else {
         toast.error(data?.message); 
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ROLES.getAllRoles],
      });
    },
  });
    
      const removeRole = useMutation({
        mutationFn: async (paramsId:string) =>
          await deleteRoleAction(paramsId),
        onSuccess: (data) => {
          if (data?.code == 200) {
            toast.success(data?.message);
          } else {
            toast.error(data?.message);
          }
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.ROLES.getAllRoles],
          });
        },
      });
  
        const bulkAssignUsersToNewRole = useMutation({
          mutationFn: async (params: AssignUsersToNewRoleParams[]) =>
            await bulkAssignUsersToNewRoleAction(params),
          onSuccess: (data) => {
            if (data?.code == 200) {
              toast.success(data?.message);
            } else {
              toast.error(data?.message);
            }
            Promise.all([
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.ROLES.getAllRoles],
            }),
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.ROLES.getUsersByRole],
            }),
            ]);
          },
        });
  return { addRole, updateRole, removeRole, bulkAssignUsersToNewRole };
};

export default useHandleRoles;
