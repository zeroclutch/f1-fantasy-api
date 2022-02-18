// List of all endpoints

// Base url
exports.BASE_URL = 'https://fantasy-api.formula1.com/f1/2022'

// Public endpoints
exports.UNAUTHENTICATED = {
    // F1 Endpoints
    CIRCUITS: '/circuits',
    DRIVERS: '/players',
    CONSTRUCTORS: '/teams',

    // Fantasy League Endpoints
    LEAGUES_LOBBY_UPCOMING: '/leagues/lobby/upcoming',
}

// User endpoints
exports.AUTHENTICATED = {
    BASE: '/'
}