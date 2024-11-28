import Image from 'next/image'
import { cn } from '@/lib/utils'
export const AuthLayout = ({ img, title, children, className }: { title?: string | null, img: any, children: React.ReactNode, className?: string }) => {
    return (
        <main className={cn('flex h-screen  items-center justify-center bg-white', className)}>
            <section className='shadow-lg flex h-full py-3 px-3 rounded  w-full   justify-center '>
                <div className='lg:max-w-[40%] w-full flex justify-center  '>
                    <div className='max-w-[400px]  w-full flex flex-col justify-center lg:px-6'>
                        {title && <h1 className='text-3xl text-center font-bold mb-4'>
                            {title}
                        </h1>}
                        {children}
                    </div>
                </div>
                <div className="h-full w-full bg-dark-2 rounded-3xl hidden lg:block relative">
                    <Image
                        src={img}
                        alt="auth"
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover rounded-3xl"
                    />
                </div>
            </section>
        </main>
    )
}