import type { AppProps } from 'next/app'
import { useInterpret, useActor } from '@xstate/react';
import { machine } from '@/lib/machine';
import React, { createContext } from 'react';
import { ActorRefFrom } from 'xstate'

// https://dev.to/mattpocockuk/how-to-manage-global-state-with-xstate-and-react-3if5
interface GlobalStateContextType {
    service: ActorRefFrom<typeof machine>;
}

// implicit state is bad, but per the docs, it just avoids TS errors
export const GlobalStateContext = createContext({} as GlobalStateContextType);

export const StateMachineContext: React.FC<React.PropsWithChildren> = (props) => {
    const service = useInterpret(machine);

    return (
        <GlobalStateContext.Provider value={{ service }}>
            {props.children}
        </GlobalStateContext.Provider>
    )
}

export const useXState = () => {
    const { service } = React.useContext(GlobalStateContext);
    const [state, send] = useActor(service);

    return { state, send };
}
