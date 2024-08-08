from datacana import app
from flask import jsonify

@app.route('/map/Data')
def dataMap():
    from datascience import getData
    df = getData()
    
    point = df.to_dict()
    qnt = len(df)
    MGTotal = df['AREA_HA'].sum()

    escala = df['AREA_HA'].describe()
    escala = escala.to_dict()

    return jsonify(data = point,
                   qnt = qnt,
                   escala = escala,
                   UF = MGTotal)