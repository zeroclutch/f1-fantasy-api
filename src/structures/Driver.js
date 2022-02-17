/**
 * A driver competing in the driver's championship
 * @class
 */
export class Driver {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * @property {Client} client The client that this object was instantiated from.
         */
         this.client = client
    }
}