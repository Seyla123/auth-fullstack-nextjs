'use client'
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { User } from "../api/auth/sign-in/route";

export default function Home() {
  const [usersData, setUsersData] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/users");
        const { data } = await response.json();
        setUsersData(data.map((user: User) => user.name));
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers()
  }, [])

  if(isLoading) return <main>Loading...</main>
  return (
    <main>
      <Button>Start Now</Button>
      <h2>Welcome to the Home Page</h2>
      
    </main>
  );
}
