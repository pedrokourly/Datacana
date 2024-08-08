from datacana import app
from flask import send_file

@app.route('/downloadData')
def downloadData():
    return send_file('cache/data.csv', as_attachment=True)