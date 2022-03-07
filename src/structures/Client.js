const axios = require('axios')

const User       = require('./User')
const Circuit      = require('./Circuit')
const GrandPrix    = require('./GrandPrix')
const Driver       = require('./Driver')
const Constructor  = require('./Constructor')
const ClientUser   = require('./ClientUser')

const CONSTANTS    = require('../constants/constants')
const {
    BASE_URL,
    UNAUTHENTICATED,
    AUTHENTICATED
} = require('../constants/endpoints')

const generateHeaders = require('../util/generateHeaders')

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
         * @type {Map<T,User>}
         */
        this.users = new Map()

        /**
         * The user for this client
         * @type {ClientUser}
         */
        this.user

        /**
         * The driver cache, keyed by numeric ID
         * @type {Map<String,Driver>}
         */
        this.drivers = new Map()

        /**
         * The constructor cache, keyed by numeric ID
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
        this.API_URL = options.apiURL || BASE_URL

        /**
         * The current Grand Prix for this week
         * @type {GrandPrix} 
         */
        this.currentGrandPrix

        /** Authentication **/

        /**
         * Login session data
         * @type {Object}
         * @prop {Object} data The data object that contains the subscriptionToken
         * @private
         */
        this.loginSession

        /**
         * Expiry date for the current login session
         * @type {Date}
         */
        this.loginSessionExpiry

        /**
         * The numeric ID of the logged-in user
         * @type {Number}
         */
        this.userID

        /**
         * The cookie that we are sending to make requests. 
         * @type {Map}
         */
        this._cookie = new Map(CONSTANTS.COOKIE)
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
            let headers = generateHeaders()

            // Check if authentication is required
            if(authenticated) {
                if(this._cookie.has('login-session'))
                    headers['Cookie'] = this._cookieString
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
     * Base64 decodes a JSON web token
     * @param {String} jwt The string-based JSON web token to decode
     * @returns {Array} Array of 3 parts, the first 2 base64 decoded
     * @private
     */
    _decodeJWT(jwt) {
        return jwt
            .split('.')
            .map((val, i) => 
                (i < 2) ? Buffer.from(val, 'base64').toString('utf8')
                        : val)
    }

    /**
     * Logs in using a username and password
     * @param {String} username Account username to the F1 Fantasy API
     * @param {String} password Account password to the F1 Fantasy API
     */
    login(username, password) {
        return new Promise(async (resolve, reject) => {
            // Get login session by-password endpoint using username and password
            const [loginSession, loginSessionExpiry, userID] = await this._loginWithPassword(username, password).catch(reject)

            // Assign login tokens to the client
            this.loginSession = loginSession
            this.loginSessionExpiry = loginSessionExpiry
            this._cookie.set('login-session', loginSession)

            // Assign user information from the login request
            this.userID = userID
            this._cookie.get('register').userID = userID

            // Get new session for authenticated requests
            let playOnSession = await this._getPlayOnSession(loginSession).catch(reject)

            // Add session data to cookie
            this._cookie.set('_playon_whitelabel_session_f1_backend_production', playOnSession)

            // TODO: Resolve ClientPlayer
            resolve(true)
        })
    }

    /**
     * The stringified cookie to make requests with
     * @type {String}
     * @private
     */
    get _cookieString() {
        let encodedCookie = ''
        for(let [key, value] of this._cookie) {
            // Stringify and encodeURIComponent for all values
            if(value instanceof Object) value = encodeURIComponent(JSON.stringify(value))
            encodedCookie += `${key}=${value}; `
        }
        
        // Trim extra "; "
        encodedCookie = encodedCookie.substring(0, encodedCookie.length - 2)
        return encodedCookie
    }

    /**
     * Logs in with a password
     * @param {String} username The email of the account
     * @param {String} password The password of the account
     * @returns {Promise<Array>} An array containing the login session object, the login session expiry, and the numeric player ID
     * @private
     */
    _loginWithPassword(username, password) {
        return new Promise(async (resolve, reject) => {
            // Return values
            let loginSession, loginSessionExpiry, userID

            const data = JSON.stringify({
                "Login": username,
                "Password": password,
                "DistributionChannel": "d861e38f-05ea-4063-8776-a7e2b6d885a4"
            });
              
            const config = {
                method: 'post',
                url: `https://api.formula1.com/v2/account/subscriber/authenticate/by-password`,
                headers: generateHeaders(),
                data
            };
            
            const authenticationData = await axios(config)
            .then(res => res.data)
            .catch(reject)

            loginSession = {
                data: {
                    subscriptionToken: authenticationData.data.subscriptionToken
                }
            }
            
            // Assign relevant data to client
            try {
                // Attempt to extract expiry date from token
                loginSessionExpiry = new Date(Date.parse(JSON.parse(this._decodeJWT(authenticationData.SessionId)[1])?.ed))
            } catch(e) {
                // Fallback to 4 days after current time
                const DAY_LENGTH = 24 * 60 * 60 * 1000
                loginSessionExpiry = new Date(Date.now() + 4 * DAY_LENGTH)
            }
            userID = authenticationData?.Subscriber?.Id

            // TODO: Create new ClientPlayer using userID

            resolve([loginSession, loginSessionExpiry, userID])
        })
    }

    /**
     * Creates a PlayOn session for authenticated requests
     * @param {Object} loginSession The login session returned from the authentication by-password endpoint
     * @returns {Promise<String>} The PlayOn session cookie
     * @private
     */
    _getPlayOnSession(loginSession) {
        return new Promise(async (resolve, reject) => {
            const data = JSON.stringify({
                "user":{"date_of_birth":null,"email":null,"first_name":null,"last_name":null,"password":null}
            });
              
            const config = {
                method: 'post',
                url: `${BASE_URL}/sessions`,
                headers: generateHeaders(),
                data
            };

            // Getting a new session requires F1 Cookie Data
            config.headers['X-F1-COOKIE-DATA'] = Buffer.from(JSON.stringify(loginSession)).toString('base64')
            config.headers['Cookie'] = this._cookieString
            
            // Send request to server
            let session = await axios(config).catch(reject);
            if(!session.data.success) {
                reject(new Error('Fetching the session data was unsuccessful. ' + JSON.stringify(session.data)))
                return false
            }
            let sessionCookie = session.headers['set-cookie'][0]

            // Extract cookie from response
            sessionCookie = sessionCookie.split(';')[0].split('=')[1]
            resolve(sessionCookie)
        })
    }

    /**
     * Fetches the initial data
     * @returns {Promise<Client>}
     */
    init() {
        return new Promise((resolve, reject) => {
            // GET base url
            this._request({
                url: AUTHENTICATED.STANDARD,
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
                            this.drivers.set(player.id, new Driver(player, this))
                            break

                        case(CONSTANTS.POSITION_CONSTRUCTOR):
                            this.constructors.set(player.id, new Constructor(player, this))
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

    /**
     * Fetch the client user and add it to the cache
     * @param {Boolean} forceUpdate Whether to ignore the cache and update the list directly 
     * @returns 
     */
    fetchClientUser(forceUpdate) {
        return new Promise((resolve, reject) => {
            // Check cache
            if(!forceUpdate && this.user) {
                return this.user
            }

            this._request({
                url: `${AUTHENTICATED.USERS}?current=true`,
                authenticated: true
            }).then(data => {
                this.user = new ClientUser(data.user)
                this.users.set(this.user.id, this.user)

                this.user.init()
            })
        })
    }
}

module.exports = Client