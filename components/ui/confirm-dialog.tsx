import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
function ConfirmDialog({
    title,
    description,
    isOpen = true,
    onClose,
    onConfirm,
    buttonConfirmStyle,
}: {
    title?: string;
    description?: string | React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    buttonConfirmStyle?: string;

}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={() => onClose?.()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {title ? title : "Are you absolutely sure?"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description ? description
                            : <>This action cannot be undone. This will permanently <b>delete this user account</b>  and remove data from our servers.</>}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={buttonConfirmStyle ? buttonConfirmStyle : "bg-red-600 hover:bg-red-400"}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ConfirmDialog;
