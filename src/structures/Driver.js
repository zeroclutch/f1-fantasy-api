/**
 * A driver competing in the driver's championship
 * @class
 */
class Driver {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * @property {Client} client The client that this object was instantiated from.
         */
         this.client = client

         /**
         * The constructor that this driver participates for
         * @type {Constructor}
         */
        this.team
    }
}

module.exports = Driver