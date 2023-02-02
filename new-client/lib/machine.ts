import { createMachine } from 'xstate';
import { ForceNull, PickNonNull, PickNull, PickNullables } from './utils';

export interface Context {
    file: File | null;
    // for type stuff, I'll make thus non nullable
    latex: string | null;
    error: string | null;
}

export type States =
    | { value: 'NoFile', context: ForceNull<Context> }
    | { value: 'HasFile', context: PickNullables<Context, 'file', 'latex' | 'error'> }
    | { value: 'Uploading', context: PickNullables<Context, 'file', 'latex' | 'error'> }
    | { value: 'Success', context: PickNullables<Context, 'latex', 'file' | 'error'> }
    | { value: 'Error', context: PickNullables<Context, 'error', 'file' | 'latex'> }

export type Events =
    | { type: 'PICKFILE'; file: File }
    | { type: 'UPLOAD' }
    | { type: 'UPLOAD_SUCCESS', latex: string }
    | { type: 'UPLOAD_ERROR', error: string }

export const machine =

    /** @xstate-layout N4IgpgJg5mDOIC5QEkC2BDGAxA9gJ1QFl0BjACwEsA7MAOgDkcsKAbMAYgAVkBhAaSzIAMgFEA2gAYAuolAAHHLAoAXCjiqyQAD0QBWAIwBmWhMP6ATLoA0IAJ6J9AdgCcJ84YAsHywA4AbOZ+hqYAviE2aJhguATE5NR0ABLosMxsXLwCwuLSmgpKquqaOgh+Hn60ZRIB1nYO+vq0Pj4S5kYe+s66zkGOYREY2PhEpJQ0tMmprBwAqpxCAPIAggAikjJIIPkqahqbJQaOtPoe1ZY29gg+jboSdxK3-oHBhv0gkUOxowm0M3IsOHQEGoUHYc0WqwA+gBlGY8HgiaHQ9Z5RQ7Ir7BzlSreXSOcweXQeRyODyGcwXBwBNxeQwGE4+XSvcLvQbRYZxMZ0P4AoEgsHzZYrSEiABKooWopRm22hT2oBKR3xJP0d10TNppkpCGCRy8ZUMfm6gSMfRZH3ZX3i42hAFcSCQ4LAMvxBKJpfI0XLinojCYzOc6ghzKTaM5HEa-I5dE8gtU3haYiNrXQRHg8PgXVl3bkZV7dj6EAZjKYLLVLoZHBIw+Yes5fAE434wiyqDgIHBNImOd8aKiCgXMQgALSnWgh8zmHzOZz69WObXD3RhmernwRvzNQyMhNspOcn6MNJgfvo+XaRAdYy1zfR7XmVrj25qiSxl67qL73tJFLH0-eocjQ8Sp13LRA2nMJpDGg7cOi6HpKw-T5ky5X5-kBYEqCgf9BwVS8KSDZxq0rZ9Hkbd9zT3HsU1oO0HSdHCMTwnVOloPFrkDS4Q2AqszGCV9yPjSjP2o1C0wzPBGPPEpDR8GselA7VDFnY5dBqMjniEsIgA */
    createMachine<Context, Events, States>({
        id: 'ImageFormMachine',
        initial: 'NoFile',
        context: {
            file: null,
            latex: null,
            error: null
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
                    UPLOAD_SUCCESS: { target: 'Success', actions: ['addLatex'] },
                    UPLOAD_ERROR: { target: 'Error', actions: ['addError'] },
                },
            },

            Success: {
                // delete file when we enter into success state
                entry: ['removeFile'],
                on: {
                    PICKFILE: { target: 'HasFile', actions: ['addfile'] },
                },
            },

            Error: {
                on: {
                    PICKFILE: { target: 'HasFile', actions: ['addfile'] },
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
                if (event.type === 'UPLOAD_SUCCESS') {
                    context.latex = event.latex;
                }
            },
            removeFile: (context, _) => {
                context.file = null;
            },
            addError: (context, event) => {
                if (event.type === 'UPLOAD_ERROR') {
                    context.error = event.error;
                }
            }
        }
    });