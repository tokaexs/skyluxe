// API endpoints
const API_BASE_URL = 'http://localhost:5001/api';
const ENDPOINTS = {
    SEARCH_FLIGHTS: `${API_BASE_URL}/flights/search`,
    GET_FLIGHT: (id) => `${API_BASE_URL}/flights/${id}`,
    GET_AIRLINES: `${API_BASE_URL}/airlines`,
    GET_CITIES: `${API_BASE_URL}/cities`,
    BOOK_FLIGHT: `${API_BASE_URL}/booking`,
    GET_LOUNGES: `${API_BASE_URL}/lounges`,
    REQUEST_CONCIERGE: `${API_BASE_URL}/concierge`,
    CHAUFFEUR_SERVICE: `${API_BASE_URL}/chauffeur`
};

let flights = [];

// DOM Elements
const flightSearchForm = document.getElementById('flightSearchForm');
const flightResults = document.getElementById('flightResults');
const priceFilter = document.getElementById('priceFilter');
const airlineFilter = document.getElementById('airlineFilter');
const cabinFilter = document.getElementById('cabinFilter');

// Fetch initial data for airlines and cities
async function fetchInitialData() {
    try {
        const airlinesResponse = await fetch(ENDPOINTS.GET_AIRLINES);
        const citiesResponse = await fetch(ENDPOINTS.GET_CITIES);

        if (!airlinesResponse.ok || !citiesResponse.ok) {
            throw new Error('Failed to fetch initial data');
        }

        const airlines = await airlinesResponse.json();
        const cities = await citiesResponse.json();

        // Populate filters with fetched data
        populateFilter(airlineFilter, airlines.map(airline => ({ value: airline.code, label: airline.name })));
        populateFilter(cabinFilter, [
            { value: 'business', label: 'Business Class' },
            { value: 'first', label: 'First Class' },
            { value: 'private', label: 'Private Suite' }
        ]);
    } catch (error) {
        console.error('Error fetching initial data:', error);
        showNotification('Failed to load initial data', 'error');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Set minimum date for departure and return
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('departureDate').min = today;
    document.getElementById('returnDate').min = today;

    // Fetch initial data
    fetchInitialData();

    // Initialize filters
    initializeFilters();
});

flightSearchForm.addEventListener('submit', handleSearch);

// Filter change events
priceFilter.addEventListener('change', applyFilters);
airlineFilter.addEventListener('change', applyFilters);
cabinFilter.addEventListener('change', applyFilters);

