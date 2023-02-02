import toast, { Toaster } from 'react-hot-toast';
import { useXState } from '../lib/StateMachineContext';
import Image from 'next/image'
import axios from 'axios';
import { fileValid } from '../lib/utils';
import { APIResponse } from '../lib/ApiResponse';
import ReactAudioPlayer from "react-audio-player";

const DragAndDropInner = () => {
    const { state } = useXState();

    if (state.matches('HasFile') || state.matches('Uploading')) {
        // show file image
        return (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 w-full p-4 space-y-2">
                <div className='relative w-full h-32'>
                    <Image
                        src={URL.createObjectURL(state.context.file)}
                        alt="Image or Tex file to upload"
                        fill={true}
                        className='object-contain'
                    />
                </div>
                <p className="text-xl font-light text-slate-50">{state.context.file.name}</p>
            </div>
        )
    }

    const GetDragText = () => {
        switch (state.context.dragStatus) {
            case 'dragging':
                return <span className="font-semibold">Drop the file. I dare you.</span>;
            case 'idle':
                return <><span className="font-semibold">Click to upload</span> or drag and drop</>;
        }
    }

    return (
        <>
            <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><GetDragText /></p>
            <p className="text-xs text-gray-500 dark:text-gray-400">TEX, PNG, JPG or JPEG</p>
        </>
    )
}

const DragAndDropSection = () => {
    const { state, send } = useXState();

    const insertFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        console.log('File picked: ', file)
        if (file) {
            send({ type: 'PICKFILE', file });
            // reset files
            // if we don't do this, when we upload the file and come to the success state,
            // and try to upload the same file again, the form won't do anything
            // since it thinks the file is the same
            e.target.value = '';
        }
    }

    // https://codepen.io/codemzy/pen/YzELgbb
    const handleDrag: React.DragEventHandler<HTMLLabelElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            send({ type: 'DRAG_STATUS', status: 'dragging' });
        } else if (e.type === "dragleave") {
            send({ type: 'DRAG_STATUS', status: 'idle' });
        }
    }

    // triggers when file is dropped
    // https://codepen.io/codemzy/pen/YzELgbb
    const handleDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        send({ type: 'DRAG_STATUS', status: 'idle' });
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (fileValid(file, ['image/png', 'image/jpeg', 'image/jpg', 'text/x-tex'])) {
                send({ type: 'PICKFILE', file });
            } else {
                toast.error('Unsupported file type');
            }
            // again, same reason as insertFile
            e.dataTransfer.clearData();
        }
    };

    const dragColours = state.context.dragStatus === 'idle' ? 'bg-gray-50 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-600'

    return (
        <label
            htmlFor="dropzone-file"
            className={`flex flex-col items-center justify-center w-5/6 h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 ${dragColours}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}>
            <DragAndDropInner />
            <input
                id="dropzone-file"
                type="file"
                accept="image/png, image/jpeg, image/jpg, .tex"
                className="hidden"
                onChange={insertFile} />
        </label>
    )
}

const UploadButton = () => {
    const { state, send } = useXState();

    const uploadFile = async () => {
        // notice how I'm checking if the state.context.file exists here, 
        // but the button disabled class is based on the state.matches('HasFile')
        // this cannot be a good design!
        // i still have a long way to go to understand the xstate library...
        if (!state.matches('HasFile')) {
            console.log('No file to upload, aborting...');
            return;
        }

        try {
            // https://masteringjs.io/tutorials/axios/axios-multi-form-data
            // uploading a form requires formData

            // also by this point, the state.context.file is not null!
            // xstate knows the state has to be HasFile, which has a non-null file
            const file = state.context.file;
            const formData = new FormData();
            formData.append('file', file);
            console.log('Uploading file...', formData.get('file'));
            send('UPLOAD')

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload-file`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            const parsedResponse = APIResponse.parse(response.data)
            if (parsedResponse.tag === 'error') {
                send({ type: 'UPLOAD_ERROR', error: parsedResponse.error })
            } else {
                send({ type: 'UPLOAD_RESPONSE', response: parsedResponse })
            }
        } catch (error) {
            console.log(error);
            send({ type: 'UPLOAD_ERROR', error: String(error) })
        }
    }


    const disabledClass = 'opacity-50 cursor-not-allowed';

    if (state.matches('Uploading')) {
        return (
            <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${disabledClass}`}>
                Uploading...
            </button>
        )
    }

    if (!state.context.file) {
        return (
            <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${disabledClass}`}>
                Upload
            </button>
        )
    }

    return (
        <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
            onClick={uploadFile}>
            Upload
        </button>
    )
}

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
                <ReactAudioPlayer src={response.mp3} controls />
            </div>
        )
    }

    return null;
}

const FileUpload: React.FC = () => {
    return (
        <div className="flex items-center justify-center w-full flex-col space-y-6">
            <DragAndDropSection />
            <UploadButton />
            <DisplayResponse />
        </div>
    )
}

export default FileUpload;