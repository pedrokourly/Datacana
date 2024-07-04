from flask import Flask

# Instância o APP
app = Flask(__name__)
app.config.from_pyfile('config.py')

# Importa as rotas para o APP
from routes import *
from routesMap import *

if __name__ == '__main__':
    app.run(debug = True)