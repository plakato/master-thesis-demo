from flask import Flask
from flask import request
import random
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def hello_world():
    return 'My backend is working!'

@app.route('/rhymes', methods=['POST'])
def rhymes():
    lines = request.json['text']
    res = [random.choice('abcd') for _ in range(len(lines))]
    return {"res": res}