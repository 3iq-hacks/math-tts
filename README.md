# MathTTS

By Aneeljyot Alagh, Curtis Kan, Joshua Ji, Kailash Seshandri, Shehraj Singh, and Vedant Vyas.

This project uses React for the frontend, and Flask for the backend. We use OCR tools for LaTeX image processing, and Google Cloud Platform for deployment and hosting. We use ```ANTLR4``` to build our own ```lexer``` and ```parser``` to convert latex to english which built on the top of existing latex to sympy project. 

## Running Locally

### Environment Variables

There are a few secrets we need to run the project.

#### Client

In `client/.env.local`, add the following:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Server

In `server/service_account_key.json`, add the Google Cloud Service Account JSON file. Inside the Cloud Console, this is the service account "text-too-speech@theta-carving-374101.iam.gserviceaccount.com". 

For those who want to use their own service account, we created this service account with the "Browser" role.

### Running the project

The simplest way to get started with the project is to open it up using Devcontainers, or using Github Codespaces. After that, assuming you have the environment variables and secrets reaady, run the following:

```bash
concurrently "cd client && npm run dev" "cd server && uvicorn main:app --reload"
```


The client will open on [http://localhost:3000](http://localhost:3000), while the server can be accessed at [http://localhost:8000](http://localhost:8000)

## Tools Used

### Frontend

- [Tailwind](https://tailwindcss.com/) for styling.
- [XState](https://xstate.js.org/) for state management.
- [React-audio-player](https://www.npmjs.com/package/react-audio-player) for the website audio player.
- [Axios](https://www.npmjs.com/package/axios) for HTTP requests.
- [React-Toastify](https://www.npmjs.com/package/react-toastify) for toast notifications.

### Backend

- [FastAPI](https://fastapi.tiangolo.com/) for the backend.
- [pix2tex](https://pypi.org/project/pix2tex/) for LaTeX OCR.
- [(A fork of) Latex2Sympy](https://github.com/3iq-hacks/latex2sympy) to parse LaTeX and convert it to English
- [ANTLR4](https://www.antlr.org/) to build our own lexer and parser for LaTeX
- [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech) for converting English to speech.

## Pictures/gifs References
- [LaTeX Logo](https://brandslogos.com/wp-content/uploads/images/latex-logo-vector.svg)
- [Dancing gif](https://media.tenor.com/MjdDlyCEARcAAAAC/math-dance.gif)

## Screenshots
![Screenshot (4)](https://user-images.githubusercontent.com/68800077/211209850-f9a9588e-2184-4850-a3dd-6cef3fd6227d.png)
![Screenshot (5)](https://user-images.githubusercontent.com/68800077/211209855-594f0dcd-01ab-49a8-8c70-ce8e9302d5d8.png)
![Screenshot (6)](https://user-images.githubusercontent.com/68800077/211210048-2289858b-eff1-4d7b-b6bb-42e37d0585fa.png)
![/image](https://user-images.githubusercontent.com/68800077/211212030-a4e0f45a-ac52-4094-b6f1-62e75c381e57.png)

## Google Cloud Architecture

This was our first time going full blast with Google Cloud, complete with a (possibly incorrect) Google Cloud Architecture diagram. 

<img width="731" alt="Screenshot_2023-01-08_at_6 03 44_AM" src="https://user-images.githubusercontent.com/11809774/211212377-eb94813d-2a76-4c9d-8585-620ea3bbf4a2.png">
<img width="560" alt="Screenshot_2023-01-08_at_6 03 51_AM" src="https://user-images.githubusercontent.com/11809774/211212380-38669172-e1c1-4247-bf5f-866651aac7da.png">
