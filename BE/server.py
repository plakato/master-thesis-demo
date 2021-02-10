from flask import Flask
from flask import request
import random

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/rhymes', methods=['POST'])
def rhymes():
    lines = request.json['text']
    res = [random.choice('abcd') for _ in range(len(lines))]
    return {"res": res}