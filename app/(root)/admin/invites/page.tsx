"use client";
//@typescript-eslint/no-explicit-any
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { ErrorDataType } from "@/app/(auth)/sign-in/[[...sign-in]]/page";

import { useGetAllInviteUsersQuery, useDeleteInvitedUserMutation } from "@/lib/client/services/admin/inviteUserApi";
import { TableComponent } from "@/components/TableComponent";
import Header from '@/app/(root)/admin/_header'
import { invitedUser } from "@/lib/server/utils/authUtils";

export default function Home() {

    // useGetAllUsersQuery : hook to fetch user data
    const { data: users, isSuccess, isLoading } = useGetAllInviteUsersQuery();
    // useDeleteUserMutation : Mutation hook to handle user deletion
    const [deleteOneInvitedUser, { isLoading: isDeleteLoading }] =
        useDeleteInvitedUserMutation();


    // state for users data
    const [usersData, setUsersData] = useState<invitedUser[]>([]);

    // State to control the visibility of the delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    // State to store the ID of the user to be deleted
    const [selectedInvitedUserId, setSelectedInvitedUserId] = useState<string | number>("");


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
    const deleteInvitedUser = async (id: string | number) => {
        try {
            await deleteOneInvitedUser(id).unwrap();
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
        setSelectedInvitedUserId(id);
        setIsDeleteModalOpen(true);
    };

    const handleView = (id: string) => {
        setSelectedInvitedUserId(id);
        setIsDeleteModalOpen(true);
    }
    const handleEdit = (id: string) => {
        setSelectedInvitedUserId(id);
        setIsDeleteModalOpen(true);
    }
    return (
        <>
            <Header />
            <TableComponent
                header={["ID", "Email", "Role", "Status", "Created", "Expires"]}
                dataColumn={["id", "email", "role", "status", "createdAt", "expiredAt"]}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onView={handleView}
                data={usersData}
                isLoading={isLoading}
            />
            <ConfirmDialog
                isOpen={isDeleteModalOpen}
                description={<>This action cannot be undone. This will permanently <b>delete this invitation user</b>  and remove data from our servers.</>}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => deleteInvitedUser(selectedInvitedUserId)}
            />
        </>
    );
}


