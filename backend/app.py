from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json 

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

@app.route('/get-streaming-info', methods=['POST'])
def get_streaming_info():
    film_name = request.json.get('film_name')
    country_code = request.json.get('country_code')
    if not film_name:
        return jsonify({"error": "Film name is required"}), 400
    
    # Load API key from the config.json file
    with open('backend\config.json', 'r') as file:
        config = json.load(file)
    xrapidapikey = config['x-rapidapi-key']

    url = "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup"
    querystring = {"term": "", "country": ""}
    querystring = {"term": film_name, "country": country_code}
    # print(querystring)
    headers = {
        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
        "x-rapidapi-key": xrapidapikey
    }

    response = requests.get(url, headers=headers, params=querystring)
    # print(response.text)

    parsedData = json.loads(response.text)
    results = parsedData.get('results', [])
    print(results)
    for result in results:
        movie_name = result.get('name')
        # print(f"Movie: {movie_name}")
        
        locations = result.get('locations', [])
        for location in locations:
            display_name = location.get('display_name')
            url = location.get('url')
            # print(f" - Available on: {display_name}")
            # print(f"   URL: {url}")

    return results, 200

@app.route('/get-streaming-info', methods=['OPTIONS'])
def options():
    response = jsonify()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
