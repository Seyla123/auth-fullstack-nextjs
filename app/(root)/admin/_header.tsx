import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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
import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { useSelector } from 'react-redux';
import { AuthState } from '@/lib/client/stores/slices/authSlice';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteUserFormSchema, InviteUserFormValues } from "@/lib/definitions";
import { useInviteUserMutation } from "@/lib/client/services/admin/inviteUserApi";
import { toast } from '@/hooks/use-toast';
import { ErrorDataType } from '@/app/(auth)/sign-in/[[...sign-in]]/page';


function Header() {
    const userAuth = useSelector((state: { auth: AuthState }) => state.auth.user);

    // useInviteUserMutation : Mutation hook to handle user invitation
    const [inviteUser, { isLoading: isInviteUserLoading }] =
        useInviteUserMutation();
    const [isInviteUserOpen, setIsInviteUserOpen] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InviteUserFormValues>({
        resolver: zodResolver(InviteUserFormSchema),
    });

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
        <>
            <h2>Hi {userAuth?.username}, Welcome to the Home</h2>
            <div className="flex flex-row items-center justify-between gap-2">
                <Input
                    placeholder="search"
                    autoCorrect=''
                    name='search'
                    id='search'
                    className="max-w-sm  focus-visible:ring-0 focus-visible:ring-offset-0"
                />

                <Button className="bg-dark-4" onClick={()=>setIsInviteUserOpen(true)}>
                    <Plus />
                    Invite User
                </Button>
            </div>
            {InviteUser()}
        </>
    )
}

export default Header