import cv2
import numpy as np
import base64
from api.config import app
from flask import request, jsonify
from utils.utils import Grahph_similarity
from utils.generateChart import generateChart
from flask import Flask,  render_template

@app.route("/match", methods=["POST"])
def match():
    ori_img = request.form['inputImg'].split(',')[1]
    ori_img = np.fromstring(base64.b64decode(ori_img), np.uint8)
    ori_img = cv2.imdecode(ori_img, cv2.IMREAD_COLOR)
    ori_img = cv2.resize(ori_img, (224, 113))
    model = Grahph_similarity(ori_img)
    result = model.main()
    res = result['img']
    after_img = result['after_img']
    buffer = cv2.imencode('.jpg', res)[1]
    res_img = base64.b64encode(buffer)
    buffer = cv2.imencode('.jpg', after_img)[1]
    after_img = base64.b64encode(buffer)
    result['img'] = f'{res_img}'
    result['after_img'] = f'{after_img}'
    return result

@app.route("/match/getChart", methods=["POST"])
def getChart():
    symbol = request.form.get('symbol')
    chart_base64 = generateChart(symbol)
    return chart_base64

@app.route("/render/<symbol>")
def render(symbol):
    return render_template('index.html', symbol=symbol)
