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



export default function Home() {
  const [usersData, setUsersData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/users");
        const { data } = await response.json();
        setUsersData(data);
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers()
  }, [setUsersData])

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
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as unknown as { message: string }).message || 'Fail to delete user',
        variant: 'destructive',
      })
      console.log("Error deleting user:", error);
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
    <main className="max-w-screen-2xl mx-auto py-6 flex flex-col gap-2">
      <h2>Welcome to the Home Page</h2>
      <div className="flex flex-row items-center justify-between">
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-1/12">Action</TableHead>
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
                usersData.map((user: User, index: number) => (
                  <TableRow key={index}>
                    <TableCell >
                      <Checkbox />
                    </TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <DropdownAction
                        handleEdit={() => console.log(`edit ${user.name}`)}
                        handleDelete={() => deleteUser(user.id)}
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
