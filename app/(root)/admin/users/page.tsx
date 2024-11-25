"use client";
//@typescript-eslint/no-explicit-any
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "@/app/api/auth/sign-in/route";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import { AuthState } from "@/lib/client/stores/slices/authSlice";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { ErrorDataType } from "@/app/(auth)/sign-in/[[...sign-in]]/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteUserFormSchema, InviteUserFormValues } from "@/lib/definitions";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/lib/client/services/admin/userApi";
import { useInviteUserMutation } from "@/lib/client/services/admin/inviteUserApi";
import { TableComponent } from "@/components/TableComponent";

export default function Home() {
  // Get the authenticated user from the Redux store
  const userAuth = useSelector((state: { auth: AuthState }) => state.auth.user);

  // useGetAllUsersQuery : hook to fetch user data
  const { data: users, isSuccess, isLoading } = useGetAllUsersQuery();
  // useDeleteUserMutation : Mutation hook to handle user deletion
  const [deleteOneUser, { isLoading: isDeleteLoading }] =
    useDeleteUserMutation();
  // useInviteUserMutation : Mutation hook to handle user invitation
  const [inviteUser, { isLoading: isInviteUserLoading }] =
    useInviteUserMutation();

  // state for users data
  const [usersData, setUsersData] = useState<User[]>([]);

  // State to track checked items for selection
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // State to control the visibility of the delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isInviteUserOpen, setIsInviteUserOpen] = useState<boolean>(false);
  // State to store the ID of the user to be deleted
  const [selectedUserId, setSelectedUserId] = useState<string | number>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteUserFormValues>({
    resolver: zodResolver(InviteUserFormSchema),
  });

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

  console.log("checked : ", checkedItems);
  // handle click on delete one user and open confirm modal
  const handleDelete = (id: string | number) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  };

  const handleView = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteModalOpen(true);
  }
const handleEdit = (id: string)=>{
  setSelectedUserId(id);
  setIsDeleteModalOpen(true);
}
  // Function to handle form submission
  const submitInvite = async (data: InviteUserFormValues) => {
    try {
      await inviteUser(data).unwrap();
      toast({
        title: "Success",
        description: "User invited successfully",
      });
    } catch (error) {
      const errorData = error as ErrorDataType;
      toast({
        title: "Error",
        description: errorData?.data?.message || "Failed to invite user",
        variant: "destructive",
      });
    } finally {
      setIsInviteUserOpen(false);
    }
  };

  // Handle form submission with preventDefault
  const onSubmit = handleSubmit(submitInvite);
  const InviteUser = () => {
    return (
      <Dialog
        open={isInviteUserOpen}
        onOpenChange={() => setIsInviteUserOpen(false)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Invite user</DialogTitle>
              <DialogDescription>
                Enter the user email and click save. The user will receive an
                invitation email to join the app.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex w-full items-end flex-col">
                <div className="grid grid-cols-4 items-center gap-4 w-full">
                  <Label htmlFor="email" className="text-right">
                    Emaill
                  </Label>
                  <Input
                    placeholder="example@example.com"
                    {...register("email")}
                    className={cn(
                      "col-span-3 focus-visible:ring-0 focus-visible:ring-offset-0",
                      { "border-red-500": errors?.email }
                    )}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.email?.message)}
                  </span>
                )}
              </div>
              <div className="flex w-full items-end flex-col">
                <div className="grid grid-cols-4 items-center gap-4 w-full">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Input
                    {...register("role")}
                    placeholder="enter user role"
                    defaultValue="user"
                    className={cn(
                      "col-span-3 focus-visible:ring-0 focus-visible:ring-offset-0",
                      { "border-red-500": errors?.role }
                    )}
                  />
                </div>
                {errors.role && (
                  <span className="text-red-500 text-[12px]">
                    {String(errors?.role?.message)}
                  </span>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  setIsInviteUserOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <main className=" py-6 flex flex-col gap-2 px-4">
      <h2>Hi {userAuth?.username}, Welcome to the Home</h2>
      <div className="flex flex-row items-center justify-between gap-2">
        <Input
          placeholder="search"
          className="max-w-sm  focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button className="bg-dark-4" onClick={() => setIsInviteUserOpen(true)}>
          <Plus />
          Invite User
        </Button>
      </div>
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
      {/* modal invite user */}
      {InviteUser()}
    </main>
  );
}


