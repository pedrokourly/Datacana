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

    return jsonify(cana = json.loads(open(f"cache/Cana_{year}.geojson", 'r').read()))

@app.route('/data/download/<int:year>', methods = ['GET'])
def downloadData(year):
    """
        Rota que baixa dados de um ano específico em CSV
        Método: GET
    """

    return send_file(f"cache/CSVs/data_{year}.csv", as_attachment = True)