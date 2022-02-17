const axios = require('axios')

const Player = require('./Player')

/**
 * The options for the base client
 * @typedef {Object} ClientOptions
 * @property {String} apiURL
 */

/**
 * The options for a request
 * @typedef {Object} RequestOptions
 * @property {String} url The API endpoint to request.
 * @property {String} [method] The HTTP method to use, e.g. GET, POST. Defaults to 'GET'.
 * @property {Boolean} [authenticated] true if requesting an authenticated endpoint. Defaults to false.
 * @property {Object} [data] The request body for the request, if needed.
 */

/**
 * Represents the base client class for the F1 Fantasy API
 * @class
 */
export class Client {

    /**
     * Constructs a new Fantasy Client. Each client is tied to a single account.
     * For most applications, you will only need to instantiate one client.
     * @param {ClientOptions} options The optional client settings
     */
    constructor(options) {
        // Define properties to be unwritable
        Object.defineProperties(this, {
            apiURL: {
                value: options.apiURL || 'https://fantasy-api.formula1.com/partner_games/f1',
                enumerable: true
            },
            debug: {
                value: options.debug || false,
                enumerable: true
            },

            // Constants
            MAX_PLAYERS: {
                value: 20,
                enumerable: FALSE
            },

            // Caches
            players: {
                value: new Map(),
                enumerable: true
            }
        })
    }

    /**
     * Makes an HTTP request to an endpoint
     * @param {RequestOptions} options Extra options for the HTTP request
     * @private
     */
    _request(options = {
        url: '',
        method: 'GET',
        authenticated: false,
        data: {}
    }) {
        return new Promise((resolve, reject) => {
            const headers = {}

            // Check if authentication is required
            if(options.authenticated) {
                if(this.token)
                    headers['Authorization'] = this.token
                else
                    reject(new Error(`The client is not authenticated. You may not request "${options.url}" because that endpoint requires authentication.`))
            }

            axios(
                {
                    url: options.url,
                    baseURL: this.apiURL,
                    method: options.method,
                    headers,
                    data: JSON.stringify(options.data),
                }
            )
            .then(res => resolve(res.data))
            .catch(reject)
        })
    }

    /**
     * 
     * @param {String} username Account username to the F1 Fantasy API
     * @param {String} password Account password to the F1 Fantasy API
     */
    login(username, password) {

    }

    /**
     * Fetch all players and add them to cache
     * @param {Boolean} forceUpdate Whether to ignore the cache and update the list directly
     * @returns Map<String, Player>
     */
    getPlayers(forceUpdate) {
        return new Promise((resolve, reject) => {
            // Check cache
            if(this.players.size === this.MAX_PLAYERS && !forceUpdate) {
                resolve(this.players)
                return true
            }

            this._request({
                url: '/players',
            }).then(players => {
                players.forEach(player => {
                    
                    this.players.set(player.id, new Player(player))
                })
                resolve(this.players)
            }).catch(reject)
        })
    }
}