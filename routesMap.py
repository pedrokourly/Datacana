from datacana import app
from flask import jsonify
import pandas as pd

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