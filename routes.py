from datacana import app
from flask import render_template

# Rota principal | Pag principal
@app.route('/')
def home():
    from routesMap import dataMap
    response = dataMap()
    data = response.get_json()

    return render_template('home.html',
                           DocTitle = 'DataCana',
                           AreaMG = data.get('UF'))

@app.route('/plataforma')
def platform():
    return render_template('Maps and Data/platform.html',
                           DocTitle = 'Datacana - Plataforma')