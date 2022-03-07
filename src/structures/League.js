/**
 * A competitive league that players can join
 * @class
 */
 class League {
    constructor(props, client) {
        Object.assign(this, props)
        
        /**
         * The client that this object was instantiated from.
         * @type {Client}
         */
         this.client = client
    }

    
}

module.exports = League