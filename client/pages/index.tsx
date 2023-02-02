import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Lato } from '@next/font/google'
import FileUpload from '@/components/FileUpload'
import { useXState } from '@/lib/StateMachineContext'
import Toaster from '@/components/Toaster'
import DisplayResponse from '@/components/DisplayResponse'
import Footer from '@/components/Footer'


const lato = Lato({
    subsets: ['latin'],
    weight: ['400', '700'],
})

const Home: NextPage = () => {
    const { state } = useXState();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 py-10 space-y-6 text-center dark:bg-slate-800">
                <h1 className="text-6xl font-bold dark:text-slate-100 ">
                    Latex 2 <span className="text-blue-600 dark:text-indigo-400">Speech</span>
                </h1>
                <p className={`text-lg dark:text-slate-100`}>Upload a LaTeX file (.tex) or image file (.png, .jpeg, .jpg) to get started!</p>
                <FileUpload />
                <DisplayResponse />
            </main>

            {/* Display toasts on the bottom right */}
            <Toaster />
            <Footer />
        </div>
    )
}

export default Home
