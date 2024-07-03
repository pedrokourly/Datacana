from datacana import app
from flask import render_template, jsonify
import pandas as pd

@app.route('/mapa')
def mapPage():
    return render_template('project.html',
                           DocTitle = 'Mapa')

@app.route('/plataforma')
def map():
    return render_template('map.html')

@app.route('/mapData')
def dataMap():
    csvFolder = app.config['DATAFILES'] + '/tabela.csv'
    df = pd.read_csv(csvFolder)
    colums = ['AREA_HA', 'MUNICIPIO', 'LONG', 'LAT']
    df = df[colums]
    point = df.to_dict()
    qnt = len(df)
    return jsonify(data = point,
                   qnt = qnt)