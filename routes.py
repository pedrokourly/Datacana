from datacana import app
from flask import render_template

# Rota principal | Pag principal
@app.route('/')
def home():
    return render_template('home.html',
                           DocTitle = 'DataCana')