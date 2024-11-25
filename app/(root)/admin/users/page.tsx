"use client";
//@typescript-eslint/no-explicit-any
import { useEffect, useState } from "react";
import { User } from "@/app/api/auth/sign-in/route";
import { toast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { ErrorDataType } from "@/app/(auth)/sign-in/[[...sign-in]]/page";


import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/lib/client/services/admin/userApi";
import { TableComponent } from "@/components/TableComponent";
import Header from '@/app/(root)/admin/_header'

export default function Home() {

  // useGetAllUsersQuery : hook to fetch user data
  const { data: users, isSuccess, isLoading } = useGetAllUsersQuery();
  // useDeleteUserMutation : Mutation hook to handle user deletion
  const [deleteOneUser, { isLoading: isDeleteLoading }] =
    useDeleteUserMutation();


  // state for users data
  const [usersData, setUsersData] = useState<User[]>([]);


  // State to control the visibility of the delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  // State to store the ID of the user to be deleted
  const [selectedUserId, setSelectedUserId] = useState<string | number>("");


  useEffect(() => {
    if (users && isSuccess) {
      setUsersData(users?.data);
    }
  }, [users, isSuccess]);

  useEffect(() => {
    if (isDeleteLoading) {
      toast({
        title: "Loading",
        description: "Loading users data",
      });
    }
  }, [isDeleteLoading]);

  //function to delete one user
  const deleteUser = async (id: string | number) => {
    try {
      await deleteOneUser(id).unwrap();
      toast({
        title: "Delete Success",
        description: "User deleted successfully",
      });
    } catch (error: unknown) {
      const errorData = error as ErrorDataType;
      toast({
        title: "Failed to delete user",
        description: errorData?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  // handle click on delete one user and open confirm modal
  const handleDelete = (id: string | number) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  };

  const handleView = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  }
  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  }

  return (
    <>
      <Header/>
      <TableComponent
        header={["ID", "Username", "Email", "Role", "Active"]}
        dataColumn={["id", "username", "email", "role", "active"]}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
        data={usersData}
        isLoading={isLoading}
      />
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteUser(selectedUserId)}
      />
    </>
  );
}


