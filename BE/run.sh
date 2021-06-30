#!/bin/bash
export PYTHONPATH=`pwd`/lib/rhyme_detector/
FLASK_APP=server.py flask run --no-debugger --no-reload