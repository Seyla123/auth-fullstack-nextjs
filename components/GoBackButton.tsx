import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const GoBackButton = ({ title = 'Go back', link = '/', iconStyle }: { title?: string, link?: string, iconStyle?: string }) => {
    return (
        <Link href={link} >
            <Button className='py-6 px-6 ' defaultColor>
                <div className='flex items-center justify-center h-full text-center'>
                    <ArrowLeft className={`w-6 h-6 text-gray-50 ${iconStyle}`} />
                    <p className='ml-2 text-sm lg:text-md'>{title}</p>
                </div>
            </Button>
        </Link>
    )
}