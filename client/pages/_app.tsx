import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createContext } from 'react';
import { StateMachineContext } from '../lib/StateMachineContext';

export const GlobalStateContext = createContext({});


function MyApp({ Component, pageProps }: AppProps) {
    return (
        <StateMachineContext>
            <Component {...pageProps} />
        </StateMachineContext>
    )
}

export default MyApp
