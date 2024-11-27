import { useState } from 'react'
import Image from 'next/image'
export const AuthLayout = ({ img, title, children }: { title?: string |null, img: any, children: React.ReactNode }) => {
    return (
        <main className='flex h-screen  items-center justify-center bg-white'>
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
                        className="object-cover rounded-3xl"
                    />
                </div>

            </section>
        </main>
    )
}