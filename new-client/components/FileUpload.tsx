import { useXState } from '../lib/StateMachineContext';
import Image from 'next/image'
import axios from 'axios';
import { stateValuesEqual } from 'xstate/lib/State';

const DragAndDropSection = () => {
    const { state } = useXState();

    if (state.context.file) {
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
                <p className="text-xl font-light text-slate-50">{state.context.file?.name}</p>
            </div>
        )
    }

    return (
        <>
            <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">TEX, PNG, JPG or JPEG</p>
        </>
    )
}

const UploadButton = () => {
    const { state, send } = useXState();


    const uploadFile = async () => {
        const file = state.context.file;

        // notice how I'm checking if the state.context.file exists here, 
        // but the button disabled class is based on the state.matches('HasFile')
        // this cannot be a good design!
        // i still have a long way to go to understand the xstate library...
        if (!file) {
            console.log('No file to upload, aborting...');
            return;
        }

        try {
            // https://masteringjs.io/tutorials/axios/axios-multi-form-data
            // uploading a form requires formData
            console.log('Uploading file...', file)
            const formData = new FormData();
            formData.append('file', file);
            console.log(formData.get('file'));
            send('UPLOAD')

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload-file-hehe`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            console.log(`Latex is: ${response.data.latex}`);
            send({ type: 'SUCCESS', latex: response.data.latex })
        } catch (error) {
            console.log(error);
            send({ type: 'ERROR', error: String(error) })
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

const DisplayError = () => {
    const { state } = useXState();

    if (state.matches('Error')) {
        return (
            <div className="flex flex-col items-center justify-center w-full p-4 space-y-1">
                <p className="text-xl text-red-500">Error uploading file!</p>
                <p className="text-sm font-light text-slate-400">{state.context.error}</p>
                <p className="text-sm font-light text-slate-50">Please check the console for more information!</p>
            </div>
        )
    }

    return null;
}

const FileUpload: React.FC = () => {
    const { state, send } = useXState();

    const insertFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            send({ type: 'PICKFILE', file });
        }
    }

    return (
        <div className="flex items-center justify-center w-full flex-col space-y-6">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-5/6 h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <DragAndDropSection />
                <input
                    id="dropzone-file"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, .tex"
                    className="hidden"
                    onChange={insertFile} />
            </label>
            <UploadButton />
            <DisplayError />
        </div>
    )
}

export default FileUpload;