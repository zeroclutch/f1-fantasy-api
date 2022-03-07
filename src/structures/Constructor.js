/**
 * A constructor competing in the constructor's championship
 * @class
 */
class Constructor {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * The client that this object was instantiated from.
         * @type {Client}
         */
         this.client = client

         /**
         * The drivers for this constructor, keyed by their last name
         * @type {Map<String,Driver>}
         */
        this.drivers = new Map()
    }
}

module.exports = Constructor