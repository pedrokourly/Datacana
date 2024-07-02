from datacana import app
from flask import render_template

# Rota principal | Pag principal
@app.route('/')
def home():
    return render_template('home.html',
                           DocTitle = 'DataCana')

@app.route('/sobre')
def about():
    return render_template('team.html',
                           DocTitle = 'DataCana')

@app.route('/mapa')
def map():
    return render_template('project.html',
                           DocTitle = 'Mapa')