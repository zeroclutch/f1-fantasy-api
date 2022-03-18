const User = require("./User")

/**
 * A driver competing in the driver's championship
 * @class
 */
 class ClientUser extends User {
    constructor(props, client) {
        super(props, client)
        Object.assign(this, props)
        
        /**
         * The client that this object was instantiated from.
         * @type {Client}
         */
         this.client = client
    }
}

module.exports = ClientUser