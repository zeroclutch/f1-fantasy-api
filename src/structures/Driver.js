/**
 * A driver competing in the driver's championship
 * @class
 */
class Driver {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * The client that this object was instantiated from.
         * @type {Client}
         */
         this.client = client

         /**
         * The constructor that this driver participates for.
         * @type {Constructor}
         */
        this.constructor
    }
}

module.exports = Driver