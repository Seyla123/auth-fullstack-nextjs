'use client'
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

export default function Home() {
  const userAuth = useSelector((state: { auth: AuthState }) => state.auth.user)
  //console.log('this is auth user in page : ', userAuth);

  const [usersData, setUsersData] = useState<User[]>([])
  const { data: users, isSuccess, isLoading } = useGetAllUsersQuery();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  useEffect(() => {
    if (users && isSuccess) {
      setUsersData(users?.data);
    }
  }, [users, isSuccess])

  //console.log('this is data from service : ', users);


  //function to delete one user
  const deleteUser = async (id: string) => {
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Fail to delete user',
        variant: 'destructive',
      })
    }
  };

  console.log(usersData);

  //console.log('this is current checked selected : ', checkedItems);

  const isSelected = (id: string | number) => checkedItems.indexOf(id) !== -1;
  // const handleCheckboxClick = (event: { stopPropagation: () => void; }, id: string) => {
  //   event.stopPropagation();
  //   const selectedIndex = checkedItems.indexOf(id);
  //   console.log('this is selected', selectedIndex);

  //   let newSelected: any[] = [];

  //   if (selectedIndex === -1) {
  //     console.log('first');

  //     newSelected = newSelected.concat(checkedItems, id);
  //   } else if (selectedIndex === 0) {
  //     console.log('second');

  //     newSelected = newSelected.concat(checkedItems.slice(1));
  //   } else if (selectedIndex === checkedItems.length - 1) {
  //     newSelected = checkedItems.concat(checkedItems.slice(0, -1));
  //   } else (selectedIndex > 0) {
  //     console.log('third');

  //      newSelected = checkedItems.filter((_, index) => index !== selectedIndex);
  //     // newSelected = checkedItems.concat(
  //     //   checkedItems.slice(0, selectedIndex),
  //     //   checkedItems.slice(selectedIndex + 1),
  //     // );
  //     console.log('selectied ' + newSelected);
  //   }
  //   setCheckedItems(newSelected);
  // };
  const handleCheckboxClick = (event, id: string) => {
    const isSelected = checkedItems.find((item) => item === id);
    console.log('isSelected : ', isSelected);
    if (isSelected) {
      console.log('isSelected : ', true);

      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      console.log('isSelected : ', false);

      setCheckedItems([...checkedItems, id]);
    }

  }
  console.log('checked : ', checkedItems);

  const handleSelectAllClick = (event) => {
    console.log(event.target.getAttribute('aria-checked'));
    
    
    if (event.target.getAttribute('aria-checked')=='false') {
      const newSelecteds = usersData.map((user) => String(user?.id));
      setCheckedItems(newSelecteds);
      console.log('selected : ', newSelecteds);
    console.log('this is aria checked ',event.target.getAttribute('aria-checked'));

      
    } else {
      setCheckedItems([]);
    }
  };
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
                          handleDelete={() => deleteUser(user?.id)}
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
    </main>
  );
}

