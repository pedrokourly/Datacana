from datacana import app
from flask import jsonify
import pandas as pd

@app.route('/map/Data')
def dataMap():
    csvFolder = app.config['DATAFILES'] + '/tabela.csv'

    df = pd.read_csv(csvFolder)
    colums = ['AREA_HA', 'MUNICIPIO', 'LONG', 'LAT']
    df = df[colums]

    dfcities = df.groupby('MUNICIPIO')['AREA_HA'].sum().reset_index()
    dfcities['AREA_HA'] = dfcities['AREA_HA'].round(2)

    dfcoor = df.drop_duplicates(['MUNICIPIO', 'LONG', 'LAT'])[['MUNICIPIO', 'LONG', 'LAT']]
    
    dfcities = pd.merge(dfcities, dfcoor, on = ['MUNICIPIO'], how = 'inner')
    dfcities['MUNICIPIO'] = dfcities['MUNICIPIO'].str.title()

    point = dfcities.to_dict()
    qnt = len(dfcities)
    MGTotal = dfcities['AREA_HA'].sum()

    return jsonify(data = point,
                   qnt = qnt,
                   UF = MGTotal)