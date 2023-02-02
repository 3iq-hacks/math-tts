import { createMachine } from 'xstate';
import { APIResponse } from './ApiResponse';
import { ForceNull, PickNonNull, PickNull, PickNullables } from './utils';

export interface Context {
    file: File | null;
    // for type stuff, I'll make thus non nullable
    latex: string | null;
    response: APIResponse | null;
    dragStatus: DragStatus;
}

type DragStatus = 'idle' | 'dragging';
// typescript seems to take the minimal type of the union 
// for example, PickNull<Context, 'file'> & Context = PickNull<Context, 'file'>
export type States =
    | { value: 'NoFile', context: PickNull<Context, 'file' | 'response' | 'latex'> & Context }
    | { value: 'HasFile', context: PickNullables<Context, 'file', 'latex'> & Context }
    | { value: 'Uploading', context: PickNullables<Context, 'file', 'latex' | 'response'> & Context }
    | { value: 'GotResponse', context: PickNonNull<Context, 'file' | 'latex' | 'response'> & Context }

export type Events =
    | { type: 'PICKFILE'; file: File }
    | { type: 'UPLOAD' }
    | { type: 'UPLOAD_RESPONSE', response: APIResponse }
    | { type: 'UPLOAD_ERROR', error: string }
    | { type: 'DRAG_STATUS', status: DragStatus }

export const machine =

    /** @xstate-layout N4IgpgJg5mDOIC5QEkC2BDGAxA9gJ1QFl0BjACwEsA7MAOgDkcsKAbMAYgAVkBhAaSzIAMgFEA2gAYAuolAAHHLAoAXCjiqyQAD0QBWAIwBmWhMP6ATLoA0IAJ6J9AdgCcJ84YAsHywA4AbOZ+hqYAviE2aJhguATE5NR0ABLosMxsXLwCwuLSmgpKquqaOgh+Hn60ZRIB1nYO+vq0Pj4S5kYe+s66zkGOYREY2PhEpJQ0tMmprBwAqpxCAPIAggAikjJIIPkqahqbJQaOtPoe1ZY29gg+jboSdxK3-oHBhv0gkUOxowm0M3IsOHQEGoUHYc0WqwA+gBlGY8HgiaHQ9Z5RQ7Ir7BzlSreXSOcweXQeRyODyGcwXBwBNxeQwGE4+XSvcLvQbRYZxMZ0P4AoEgsHzZYrSEiABKooWopRm22hT2oBKR3xJP0d10TNppkpCGCRy8ZUMfm6gSMfRZH3ZX3i42hAFcSCQ4LAMvxBKJpfI0XLinojCYzOc6ghzKTaM5HEa-I5dE8gtU3haYiNrXQRHg8PgXVl3bkZV7dj6EAZjKYLLVLoZHBIw+Yes5fAE434wiyqDgIHBNImOd8aKiCgXMQgALSnWgh8zmHzOZz69WObXD3RhmernwRvzNQyMhNspOcn6MNJgfvo+XaRAdYy1zfR7XmVrj25qiSxl67qL73tJFLH0-eocjQ8Sp13LRA2nMJpDGg7cOi6HpKw-T5ky5X5-kBYEqCgf9BwVS8KSDZxq0rZ9Hkbd9zT3HsU1oO0HSdHCMTwnVOloPFrkDS4Q2AqszGCV9yPjSjP2o1C0wzPBGPPEpDR8GselA7VDFnY5dBqMjniEsIgA */
    createMachine<Context, Events, States>({
        id: 'ImageFormMachine',
        initial: 'NoFile',
        context: {
            file: null,
            latex: null,
            response: null,
            dragStatus: 'idle'
        },
        states: {
            NoFile: {
                on: {
                    PICKFILE: { target: 'HasFile', actions: ['addfile'] },
                    DRAG_STATUS: { actions: ['setDrag'] },
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
                    UPLOAD_RESPONSE: { target: 'GotResponse', actions: ['addResponse'] },
                    UPLOAD_ERROR: { target: 'GotResponse', actions: ['addError'] },
                },
            },
            GotResponse: {
                on: {
                    PICKFILE: { target: 'HasFile', actions: ['addfile'] },
                    DRAG_STATUS: { actions: ['setDrag'] },
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
            setDrag: (context, event) => {
                if (event.type === 'DRAG_STATUS') {
                    console.log('DRAG_STATUS MACHINE', event.status);
                    context.dragStatus = event.status;
                }
            },
            // add APIResponse error
            addResponse: (context, event) => {
                if (event.type === 'UPLOAD_RESPONSE') {
                    console.log('UPLOAD_RESPONSE MACHINE', event.response)
                    context.response = event.response
                }
            },
            // add any other error message
            // i could just add this to addResponse, but it's a bit simpler this way
            addError: (context, event) => {
                if (event.type === 'UPLOAD_ERROR') {
                    console.log('UPLOAD_ERROR MACHINE', event.error)
                    context.response = {
                        error: event.error,
                        tag: 'error'
                    }
                }
            }
        }
    });