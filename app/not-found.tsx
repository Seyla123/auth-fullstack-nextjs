import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import NotFoundImage from '@/public/404.png'
import NotFoundImage2 from '@/public/404-2.png'
function NotFoundPage() {
  return (
    <section className='lg:h-screen flex justify-center'>
      <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
        <div className="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
          <div className="relative">
            <div className="absolute">
              <div className="">
                <h1 className="my-2 text-gray-800 font-bold text-2xl">
                  Looks like you&apos;ve found the
                  doorway to the great nothing
                </h1>
                <p className="my-2 text-gray-800">Sorry about that! Please visit our hompage to get where you need to go.</p>
                <Link href={'/'}>
                  <Button className="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50">Take me there!</Button>
                </Link>
              </div>
            </div>
            <div>
              <Image
                alt="not found"
                src={NotFoundImage}
                width={500}
                height={500}
                />
            </div>
          </div>
        </div>
        <div>
          <Image
            alt="not found" 
            src={NotFoundImage2}
            width={500}
            height={500}
            />
        </div>
      </div>
    </section>
  )
}

export default NotFoundPage