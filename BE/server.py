from flask import Flask
from flask import request
import random
from flask_cors import CORS, cross_origin
from lib.rhyme_detector.rhyme_detector_v3 import RhymeDetector

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def hello_world():
    return 'My backend is working!'

@app.route('/rhymes', methods=['POST'])
def rhymes():
    lines = request.json['text']
    config = request.json
    del config['text']
    detector_v3 = RhymeDetector(matrix_path='lib/rhyme_detector/data/cooc_iter3.json',
                                **config,
                                verbose=False)     
    stats_v3 = detector_v3.analyze_lyrics(lines)
    res = stats_v3
    return {"res": res}