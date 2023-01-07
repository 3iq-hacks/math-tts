# build a flask app with two POST requests, one for uploading a .tex file and another to upload an image

from flask import Flask, request, send_file
from flask_cors import CORS
from werkzeug.datastructures import FileStorage


app = Flask(__name__)
CORS(app)


@app.route('/upload-tex', methods=['POST'])
def upload():
    file = request.files['file']
    file.save
    return 'success'


@app.route('/upload-img', methods=['POST'])
def upload_image():
    file = request.files['file']
    # check that the file is an image
    if file.filename and allowed_file(file.filename):
        # TODO: upload to OCR server
        pass

    return 'success'


def allowed_file(filename: str):
    ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg']
    return '.' in filename and filename.rsplit('.')[-1].lower() in ALLOWED_EXTENSIONS
