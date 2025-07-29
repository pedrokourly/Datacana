from flask import Flask

# Instância o APP
app = Flask(__name__)
app.config.from_pyfile('config.py')

# Importa as rotas para o APP
from routes import *
from routesData import *

if __name__ == '__main__':

    app.run(host = '0.0.0.0', debug = True)