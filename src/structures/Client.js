const axios = require('axios')

const Player       = require('./Player')
const Circuit      = require('./Circuit')
const GrandPrix    = require('./GrandPrix')
const Driver       = require('./Driver')
const Constructor  = require('./Constructor')

const CONSTANTS    = require('../constants/constants')
const {
    UNAUTHENTICATED,
    AUTHENTICATED
} = require('../constants/endpoints')

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
 * @classdesc Represents the base client class for the F1 Fantasy API
 * @class
 */
class Client {

    /**
     * Constructs a new Fantasy Client. Each client is tied to a single account.
     * For most applications, you will only need to instantiate one client.
     * @param {ClientOptions} options The optional client settings
     * @constructor
     * @constructs Client
     */
    constructor(options = {}) {
        /** Caches **/ 

        /**
         * The Fantasy F1 player cache
         * @type {Map<T,Player>}
         */
        this.players = new Map()

        /**
         * The driver cache, keyed by last name
         * @type {Map<String,Driver>}
         */
        this.drivers = new Map()

        /**
         * The constructor cache, keyed by team name
         * @type {Map<String,Constructor>}
         */
        this.constructors = new Map()

        /**
         * The Grand Prix cache, keyed by the short name (short_name)
         * @type {Map<String,GrandPrix>}
         */
        this.grandsPrix = new Map()

        /**
         * The circuits cache, keyed by the short name (short_name)
         * @type {Map<String,Circuit>}
         */
        this.circuits = new Map()

        /**
         * The races cache
         * @type {Map<String,Race>}
         */
         this.races = new Map()

         /**
          * The leagues cache, keyed by their numeric league ID
          * @type {Map<Number,League>}
          */
         this.league = new Map()

        /** Other members **/

        /**
         * Whether to enable debug mode
         * @type {Boolean}
         */
         this.debug = options.debug || false

        /**
         * The base url for the API
         * @type {String}
         * @constant
         */
        this.API_URL = options.apiURL || 'https://fantasy-api.formula1.com/f1/2022'

        /**
         * The current Grand Prix for this week
         * @type {GrandPrix} 
         */
        this.currentGrandPrix
    }

    /**
     * Makes an HTTP request to an endpoint
     * @param {RequestOptions} options Extra options for the HTTP request
     * @private
     */
    _request(options = {}) {
        return new Promise((resolve, reject) => {

            let url = options.url || ''
            let method = options.method || 'GET'
            let authenticated = options.authenticated || false
            let data = options.data || {}
            let headers = {}

            // Check if authentication is required
            if(authenticated) {
                if(this.token)
                    headers['Authorization'] = this.token
                else
                    reject(new Error(`The client is not authenticated. You may not request "${url}" because that endpoint requires authentication.`))
            }


            axios[method.toLowerCase()]
            (
                `${this.API_URL}${url}`,
                {
                    headers,
                    data: JSON.stringify(data),
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
        return new Promise((resolve, reject) => {})
    }

    /**
     * Fetches the initial data
     * @returns {Promise<Client>}
     */
    init() {
        return new Promise((resolve, reject) => {
            // GET base url
            this._request({
                url: '/',
            })
            .then(async data => {
                // Find data for current season
                const season = data?.partner_game?.current_partner_season
                if(season) {
                    // Add current circuit
                    const currentCircuit = this?.currentGrandPrix?.circuit
                    if(currentCircuit)
                        this.circuits.set(currentCircuit.short_name, new Circuit(currentCircuit, this))

                    // Instantiate race cache
                    season.game_periods
                    .forEach(grandPrix => {
                        this.grandsPrix.set(grandPrix.short_name, new GrandPrix(grandPrix, this))
                    })

                    // Instantiate drivers and constructors
                    await this.fetchDriversAndConstructors(true)

                    resolve(this)
                } else {
                    reject(new Error('Incomplete request received during initialization.'))
                }
            }).catch(reject)
        })
    }

    /**
     * Fetch all drivers and constructors and add them to cache
     * @param {Boolean} forceUpdate Whether to ignore the cache and update the list directly
     * @returns Map<String, Player>
     */
    fetchDriversAndConstructors(forceUpdate) {
        return new Promise((resolve, reject) => {
            // Check cache
            if(this.drivers.size > 0 && this.constructors.size > 0 && !forceUpdate) {
                resolve([this.drivers, this.constructors])
                return true
            }

            // Call API
            this._request({
                url: UNAUTHENTICATED.DRIVERS,
            }).then(data => {

                // We receive both drivers and constructors
                data.players.forEach(player => {

                    switch(player.position) {
                        // Apply driver
                        case(CONSTANTS.POSITION_DRIVER):
                            this.drivers.set(player.last_name, new Driver(player, this))
                            break

                        case(CONSTANTS.POSITION_CONSTRUCTOR):
                            this.constructors.set(player.team_name, new Constructor(player, this))
                            break

                        default:
                            reject(new Error('Unknown position received from API, position must be a driver or constructor.'))
                            break
                    }
                })

                // Assign team to driver, if constructor exists
                this.drivers.forEach(driver => {
                    if(this.constructors.has(driver.team_name)) {
                        // Add team to driver
                        driver.constructor = this.constructors.get(driver.team_name)

                        // Add driver to team
                        driver.constructor.drivers.set(driver.last_name, driver)
                    } else {
                        reject(new Error(`Missing constructor ${driver.team_name} from cache.`))
                    }
                })

                resolve([this.drivers, this.constructors])
            }).catch(reject)
        })
    }
}

module.exports = Client