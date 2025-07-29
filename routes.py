from datacana import app
from flask import render_template, send_from_directory
import os

@app.route('/')
def home():
    return render_template('home.html',
                           DocTitle = 'DataCana')

@app.route('/sobre/projeto')
def aboutProject():
    return render_template('About/project.html',
                           DocTitle = 'DataCana - Projeto')

@app.route('/sobre/produtos')
def aboutProducts():
    return render_template('About/products.html',
                           DocTitle = 'DataCana - Produtos')

@app.route('/sobre/equipe')
def aboutTeam():
    return render_template('About/team.html',
                           DocTitle = 'DataCana - Equipe')

@app.route('/sobre/fundos')
def aboutFinances():
    return render_template('About/financing.html',
                           DocTitle = 'DataCana - Fundos')

@app.route('/metodologia/procedimentos')
def methodologyProc():
    return render_template('Methodology/procedures.html',
                           DocTitle = 'DataCana - Metodologia')

@app.route('/plataforma')
def platform():
    return render_template('Maps and Data/platform.html',
                           DocTitle = 'DataCana - Plataforma')

@app.route('/dados')
def plataform():
    return render_template('Maps and Data/data.html',
                           DocTitle = 'DataCana - Dados')

@app.route('/downloads')
def downloads():
    return render_template('Maps and Data/downloads.html',
                           DocTitle = 'DataCana - Downloads')

@app.route('/teste-dataprocessor')
def testeDataProcessor():
    return render_template('teste_dataprocessor.html',
                           DocTitle = 'DataCana - Teste DataProcessor')

# Rotas para servir arquivos da cache (necessário para o DataProcessor)
@app.route('/cache/<path:filename>')
def serve_cache_file(filename):
    """Serve arquivos da pasta cache para o DataProcessor"""
    cache_dir = os.path.join(app.root_path, 'cache')
    return send_from_directory(cache_dir, filename)

@app.route('/termos')
def termsOfUse():
    return render_template('terms.html',
                           DocTitle = 'DataCana - Termos de Uso')

@app.route('/contato')
def contact():
    return render_template('contact.html',
                           DocTitle = 'DataCana - Contato')