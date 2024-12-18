"use client";
//@typescript-eslint/no-explicit-any
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { ErrorDataType } from "@/app/(auth)/sign-in/[[...sign-in]]/page";
import {
    useGetAllInviteUsersQuery,
    useDeleteInvitedUserMutation,
    useDeleteManyInvitedUserMutation,
    useResendInvitationMutation,
} from "@/lib/client/services/admin/inviteUserApi";
import { TableComponent } from "@/components/TableComponent";
import { invitedUser } from "@/lib/server/utils/authUtils";

export default function Home() {
    // useGetAllUsersQuery : hook to fetch user data
    const { data: users, isSuccess, isLoading } = useGetAllInviteUsersQuery();
    // useDeleteUserMutation : Mutation hook to handle user deletion
    const [deleteOneInvitedUser, { isLoading: isDeleteLoading }] =
        useDeleteInvitedUserMutation();

    //useDeleteManyInvitedUserMutation : Mutation hook to handle multiple invited user deletion
    const [deleteManyInvitedUsers, { isLoading: isDeleteManyLoading }] =
        useDeleteManyInvitedUserMutation();

    //use ResendInvitationMutation : Mutation hook to handle resending invitation
    const [resendInvitedUser, { isLoading: isResendInviteLoading }] =
        useResendInvitationMutation();

    // state for users data
    const [usersData, setUsersData] = useState<invitedUser[]>([]);

    // State to control the visibility of the delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isDeleteManyModalOpen, setIsDeleteManyModalOpen] =
        useState<boolean>(false);
    const [isResendInviteModalOpen, setIsResendInviteModalOpen] =
        useState<boolean>(false);

    // State to store the ID of the user to be selected
    const [selectedInvitedUserId, setSelectedInvitedUserId] =
        useState<string>("");
    const [selectedManyInvitedUserId, setSelectedManyInvitedUserId] = useState<string[]>([]);

    useEffect(() => {
        if (users && isSuccess) {
            setUsersData(users?.data);
        }
    }, [users, isSuccess]);

    useEffect(() => {
        if (isDeleteLoading || isDeleteManyLoading) {
            toast({
                title: "Deleting",
                description: "Deleting invited users data",
            });
        } else if (isResendInviteLoading) {
            toast({
                title: "Resending Invitation...",
                description: "Resending invitation",
            });
        }
    }, [isDeleteLoading, isDeleteManyLoading, isResendInviteLoading]);

    //function to delete one invited user
    const deleteInvitedUser = async (id: string | number) => {
        try {
            await deleteOneInvitedUser(id).unwrap();
            toast({
                title: "Delete Success",
                description: "User deleted successfully",
            });
        } catch (error) {
            const errorData = error as ErrorDataType;
            toast({
                title: "Failed to delete user",
                description: errorData?.data?.message || "Failed to delete user",
                variant: "destructive",
            });
        }
    };
    // function to delete multiple invited users
    const deleteManyInvited = async (ids: string[]) => {
        try {
            await deleteManyInvitedUsers(ids).unwrap();
            toast({
                title: "Delete Success",
                description: "Invited users deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Failed to delete users",
                description:
                    (error as ErrorDataType).data.message || "Some error occurred",
                variant: "destructive",
            });
        }
    };
    // function to resend invite user
    const resendInvitation = async (id: string) => {
        console.log("resend id :", id);
        try {
            await resendInvitedUser(id).unwrap();
            toast({
                title: "Resend Success",
                description: "Invite sent successfully to the user",
            });
        } catch (error) {
            const errorData = error as ErrorDataType;
            toast({
                title: "Failed to resend invite",
                description: errorData?.data?.message || "Failed to resend invite",
                variant: "destructive",
            });
        }
    };

    // handle click on delete one user and open confirm modal
    const handleDelete = (id: string) => {
        setSelectedInvitedUserId(id);
        setIsDeleteModalOpen(true);
    };

    const handleView = (id: string) => {
        console.log("view id :", id);
        setSelectedInvitedUserId(id);
        setIsDeleteModalOpen(true);
    };
    const handleEdit = (id: string) => {
        console.log("edit id :", id);
        setSelectedInvitedUserId(id);
        setIsDeleteModalOpen(true);
    };
    const handleManyDelete = async (ids: string[]) => {
        setSelectedManyInvitedUserId(ids);
        setIsDeleteManyModalOpen(true);
    };
    const handleResendInvite = async (id: string) => {
        console.log("resend id :", id);
        setSelectedInvitedUserId(id);
        setIsResendInviteModalOpen(true);
    };
    return (
        <>
            <TableComponent
                header={[
                    "ID",
                    "Email",
                    "Role",
                    "Status",
                    "Created",
                    "Expires",
                    "invited by",
                ]}
                dataColumn={[
                    "id",
                    "email",
                    "role",
                    "status",
                    "createdAt",
                    "expiredAt",
                    "invitedByUsername",
                ]}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onView={handleView}
                data={usersData}
                isLoading={isLoading}
                onManyDelete={handleManyDelete}
                onResendInvite={handleResendInvite}
                tableType={"invitedUser"}
            />
            <ConfirmDialog
                isOpen={isDeleteModalOpen}
                description={
                    <>
                        This action cannot be undone. This will permanently{" "}
                        <b>delete this invitation user</b> and remove data from our servers.
                    </>
                }
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => deleteInvitedUser(selectedInvitedUserId)}
            />
            <ConfirmDialog
                isOpen={isDeleteManyModalOpen}
                description={
                    <>
                        This action cannot be undone. This will permanently{" "}
                        <b>delete all this invitation user</b> and remove data from our
                        servers.
                    </>
                }
                onClose={() => setIsDeleteManyModalOpen(false)}
                onConfirm={() => deleteManyInvited(selectedManyInvitedUserId)}
            />
            <ConfirmDialog
                isOpen={isResendInviteModalOpen}
                description={
                    <>
                        This action will re-send email invitation to this user. If you want
                        to <b>resend invitation</b> click confirm.
                    </>
                }
                onClose={() => setIsResendInviteModalOpen(false)}
                onConfirm={() => resendInvitation(selectedInvitedUserId)}
                buttonConfirmStyle="bg-dark-3"
            />
        </>
    );
}
