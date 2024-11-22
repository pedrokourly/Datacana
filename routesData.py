from datacana import app
from flask import jsonify, send_file
import json

# Rotas de GET da nossa DataBase
@app.route('/data/<int:year>', methods = ['GET'])
def getData(year):
    """
        Rota que busca dados de um ano específico
        Método: GET
    """
    import pandas as pd
    # Tratando o geoJson
    df = pd.read_csv(f'cache/CSVs/Data_{year}.csv')
    escala = df['AREA'].describe().to_dict()
    qnt = len(df)
    totalArea = df['AREA'].sum()
    
    return jsonify(geoJsonCana = json.loads(open(f"cache/Cana_{year}.geojson", 'r', encoding = "utf8").read()),
                   dadosCana = df,
                   escala = escala,
                   qnt = qnt,
                   totalArea = totalArea)

@app.route('/data/resume/<int:year>', methods = ['GET'])
def getResumeData(year):
    """
        Rota que busca dados resumidos de um ano específico
        Método: GET
    """
    import pandas as pd

    dfResumido = pd.read_csv(f'cache/CSVs/Data_{year}_Resume.csv')
    escala = dfResumido['TOTAL_AREA'].describe().to_dict()
    qnt = len(dfResumido)
    totalArea = dfResumido['TOTAL_AREA'].sum()

    return jsonify(dadosCana = dfResumido.to_dict(),
                   escala = escala,
                   qnt = qnt,
                   totalArea = totalArea)

@app.route('/downloads/data/<int:year>', methods = ['GET'])
def downloadData(year):
    return send_file(f"cache/CSVs/Data_{year}.csv", as_attachment = True)

@app.route('/downloads/data/resume/<int:year>', methods = ['GET'])
def downloadDataResume(year):
    return send_file(f"cache/CSVs/Data_{year}_Resume.csv", as_attachment = True)

@app.route('/downloads/data/geojson/<int:year>', methods = ['GET'])
def downloadDataGeoJSON(year):
    return send_file(f"cache/Cana_{year}.geojson", as_attachment = True)

@app.route('/downloads/data/shp/<int:year>', methods = ['GET'])
def downloadDataSHP(year):
    return send_file(f"cache/SHPs/Cana_{year}.shp", as_attachment = True)