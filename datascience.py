import pandas as pd
from datacana import app

def getData():
    csvFolder = app.config['DATAFILES'] + '/tabela.csv'

    df = pd.read_csv(csvFolder)
    colums = ['ID', 'AREA_HA', 'MUNICIPIO', 'LONG', 'LAT']
    df = df[colums]

    dfcities = df.groupby('MUNICIPIO')['AREA_HA'].sum().reset_index()
    dfcities['AREA_HA'] = dfcities['AREA_HA'].round(2)

    dfcoor = df.drop_duplicates(['MUNICIPIO', 'LONG', 'LAT'])[['MUNICIPIO', 'LONG', 'LAT']]
    
    dfcities = pd.merge(dfcities, dfcoor, on = ['MUNICIPIO'], how = 'inner')
    dfcities['MUNICIPIO'] = dfcities['MUNICIPIO'].str.title()

    return dfcities

def createData():
    df = getData()
    df.to_csv('cache/data.csv', index=True, index_label='ID')