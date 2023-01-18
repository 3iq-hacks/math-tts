import React from 'react';
import axios from 'axios';
import FormData from 'form-data';
import Card from 'react-bootstrap/Card';
import env from 'react-dotenv';
import ViewResults from './ViewResults';
import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';

interface Context {
    file: File | null;
    uploading: boolean;
    error: boolean;
}

const machine =

    /** @xstate-layout N4IgpgJg5mDOIC5QEkC2BDGAxA9gJ1QFl0BjACwEsA7MAOgDkcsKAbMAYgAVkBhAaSzIAMgFEA2gAYAuolAAHHLAoAXCjiqyQAD0QBaAIz6A7LSMAWAKwAOIwDYATAE4J9ywGYrAGhABPRPf03WntXCSMjCVsjK1tbMzcAXwTvNEwwXAJicmo6AAl0WGY2Ll4BYXFpTQUlVXVNHQRdeNpje3NYwLN7Wwtu7z8EfQDaC0du53MhqLd7JJSMbHwiUkoaWnzC1g4AVU4hAHkAQQARSRkkEGqVNQ0LhoCTRyf7C1tA4xcJL19-QODQ8KRaKxDxzECpRaZFY5WjbOQsHDoCDUKDsADK2x4PBEaLRZyqimudTuiA89loX2MHjcgXCdjc-UQQ30IzGtgmZimRicYIh6SWWVWdDhCKRKPYIgASpL9pL8RcrrVbqAGm4xrQrI4upZ2b0rDNGQgaUFIpF9GY7PpHDZEslwQt+VDsms0QBXEgkOCwEr8QSieXyQlK+q-Cy0LU6zmUoxubmG2wa-RxeLOMxRCK2+ZpDLLZ10ER4PD4H1lf2VBVBm4hhABMMR15RqxUqKGzlmFpWCxJ1z6Lud2xJO1UHAQOCaPk5wU5Ak1Kskxo08luLtuCSx7n6Ju9w26KwSWi2fUWOx7mkSSyOXkOyfQtaMIpgGdE5XaPTddvLwJr8IBLcWQ0BEEIRmBIx5WPYnZpq8V7ZgKt55AUD5PsG869MEa7MkmXSriE-4-DWfzAaB0QQRYUGZvasFOkKsLwoiyJUFAyFziqpLgeGZiajSnJGJuEYAYRoRgaR5EwZCuY0W6HpesxxKsUamotDMvTHnSMZ4QMCZNnErixBYy68UYFhiY6EkwgWRZ4LJL4NCB5Jrpxh72KBZicW4DL4W2HZdvExjWD0RiDgkQA */
    createMachine({
        id: 'ImageFormMachine',
        initial: 'NoFile',
        schema: {
            context: {} as Context,
            events: {} as
                | { type: 'PICKFILE'; file: File }
                | { type: 'UPLOAD' }
                | { type: 'SUCCESS' }
                | { type: 'ERROR' },
        },
        context: {
            file: null,
            uploading: false,
            error: false,
        },
        states: {
            NoFile: {
                on: {
                    PICKFILE: { target: 'HasFile' },
                },
            },

            HasFile: {
                on: {
                    PICKFILE: {},
                    UPLOAD: { target: 'Uploading' },
                }
            },

            Uploading: {
                on: {
                    SUCCESS: { target: 'Success' },
                    ERROR: { target: 'Error' },
                },
            },

            Success: {
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
    });


const DisplayFile = ({ file }: { file: File | null }) => (
    <div>
        <img
            id="target"
            alt=""
            src={file ? URL.createObjectURL(file) : ''}
            width="300px"
            style={{ margin: '50px', borderRadius: '15px' }}
        />
    </div>
);


const ImageForm = () => {
    const [state, send] = useMachine(machine);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log('Got file:', file);
            send({ type: 'PICKFILE', file });
        } else {
            console.log('No file selected');
        }
    };

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        // https://masteringjs.io/tutorials/axios/axios-multi-form-data
        // uploading a form requires formData
        const img = state.context.file;
        const formData = new FormData();
        formData.append('file', img);
        console.log(formData);
        send({ type: 'UPLOAD' });

        axios
            .post(`${env.REACT_APP_API_URL}/upload-file`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            .then((response) => {
                // get data
                //axios.get('http://localhost:8000/get-audio')
                console.log(`Latex is: ${response.data.latex}`);
                // this.setState({ latexValue: `${response.data.latex}` });
                //axios.post(`S{env.REACT_APP_API_URL}/upload-tex`)
                //download("download_sus.txt", response.data.latex_file)
            })
            .catch((error) => {
                console.log(error);
                //this.latexValue = '';
                // this.setState({ latexValue: null });
                // this.setState({ submitted: false });
                send({ type: 'ERROR' })
            })
            .finally(() => {
                send({ type: 'SUCCESS' });
            });
    };

    return (
        <div>
            <Card
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#000000',
                    border: '5px solid white',
                    borderRadius: '15px',
                    padding: '20px',
                }}
            >
                <div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="equation">Upload:&nbsp;</label>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, .tex"
                            // value={this.state.value}
                            onChange={handleChange}
                            name="equation"
                        />
                        <input
                            type="submit"
                            value="Upload File"
                            style={{
                                padding: '10px',
                                background: 'lime',
                                borderRadius: '10px',
                            }}
                        />
                    </form>
                    {/* {{ this.state.loading && <Grid />}} */}
                </div>
                <DisplayFile file={state.context.file} />
                <div>
                    {/* {this.state.submitted && (
                        <ViewResults
                            audioURL="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                            latex={this.state.latexValue}
                        />
                    )} */}
                </div>
            </Card>
        </div>
    );
};

export default ImageForm;
