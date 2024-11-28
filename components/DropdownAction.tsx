import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from "lucide-react";


export const DropdownAction = ({ handleEdit, handleView, handleDelete, handleResendInvite }: { handleEdit: () => void, handleView: () => void, handleDelete: () => void, handleResendInvite?: () => void }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {handleResendInvite && <DropdownMenuItem onClick={handleResendInvite}>Resend Invite</DropdownMenuItem>}
                <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}