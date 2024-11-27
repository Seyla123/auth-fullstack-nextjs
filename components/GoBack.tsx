import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const GoBack = ({ title = 'Go back', link = '/' }: { title?: string, link?: string }) => {
    return (
        <Link href={link} >
            <div className='flex items-center justify-center h-full text-center'>
                <ArrowLeft className='w-6 h-6 text-gray-500' />
                <p className='ml-2 text-sm lg:text-md'>{title}</p>
            </div>
        </Link>
    )
}