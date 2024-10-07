from flask import Flask

# Instância o APP
app = Flask(__name__)
app.config.from_pyfile('config.py')

# Importa as rotas para o APP
from routes import *
from routesMap import *
from routesDownloads import *
 
# Importa as funções iniciais
from datascience import createData

if __name__ == '__main__':
    createData()
    app.run(debug = True)