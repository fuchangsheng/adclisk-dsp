from flask import Flask, request
from ctypes import *
import os
import time


app = Flask(__name__)


@app.route('/')
def test():
	return "hello flask"
if __name__ == '__main__':
    app.run(debug=True)
