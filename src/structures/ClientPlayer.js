const Player = require("./Player")

/**
 * A driver competing in the driver's championship
 * @class
 */
 class ClientPlayer extends Player {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * @property {Client} client The client that this object was instantiated from.
         */
         this.client = client

         /**
         * The constructor that this driver participates for.
         * @type {Constructor}
         */
        this.constructor
    }
}

module.exports = ClientPlayer