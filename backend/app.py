from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import json 
import os

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)  

@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/get-streaming-info', methods=['POST']) #local
#@app.route('/get-streaming-info', methods=['POST'])
def get_streaming_info():
    film_name = request.json.get('film_name')
    country_code = request.json.get('country_code')
    if not film_name:
        return jsonify({"error": "Film name is required"}), 400
    
    # Load API key from the config.json file
    with open('.\\backend\config.json', 'r') as file: #local
    # with open('config.json', 'r') as file:
        config = json.load(file)
    xrapidapikey = config['x-rapidapi-key']

    url = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup"
    querystring = {"term": "", "country": ""}
    querystring = {"term": film_name, "country": country_code}
    headers = {
        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
        "x-rapidapi-key": xrapidapikey
    }

    response = requests.get(url, headers=headers, params=querystring)

    parsedData = json.loads(response.text)
    results = parsedData.get('results', [])

    return results, 200

@app.route('/api/get-streaming-info', methods=['OPTIONS']) #local
#@app.route('/get-streaming-info', methods=['OPTIONS'])
def options():
    response = jsonify()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
