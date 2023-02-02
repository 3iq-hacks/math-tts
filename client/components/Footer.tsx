import Image from 'next/image';

const Footer = () => (
    <footer className="flex flex-col h-24 w-full items-center justify-center border-t dark:border-slate-600 dark:bg-slate-800 space-y-2">
        <p className="text-sm text-slate-300">Built by <a href="https://github.com/3iq-hacks" className="underline hover:bg-slate-600 py-0.5 rounded-sm">3IQ Hacks</a> for HackED 2023</p>
        <p className="text-sm text-slate-300">Code is available on <a href="https://github.com/3iq-hacks/math-tts" className="underline hover:bg-slate-600 py-0.5 rounded-sm">GitHub</a></p>
    </footer>
)

export default Footer;
