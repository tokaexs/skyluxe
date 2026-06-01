from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Premium flight data
flights = [
    {
        "id": 1,
        "airline": "Emirates",
        "flightNumber": "EK-302",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/512px-Emirates_logo.svg.png",
        "departure": {
            "time": "21:30",
            "airport": "DXB",
            "city": "Dubai",
            "fullName": "Dubai International Airport"
        },
        "arrival": {
            "time": "12:00",
            "airport": "JFK",
            "city": "New York",
            "fullName": "John F. Kennedy International Airport"
        },
        "duration": "14h 30m",
        "stops": 0,
        "price": 245000,
        "aircraft": "Airbus A380-800",
        "amenities": ["lounge_access", "chauffeur_service", "gourmet_dining", "flat_bed"]
    },
    {
        "id": 2,
        "airline": "Qatar Airways",
        "flightNumber": "QR-701",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Qatar_Airways_Logo.svg/512px-Qatar_Airways_Logo.svg.png",
        "departure": {
            "time": "02:15",
            "airport": "DOH",
            "city": "Doha",
            "fullName": "Hamad International Airport"
        },
        "arrival": {
            "time": "08:45",
            "airport": "LHR",
            "city": "London",
            "fullName": "London Heathrow Airport"
        },
        "duration": "7h 30m",
        "stops": 0,
        "price": 185000,
        "aircraft": "Boeing 777-300ER",
        "amenities": ["lounge_access", "chauffeur_service", "gourmet_dining", "flat_bed"]
    },
    {
        "id": 3,
        "airline": "Etihad Airways",
        "flightNumber": "EY-103",
        "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Etihad_Airways_Logo.svg/512px-Etihad_Airways_Logo.svg.png",
        "departure": {
            "time": "22:45",
            "airport": "AUH",
            "city": "Abu Dhabi",
            "fullName": "Abu Dhabi International Airport"
        },
        "arrival": {
            "time": "05:15",
            "airport": "CDG",
            "city": "Paris",
            "fullName": "Charles de Gaulle Airport"
        },
        "duration": "7h 30m",
        "stops": 0,
        "price": 195000,
        "aircraft": "Boeing 787-9",
        "amenities": ["lounge_access", "chauffeur_service", "gourmet_dining", "flat_bed"]
    }
]

# Premium lounge data
lounges = [
    {
        "id": 1,
        "name": "Emirates First Class Lounge",
        "airport": "DXB",
        "features": ["spa", "fine_dining", "cigar_lounge", "private_suites"],
        "rating": 5
    },
    {
        "id": 2,
        "name": "Qatar Airways Al Safwa Lounge",
        "airport": "DOH",
        "features": ["spa", "fine_dining", "private_rooms", "business_center"],
        "rating": 5
    },
    {
        "id": 3,
        "name": "Etihad First Class Lounge & Spa",
        "airport": "AUH",
        "features": ["spa", "fine_dining", "fitness_center", "private_suites"],
        "rating": 5
    }
]

@app.route('/api/flights/search', methods=['POST'])
def search_flights():
    data = request.get_json()
    
    # Get search parameters
    from_city = data.get('from', '').lower()
    to_city = data.get('to', '').lower()
    departure_date = data.get('departureDate')
    return_date = data.get('returnDate')
    passengers = int(data.get('passengers', 1))
    travel_class = data.get('class', 'business')
    
    # Filter flights based on search criteria
    filtered_flights = [
        flight for flight in flights
        if (not from_city or flight['departure']['city'].lower() == from_city) and
        (not to_city or flight['arrival']['city'].lower() == to_city)
    ]
    
    # Adjust prices based on class and passengers
    for flight in filtered_flights:
        if travel_class == 'first':
            flight['price'] *= 1.5
        elif travel_class == 'private':
            flight['price'] *= 2.5
        
        # Add premium services based on class
        if travel_class in ['first', 'private']:
            flight['amenities'].extend(['private_suite', 'personal_chef'])
    
    return jsonify(filtered_flights)

@app.route('/api/flights/<int:flight_id>', methods=['GET'])
def get_flight(flight_id):
    flight = next((f for f in flights if f['id'] == flight_id), None)
    if flight:
        return jsonify(flight)
    return jsonify({'error': 'Flight not found'}), 404

@app.route('/api/airlines', methods=['GET'])
def get_airlines():
    airlines = list(set(flight['airline'] for flight in flights))
    return jsonify(airlines)

@app.route('/api/cities', methods=['GET'])
def get_cities():
    cities = list(set(
        [flight['departure']['city'] for flight in flights] +
        [flight['arrival']['city'] for flight in flights]
    ))
    return jsonify(cities)

@app.route('/api/lounges', methods=['GET'])
def get_lounges():
    airport = request.args.get('airport')
    if airport:
        filtered_lounges = [l for l in lounges if l['airport'] == airport]
        return jsonify(filtered_lounges)
    return jsonify(lounges)

@app.route('/api/booking', methods=['POST'])
def book_flight():
    data = request.get_json()
    
    booking = {
        'booking_id': 'LUX' + datetime.now().strftime('%Y%m%d%H%M%S'),
        'flight_id': data.get('flightId'),
        'passengers': data.get('passengers', []),
        'total_price': data.get('totalPrice'),
        'class': data.get('class', 'business'),
        'status': 'confirmed',
        'premium_services': {
            'lounge_access': True,
            'chauffeur_service': True,
            'concierge': True,
            'priority_checkin': True
        }
    }
    
    return jsonify(booking)

@app.route('/api/concierge', methods=['POST'])
def request_concierge():
    data = request.get_json()
    
    concierge_service = {
        'service_id': 'CON' + datetime.now().strftime('%Y%m%d%H%M%S'),
        'booking_id': data.get('bookingId'),
        'status': 'assigned',
        'services': [
            'personal_greeting',
            'priority_checkin',
            'lounge_escort',
            'boarding_assistance'
        ]
    }
    
    return jsonify(concierge_service)

@app.route('/api/chauffeur', methods=['POST'])
def request_chauffeur():
    data = request.get_json()
    
    chauffeur_service = {
        'service_id': 'CHF' + datetime.now().strftime('%Y%m%d%H%M%S'),
        'booking_id': data.get('bookingId'),
        'status': 'confirmed',
        'vehicle': {
            'type': 'luxury_sedan',
            'model': 'Mercedes-Benz S-Class',
            'features': [
                'wifi',
                'refreshments',
                'entertainment'
            ]
        }
    }
    
    return jsonify(chauffeur_service)

if __name__ == '__main__':
    app.run(debug=True, port=5001)