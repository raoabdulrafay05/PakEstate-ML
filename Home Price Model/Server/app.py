from flask import Flask, request, jsonify
import util

app = Flask(__name__)

@app.route("/get_location_city_names", methods=["GET"])
def get_location_city_names():
    response = jsonify({
        'location_city_names': util.get_location_city_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/get_city_names", methods=["GET"])
def get_city_names():
    response = jsonify({
        'city_names': util.get_city_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/get_types", methods=["GET"])
def get_types():
    response = jsonify({
        'types': util.get_types()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route("/predict_home_prices", methods=["POST"])
def predict_home_prices():
    area = int(request.form['area'])
    bedroom = int(request.form['bedroom'])
    bath = int(request.form['bath'])
    property_type = request.form['type']
    location = request.form['location']
    city = request.form['city']

    estimated_price = util.get_estimated_price(area, bedroom, bath, property_type, city, location)
    response = jsonify({
        'estimated_price': estimated_price
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/get_location_names', methods=["GET","POST"])
def get_location_names_endpoint():
    property_type = request.args.get('type')
    city = request.args.get('city')
    locations = util.get_location_names(property_type, city)
    response = jsonify({
        'locations': locations
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    util.load_saved_artifacts()
    app.run(debug=True)
