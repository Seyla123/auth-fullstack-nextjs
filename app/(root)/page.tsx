'use client'
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "../api/auth/sign-in/route";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function Home() {
  const [usersData, setUsersData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  }, [])

  console.log(usersData);


  if (isLoading) {
    return <main className="w-full flex justify-center h-screen">
      <Loading />
    </main>
  }
  return (
    <main className="max-w-screen-lg mx-auto py-6">
      <h2>Welcome to the Home Page</h2>
      <Link href="/sign-up">
        <Button variant="destructive">Add User</Button>
      </Link>
      <section className="rounded-md border">

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading ?
              <TableRow >
                <TableCell
                  colSpan={3}
                  className="h-24 text-center"
                >
                  <Loading />
                </TableCell>
              </TableRow>
              :
              (isLoading && usersData.length > 0) ?
                usersData.map((user: User, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button variant="outline">Update</Button>
                      <Button variant="destructive">Delete</Button>
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
