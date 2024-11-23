'use client'
//@typescript-eslint/no-explicit-any
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "@/app/api/auth/sign-in/route";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import Loading from "@/components/Loading";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DropdownAction } from "@/components/DropdownAction";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useGetAllUsersQuery } from "@/lib/client/services/admin/userApi";
import { useSelector } from "react-redux";
import { AuthState } from "@/lib/client/stores/slices/authSlice";
import { useDeleteUserMutation } from "@/lib/client/services/admin/userApi"
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { ErrorDataType } from "@/app/(auth)/sign-in/[[...sign-in]]/page";
export default function Home() {
  // Get the authenticated user from the Redux store
  const userAuth = useSelector((state: { auth: AuthState }) => state.auth.user);

  // useGetAllUsersQuery : hook to fetch user data
  const { data: users, isSuccess, isLoading } = useGetAllUsersQuery();
  // useDeleteUserMutation : Mutation hook to handle user deletion
  const [deleteOneUser, { isLoading: isDeleteLoading }] = useDeleteUserMutation();

  // state for users data
  const [usersData, setUsersData] = useState<User[]>([]);

  // State to track checked items for selection
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  // State to control the visibility of the delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  // State to store the ID of the user to be deleted
  const [itemDeleteOne, setItemDeleteOne] = useState<string | number>('');

  useEffect(() => {
    if (users && isSuccess) {
      setUsersData(users?.data);
    }
  }, [users, isSuccess])

  useEffect(() => {
    if (isDeleteLoading) {
      toast({
        title: 'Loading',
        description: 'Loading users data',
      })
    }
  }, [isDeleteLoading])

  //function to delete one user
  const deleteUser = async (id: string | number) => {
    try {
      await deleteOneUser(id).unwrap();
      toast({
        title: 'Delete Success',
        description: 'User deleted successfully',
      })
    } catch (error:unknown) {
      const errorData = error as ErrorDataType;
      toast({
        title: 'Failed to delete user',
        description: errorData?.data?.message || 'Failed to delete user',
        variant: 'destructive',
      })
    }
  };

  // handle click on checkbox
  const isSelected = (id: string) => checkedItems.indexOf(id) !== -1;
  const handleCheckboxClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    event.stopPropagation();
    const isSelected = checkedItems.find((item) => item === id);
    console.log('isSelected : ', isSelected);
    if (isSelected) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }

  }
  console.log('checked : ', checkedItems);

  // handle chckbox multiple
  const handleSelectAllClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLDivElement;

    if (target.getAttribute('aria-checked') === 'false') {
      const newSelecteds = usersData.map((user) => String(user?.id));
      setCheckedItems(newSelecteds);
    } else {
      setCheckedItems([]);
    }
  };

  // handle click on delete one user and open confirm modal
  const handleDelete = (id: string | number) => {
    setItemDeleteOne(id)
    setIsDeleteModalOpen(true);
  }

  return (
    <main className=" py-6 flex flex-col gap-2 px-4">
      <h2>Hi {userAuth?.username}, Welcome to the Home</h2>
      <div className="flex flex-row items-center justify-between gap-2">
        <Input
          placeholder="search"
          className="max-w-sm  focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Link href="/sign-up">
          <Button className="bg-dark-4">
            Add User <Plus />
          </Button>
        </Link>
      </div>
      <section className="rounded-md border">
        <Table >
          <TableHeader>
            <TableRow>
              <TableHead className="w-1">
                <Checkbox
                  checked={checkedItems.length > 0}
                  onClick={(event) => handleSelectAllClick(event)} />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-1" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ?
              <TableRow >
                <TableCell
                  colSpan={6}
                  className="h-[40vh] lg:h-[50vh] text-center"
                >
                  <Loading />
                </TableCell>
              </TableRow>
              :
              (!isLoading && usersData.length > 0) ?
                usersData.map((user, index: number) => {
                  const selected = isSelected(String(user?.id))
                  return (
                    <TableRow key={index} >
                      <TableCell >
                        <Checkbox checked={selected} onClick={(event) => handleCheckboxClick(event, String(user?.id))} />
                      </TableCell>
                      <TableCell>{user?.id}</TableCell>
                      <TableCell>{user?.username}</TableCell>
                      <TableCell>{user?.email}</TableCell>
                      <TableCell>{user?.role}</TableCell>
                      <TableCell>{user?.active}</TableCell>
                      <TableCell >
                        <DropdownAction
                          handleEdit={() => console.log(`edit ${user?.username}`)}
                          handleDelete={() => handleDelete(user?.id)}
                          handleView={() => console.log(`view ${user?.id}`)}
                        />

                      </TableCell>
                    </TableRow>

                  )
                })
                :
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-[40vh] lg:h-[50vh] text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
      </section>
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteUser(itemDeleteOne)}
      />
    </main>
  );
}

