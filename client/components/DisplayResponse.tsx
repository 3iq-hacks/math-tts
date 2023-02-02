import ReactAudioPlayer from 'react-audio-player';
import { useXState } from '../lib/StateMachineContext';


const DisplayResponse = () => {
    const { state } = useXState();

    if (state.matches('GotResponse')) {
        const response = state.context.response;

        if (response.tag === 'error') {
            return (
                <div className="flex flex-col items-center justify-center w-full p-4 space-y-1">
                    <p className="text-xl text-red-500">Error uploading file!</p>
                    <p className="text-sm font-light text-slate-400">{response.error}</p>
                    <p className="text-sm font-light text-slate-50">Please check the console for more information!</p>
                </div>
            )
        }

        // success!
        // show latex, english, and mp3 file (which is represented in base64)
        return (
            <div className="flex flex-col items-center justify-center w-full p-4 space-y-1">
                <p className="text-xl text-green-500">File uploaded successfully!</p>
                <p className="text-sm font-light text-slate-400">Latex: {response.latex}</p>
                <p className="text-sm font-light text-slate-400">English: {response.english}</p>
                {/* http://www.iandevlin.com/blog/2012/09/html5/html5-media-and-data-uri/ */}
                <ReactAudioPlayer src={`data:audio/mp3;base64,${response.mp3}`} controls />
            </div>
        )
    }

    return null;
}

export default DisplayResponse;