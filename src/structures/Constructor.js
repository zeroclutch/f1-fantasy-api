/**
 * A constructor competing in the constructor's championship
 * @class
 */
class Constructor {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * @property {Client} client The client that this object was instantiated from.
         */
         this.client = client
    }
}

module.exports = Constructor