import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Lato } from '@next/font/google'
import FileUpload from '@/components/FileUpload'
import { useXState } from '../lib/StateMachineContext'
import Toaster from '@/components/Toaster'

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

            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 space-y-4 text-center dark:bg-slate-800">
                <h1 className="text-6xl font-bold dark:text-slate-100 ">
                    Latex 2 <span className="text-blue-600 dark:text-indigo-400">Speech</span>
                </h1>
                <p className={`text-lg dark:text-slate-100`}>Upload a LaTeX file (.tex) or image file (.png, .jpeg, .jpg) to get started!</p>
                <p className='text-md text-slate-50'>{state.value.toString()}</p>
                <FileUpload />
            </main>

            {/* Display toasts on the bottom right */}
            <Toaster />

            <footer className="flex h-24 w-full items-center justify-center border-t dark:border-slate-600 dark:bg-slate-800">
                <a
                    className="flex items-center justify-center gap-2 dark:text-slate-100"
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                </a>
            </footer>
        </div>
    )
}

export default Home
