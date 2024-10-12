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
    df = pd.read_csv(f'cache/CSVs/data_{year}.csv')
    escala = df['AREA'].describe().to_dict()
    qnt = len(df)
    totalArea = df['AREA'].sum()
    
    # Tratando os dados processados
    dfResumido = pd.read_csv(f'cache/CSVs/data_{year}_resumido.csv').to_dict()
    return jsonify(geoJsonCana = json.loads(open(f"cache/Cana_{year}.geojson", 'r', encoding = "utf8").read()),
                   dadosCana = dfResumido,
                   escala = escala,
                   qnt = qnt,
                   totalArea = totalArea)

@app.route('/data/download/<int:year>', methods = ['GET'])
def downloadData(year):
    """
        Rota que baixa dados de um ano específico em CSV
        Método: GET
    """

    return send_file(f"cache/CSVs/data_{year}.csv", as_attachment = True)