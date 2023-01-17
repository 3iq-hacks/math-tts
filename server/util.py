# utility functions

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
