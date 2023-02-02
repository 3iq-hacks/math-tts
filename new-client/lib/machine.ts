import { createMachine } from 'xstate';

export interface Context {
    file: File | null;
    // for type stuff, I'll make thus non nullable
    latex: string;
    error: string;
}

export const machine =
    createMachine({
        id: 'ImageFormMachine',
        initial: 'NoFile',
        schema: {
            context: {} as Context,
            events: {} as
                | { type: 'PICKFILE'; file: File }
                | { type: 'UPLOAD' }
                | { type: 'SUCCESS', latex: string }
                | { type: 'ERROR', error: string },
        },
        context: {
            file: null,
            latex: '',
            error: ''
        },
        states: {
            NoFile: {
                on: {
                    PICKFILE: {
                        target: 'HasFile',
                        actions: ['addfile']
                    },
                },
            },

            HasFile: {
                on: {
                    PICKFILE: { actions: ['addfile'] },
                    UPLOAD: { target: 'Uploading' },
                }
            },

            Uploading: {
                on: {
                    SUCCESS: { target: 'Success', actions: ['addLatex'] },
                    ERROR: { target: 'Error', actions: ['addError'] },
                },
            },

            Success: {
                // delete file when we enter into success state
                entry: ['removeFile'],
                on: {
                    PICKFILE: { target: 'HasFile' },
                },
            },

            Error: {
                on: {
                    PICKFILE: { target: 'HasFile' },
                },
            }
        },
        predictableActionArguments: true,
        preserveActionOrder: true
    }, {
        actions: {
            // not sure if this is the right way to do custom logic for transitions
            // like, i just want addFile to be called when we transition via PickFile!
            addfile: (context, event) => {
                if (event.type === 'PICKFILE') {
                    console.log('PICKFILE MACHINE', event.file.name);
                    context.file = event.file;
                }
            },
            addLatex: (context, event) => {
                if (event.type === 'SUCCESS') {
                    context.latex = event.latex;
                }
            },
            removeFile: (context, _) => {
                context.file = null;
            },
            addError: (context, event) => {
                if (event.type === 'ERROR') {
                    context.error = event.error;
                }
            }
        }
    });