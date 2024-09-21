from datacana import app
from flask import render_template

@app.route('/')
def home():
    """
        Rota responsável por renderizar a página principal do site.
    """

    return render_template('home.html',
                           DocTitle = 'DataCana')

@app.route('/plataforma')
def platform():
    """
        Rota responsável por renderizar a página da plataforma.
    """

    return render_template('Maps and Data/platform.html',
                           DocTitle = 'Datacana - Plataforma')