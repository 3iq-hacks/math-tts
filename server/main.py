import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import pix2tex.api.app as pix2tex
from fastapi.middleware.cors import CORSMiddleware
from latex2sympy.latex2sympy2 import latex2sympyStr

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
async def upload_image(file: UploadFile = File(...)):
    '''
    Receives an image of a LaTeX equation, and returns the latex
    '''
    # check that the file is an image
    if file.filename and allowed_file(file.filename):
        await pix2tex.load_model()
        latex = await pix2tex.predict(file)
        print(latex)

        new_file = open('latexFile.txt', 'w')
        new_file.write(latex)
        new_file.close()

        return {'latex': latex, 'latex_file': new_file}
    elif tex_file(file.filename):
        # save file to input.txt
        with open('input.txt', 'wb') as buffer:
            while chunk := await file.read(1024):
                buffer.write(chunk)
        # # read file
        with open('input.txt', 'r') as f:
            latex = f.read()
            english = latex2sympyStr(latex)
            print(english)
            return {'latex': latex, 'english': english}

    return {'error': 'file not allowed'}


def allowed_file(filename: str):
    '''
    Checks if a file is "allowed" by seeing its extension
    '''
    ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg']
    return '.' in filename and filename.rsplit('.')[-1].lower() in ALLOWED_EXTENSIONS


def tex_file(filename: str):
    '''
    Checks if a file is "allowed" by seeing its extension
    '''
    ALLOWED_EXTENSIONS = ['tex']
    return '.' in filename and filename.rsplit('.')[-1].lower() in ALLOWED_EXTENSIONS
