/**
 * An F1 Fantasy player
 * @class
 */
class Player {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * @property {Client} client The client that this object was instantiated from.
         */
         this.client = client
    }
}

module.exports = Player