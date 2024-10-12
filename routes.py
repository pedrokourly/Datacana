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

@app.route('/sobre/projeto')
def aboutProject():
    return render_template('About/project.html',
                           DocTitle = 'Datacana - Projeto')

@app.route('/sobre/produtos')
def aboutProducts():
    return render_template('About/products.html',
                           DocTitle = 'Datacana - Produtos')

@app.route('/sobre/equipe')
def aboutTeam():
    return render_template('About/team.html',
                           DocTitle = 'Datacana - Equipe')

@app.route('/sobre/fundos')
def aboutFinances():
    return render_template('About/financing.html',
                           DocTitle = 'Datacana - Fundos')

@app.route('/metodologia/procedimentos')
def methodologyProc():
    return render_template('Methodology/procedures.html',
                           DocTitle = 'Datacana - Metodologia')

@app.route('/plataforma')
def platform():
    return render_template('Maps and Data/platform.html',
                           DocTitle = 'Datacana - Plataforma')

@app.route('/dados')
def plataform():
    return render_template('Maps and Data/data.html',
                           DocTitle = 'Datacana - Dados')

@app.route('/downloads')
def downloads():
    return render_template('Maps and Data/downloads.html',
                           DocTitle = 'Datacana - Downloads')
@app.route('/termos')
def termsOfUse():
    return render_template('terms.html',
                           DocTitle = 'Datacana - Termos de Uso')

@app.route('/contato')
def contact():
    return render_template('contact.html',
                           DocTitle = 'Datacana - Contato')