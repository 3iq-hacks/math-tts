import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import pix2tex.api.app as pix2tex
from fastapi.middleware.cors import CORSMiddleware
from latex2sympy.latex2sympy2 import latex2sympyStr
import util
import latex2sympy.tts as tts
from typing import Tuple
from google.cloud.texttospeech_v1.types import SynthesizeSpeechResponse

# import sys
# sys.path.append('..')

# get port from environment variable, 8000 if not set
port = os.environ.get('PORT', 8000)

app = FastAPI(port=port)

allowed_origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post('/upload-file')
async def upload_file(file: UploadFile = File(...)):
    '''
    Receives an image of a LaTeX equation, and returns the latex
    '''
    if not file.filename:
        return {'error': 'no file'}

    print(f'UPLOAD FILE: {file.filename}')
    curr_latex = ''

    try:
        # check that the file is an image
        # if it is, read latex and set curr_latex
        if util.allowed_file(file.filename):
            print(f'  Reading latex from img...')
            await pix2tex.load_model()
            latex = await pix2tex.predict(file)
            curr_latex = f'$${latex}$$'
            print(f'  Read latex from png img: {curr_latex}')

        # if it's a tex file, read the file and set curr_latex
        if util.tex_file(file.filename):
            print(f'  Reading latex from tex file...')
            # i tink await file.read() returns bytes?
            latex_in_bytes = await file.read()
            curr_latex = latex_in_bytes.decode('utf-8')
            print(f'  Read latex from file: {curr_latex}')

        english, mp3 = analyze_latex(curr_latex)

        # save mp3 to file
        print(f'  Saving mp3 to file...')

        return {
            'latex': curr_latex,
            'english': english,
            'mp3': mp3
        }

    except Exception as e:
        print(f'ERROR: {e}')
        return {'error': str(e)}


def analyze_latex(latex) -> Tuple[str, bytes]:
    '''
    Receives a latex string, and returns the english translation
    as well as a TTS reading of the english
    '''
    # now, convert latex to english
    print(f'  Converting latex to english...')
    english = latex2sympyStr(latex)
    print(f'  Converted latex to english: {english}')

    # now run TTS to generate mp3
    print(f'  Generating mp3...')
    mp3 = tts.generate_mp3(english)

    return {english, mp3}