// Functions
async function handleSearch(e) {
    e.preventDefault();
    
    const fromLocation = document.getElementById('fromLocation').value;
    const toLocation = document.getElementById('toLocation').value;
    const departureDate = document.getElementById('departureDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const passengers = document.getElementById('passengers').value;
    const travelClass = document.getElementById('class').value;
    
    if (!fromLocation || !toLocation || !departureDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Show loading state with luxury spinner
    flightResults.innerHTML = `
        <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-gold border-t-transparent"></div>
        </div>
    `;
    
    try {
        const response = await fetch(ENDPOINTS.SEARCH_FLIGHTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: fromLocation,
                to: toLocation,
                departureDate,
                returnDate,
                passengers,
                class: travelClass
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch flights');
        }

        flights = await response.json();
        displayFlights(flights);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to fetch flights. Please try again.', 'error');
        flightResults.innerHTML = `
            <div class="text-center py-8">
                <div class="text-red-500">Failed to fetch flights. Please try again.</div>
            </div>
        `;
    }
}

function displayFlights(flightsToDisplay) {
    if (flightsToDisplay.length === 0) {
        flightResults.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-plane-slash text-4xl text-gray-400 mb-4"></i>
                <div class="text-xl font-medium text-gray-600">No flights found matching your criteria</div>
                <p class="text-gray-500 mt-2">Try adjusting your search parameters</p>
            </div>
        `;
        return;
    }

    flightResults.innerHTML = flightsToDisplay.map(flight => `
        <div class="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div class="flex items-center mb-6 lg:mb-0">
                    <img src="${flight.logo}" alt="${flight.airline}" class="h-12 w-auto mr-6">
                    <div>
                        <div class="text-xl font-semibold text-luxury">${flight.airline}</div>
                        <div class="text-sm text-gray-500">Flight ${flight.flightNumber} • ${flight.aircraft}</div>
                    </div>
                </div>
                
                <div class="flex-1 lg:mx-12">
                    <div class="flex items-center justify-between max-w-md mx-auto">
                        <div class="text-center">
                            <div class="text-2xl font-semibold text-luxury">${flight.departure.time}</div>
                            <div class="text-sm font-medium text-gray-600">${flight.departure.airport}</div>
                            <div class="text-xs text-gray-500">${flight.departure.city}</div>
                        </div>
                        
                        <div class="flex-1 px-8">
                            <div class="relative">
                                <div class="absolute w-full h-0.5 bg-gold bg-opacity-20 top-1/2 transform -translate-y-1/2"></div>
                                <div class="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-gold"></div>
                                <div class="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full bg-gold"></div>
                            </div>
                            <div class="text-sm text-center text-gray-500 mt-2">${flight.duration}</div>
                        </div>
                        
                        <div class="text-center">
                            <div class="text-2xl font-semibold text-luxury">${flight.arrival.time}</div>
                            <div class="text-sm font-medium text-gray-600">${flight.arrival.airport}</div>
                            <div class="text-xs text-gray-500">${flight.arrival.city}</div>
                        </div>
                    </div>
                </div>
                
                <div class="text-right mt-6 lg:mt-0">
                    <div class="text-3xl font-bold text-luxury">₹${flight.price.toLocaleString()}</div>
                    <div class="text-sm text-gray-500 mb-3">${document.getElementById('class').value}</div>
                    <button onclick="showFlightDetails(${flight.id})" 
                            class="px-8 py-3 bg-gold text-luxury rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 font-medium">
                        Select
                    </button>
                </div>
            </div>

            <!-- Premium Features -->
            <div class="mt-6 pt-6 border-t border-gray-100">
                <div class="flex flex-wrap gap-4 text-sm">
                    <div class="flex items-center text-gold">
                        <i class="fas fa-glass-martini mr-2"></i>
                        <span>Lounge Access</span>
                    </div>
                    <div class="flex items-center text-gold">
                        <i class="fas fa-utensils mr-2"></i>
                        <span>Gourmet Dining</span>
                    </div>
                    <div class="flex items-center text-gold">
                        <i class="fas fa-bed mr-2"></i>
                        <span>Flat Bed Seats</span>
                    </div>
                    <div class="flex items-center text-gold">
                        <i class="fas fa-wifi mr-2"></i>
                        <span>High-Speed Wi-Fi</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function showFlightDetails(flightId) {
    try {
        const response = await fetch(ENDPOINTS.GET_FLIGHT(flightId));
        if (!response.ok) {
            throw new Error('Failed to fetch flight details');
        }
        
        const flight = await response.json();
        if (!flight) return;

        // Create modal content
        const modalContent = `
            <div class="modal-container">
                <div class="modal-content">
                    <div class="p-8">
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <h3 class="text-2xl font-playfair font-bold text-luxury">Premium Flight Experience</h3>
                                <p class="text-gray-500 mt-1">Experience luxury at 40,000 feet</p>
                            </div>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-500">
                                <i class="fas fa-times text-xl"></i>
                            </button>
                        </div>

                        <!-- Flight Details -->
                        <div class="space-y-8">
                            <!-- Airline Info -->
                            <div class="flex items-center justify-between pb-6 border-b">
                                <div class="flex items-center">
                                    <img src="${flight.logo}" alt="${flight.airline}" class="h-16 w-auto mr-6">
                                    <div>
                                        <div class="text-2xl font-semibold text-luxury">${flight.airline}</div>
                                        <div class="text-gray-500">${flight.flightNumber} • ${flight.aircraft}</div>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-3xl font-bold text-luxury">₹${flight.price.toLocaleString()}</div>
                                    <div class="text-sm text-gray-500">per passenger</div>
                                </div>
                            </div>

                            <!-- Flight Schedule -->
                            <div class="py-6 border-b">
                                <h4 class="text-xl font-semibold mb-6">Flight Schedule</h4>
                                <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                        <div class="relative pl-8">
                                            <div class="absolute left-0 top-2 w-4 h-4 rounded-full bg-gold"></div>
                                            <div class="text-xl font-semibold text-luxury">${flight.departure.time}</div>
                                            <div class="text-gray-600">${flight.departure.city} (${flight.departure.airport})</div>
                                            <div class="text-sm text-gray-500">${flight.departure.fullName}</div>
                                        </div>
                                        
                                        <div class="relative pl-8 mt-8">
                                            <div class="absolute left-0 top-2 w-4 h-4 rounded-full bg-gold"></div>
                                            <div class="text-xl font-semibold text-luxury">${flight.arrival.time}</div>
                                            <div class="text-gray-600">${flight.arrival.city} (${flight.arrival.airport})</div>
                                            <div class="text-sm text-gray-500">${flight.arrival.fullName}</div>
                                        </div>
                                    </div>
                                    
                                    <div class="text-right">
                                        <div class="text-sm text-gray-500">Duration</div>
                                        <div class="text-xl font-semibold text-luxury">${flight.duration}</div>
                                        <div class="text-sm text-gray-500">${flight.stops === 0 ? 'Non-stop' : flight.stops + ' Stop(s)'}</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Premium Services -->
                            <div class="py-6 border-b">
                                <h4 class="text-xl font-semibold mb-6">Premium Services</h4>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div class="flex items-start">
                                        <div class="w-12 h-12 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                                            <i class="fas fa-concierge-bell text-xl text-gold"></i>
                                        </div>
                                        <div>
                                            <h5 class="font-semibold text-luxury">Personal Concierge</h5>
                                            <p class="text-sm text-gray-500">Dedicated assistance throughout your journey</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="w-12 h-12 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                                            <i class="fas fa-glass-martini text-xl text-gold"></i>
                                        </div>
                                        <div>
                                            <h5 class="font-semibold text-luxury">Premium Lounge</h5>
                                            <p class="text-sm text-gray-500">Access to exclusive airport lounges</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="w-12 h-12 bg-gold bg-opacity -10 rounded-full flex items-center justify-center mr-4">
                                            <i class="fas fa-car text-xl text-gold"></i>
                                        </div>
                                        <div>
                                            <h5 class="font-semibold text-luxury">Chauffeur Service</h5>
                                            <p class="text-sm text-gray-500">Luxury transportation included</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <div class="w-12 h-12 bg-gold bg-opacity-10 rounded-full flex items-center justify-center mr-4">
                                            <i class="fas fa-utensils text-xl text-gold"></i>
                                        </div>
                                        <div>
                                            <h5 class="font-semibold text-luxury">Fine Dining</h5>
                                            <p class="text-sm text-gray-500">Gourmet meals and premium beverages</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Aircraft Features -->
                            <div class="py-6 border-b">
                                <h4 class="text-xl font-semibold mb-6">Aircraft Features</h4>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                                        <i class="fas fa-bed text-2xl text-gold mb-2"></i>
                                        <h5 class="font-semibold text-luxury">180° Flat Bed</h5>
                                        <p class="text-sm text-gray-500">Full-flat beds with direct aisle access</p>
                                    </div>
                                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                                        <i class="fas fa-tv text-2xl text-gold mb-2"></i>
                                        <h5 class="font-semibold text-luxury">Entertainment</h5>
                                        <p class="text-sm text-gray-500">32" HD screens with premium content</p>
                                    </div>
                                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                                        <i class="fas fa-wifi text-2xl text-gold mb-2"></i>
                                        <h5 class="font-semibold text-luxury">Wi-Fi</h5>
                                        <p class="text-sm text-gray-500">High-speed internet connectivity</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Fare Details -->
                            <div class="py-6 border-b">
                                <h4 class="text-xl font-semibold mb-6">Fare Details</h4>
                                <div class="space-y-4">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Base Fare</span>
                                        <span class="font-semibold">₹${Math.floor(flight.price * 0.85).toLocaleString()}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">Taxes & Fees</span>
                                        <span class="font-semibold">₹${Math.floor(flight.price * 0.15).toLocaleString()}</span>
                                    </div>
                                    <div class="flex justify-between pt-4 border-t">
                                        <span class="text-luxury font-semibold">Total</span>
                                        <span class="text-2xl font-bold text-luxury">₹${flight.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Book Button -->
                            <div class="mt-8 text-right">
                                <button onclick="bookFlight(${flight.id})" 
                                        class="px-8 py-4 bg-luxury text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 transform hover:scale-105 font-medium">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        const modalContainer = document.createElement('div');
        modalContainer.id = 'flightModal';
        modalContainer.innerHTML = modalContent;
        document.body.appendChild(modalContainer);

    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to fetch flight details', 'error');
    }
}

function closeModal() {
    const modal = document.getElementById('flightModal');
    if (modal) {
        modal.remove();
    }
}

async function bookFlight(flightId) {
    try {
        const flight = flights.find(f => f.id === flightId);
        if (!flight) return;

        const passengers = parseInt(document.getElementById('passengers').value);
        const totalPrice = flight.price * passengers;

        // Book flight
        const bookingResponse = await fetch(ENDPOINTS.BOOK_FLIGHT , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                flightId,
                passengers: Array(passengers).fill({
                    type: 'adult',
                    seatPreference: 'window'
                }),
                totalPrice,
                class: document.getElementById('class').value
            }),
        });

        if (!bookingResponse.ok) {
            throw new Error('Failed to book flight');
        }

        const booking = await bookingResponse.json();

        // Request concierge service
        await fetch(ENDPOINTS.REQUEST_CONCIERGE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingId: booking.booking_id
            }),
        });

        // Request chauffeur service
        await fetch(ENDPOINTS.CHAUFFEUR_SERVICE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingId: booking.booking_id
            }),
        });

        showNotification(`Booking confirmed! Your booking ID is ${booking.booking_id}`, 'success');
        closeModal();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to book flight', 'error');
    }
}

function showNotification(message, type = 'info') {
    const notificationColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${notificationColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-y-0`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('translate-y-[-100%]', 'opacity-0');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function initializeFilters() {
    // Price ranges for premium flights
    const priceRanges = [
        { value: 'all', label: 'All Prices' },
        { value: '0-50000', label: '₹0 - ₹50,000' },
        { value: '50000-100000', label: '₹50,000 - ₹1,00,000' },
        { value: '100000+', label: '₹1,00,000+' }
    ];

    // Premium airlines
    const airlines = [
        { value: 'all', label: 'All Airlines' },
        { value: 'emirates', label: 'Emirates' },
        { value: 'etihad', label: 'Etihad' },
        { value: 'qatar', label: 'Qatar Airways' }
    ];

    // Cabin classes
    const cabins = [
        { value: 'all', label: 'All Classes' },
        { value: 'business', label: 'Business' },
        { value: 'first', label: 'First Class' },
        { value: 'private', label: 'Private Suite' }
    ];

    populateFilter(priceFilter, priceRanges);
    populateFilter(airlineFilter, airlines);
    populateFilter(cabinFilter, cabins);
}

function populateFilter(select, options) {
    select.innerHTML = options.map(option => 
        `<option value="${option.value}">${option.label}</option>`
    ).join('');
}

function applyFilters() {
    const selectedPrice = priceFilter.value;
    const selectedAirline = airlineFilter.value;
    const selectedCabin = cabinFilter.value;

    let filteredFlights = [...flights];

    // Apply price filter
    if (selectedPrice !== 'all') {
        const [min, max] = selectedPrice.split('-').map(Number);
        filteredFlights = filteredFlights.filter(flight => {
            if (max) {
                return flight.price >= min && flight.price < max;
            } else {
                return flight.price >= min;
            }
        });
    }

    // Apply airline filter
    if (selectedAirline !== 'all') {
        filteredFlights = filteredFlights.filter(flight => 
            flight.airline.toLowerCase().includes(selectedAirline.toLowerCase())
        );
    }

    // Apply cabin filter
    if (selectedCabin !== 'all') {
        filteredFlights = filteredFlights.filter(flight => 
            flight.class.toLowerCase() === selectedCabin.toLowerCase()
        );
    }

    displayFlights(filteredFlights);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Set minimum date for departure and return
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('departureDate').min = today;
        document.getElementById('returnDate').min = today;

        // Fetch initial data
        fetchInitialData();
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to initialize page', 'error');
    }
}); 