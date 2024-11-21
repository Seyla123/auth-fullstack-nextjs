'use client'
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "../api/auth/sign-in/route";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import Loading from "@/components/Loading";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { DropdownAction } from "@/components/DropdownAction";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useGetAllUsersQuery } from "@/lib/client/services/admin/userService";

export default function Home() {
  const [usersData, setUsersData] = useState<User[]>([])
  const {data: users, isSuccess, isLoading} = useGetAllUsersQuery();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  useEffect(() => {
    if(users && isSuccess ){
      setUsersData(users?.data);
    }
  }, [users])

  console.log('this is data from service : ', users);


  //function to delete one user
  const deleteUser = async (id: string | number) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      setUsersData(usersData.filter(user => user.id !== id));
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error : any) {
      toast({
        title: 'Error',
        description: error.message || 'Fail to delete user',
        variant: 'destructive',
      })
    }
  };

  console.log(usersData);

  console.log('this is current checked selected : ', checkedItems);

  if (isLoading) {
    return <main className="w-full flex justify-center h-screen">
      <Loading />
    </main>
  }
  return (
    <main className="max-w-screen-2xl mx-auto py-6 flex flex-col gap-2 px-4">
      <h2>Hi Seyla Seav, Welcome to the Home</h2>
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1">
                <Checkbox />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-1"  />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ?
              <TableRow >
                <TableCell
                  colSpan={3}
                  className="h-24 text-center"
                >
                  <Loading />
                </TableCell>
              </TableRow>
              :
              (!isLoading && usersData.length > 0) ?
                usersData.map((user, index: number) => (
                  <TableRow key={index}>
                    <TableCell >
                      <Checkbox />
                    </TableCell>
                    <TableCell>{user?.id}</TableCell>
                    <TableCell>{user?.username}</TableCell>
                    <TableCell>{user?.email}</TableCell>
                    <TableCell>{user?.role}</TableCell>
                    <TableCell>{user?.active}</TableCell>
                    <TableCell >
                      <DropdownAction
                        handleEdit={() => console.log(`edit ${user?.username}`)}
                        handleDelete={() => deleteUser(user?.id)}
                        handleView={() => console.log("view")}
                      />
                    </TableCell>
                  </TableRow>
                ))
                :
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
            }
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
