/**
 * A circuit for a Grand Prix weekend
 * @class
 */
class Circuit {
    constructor(props, client) {
        Object.assign(this, props)

        /**
         * @property {Client} client The client that this object was instantiated from.
         */
        this.client = client

        /**
         * @property {GrandPrix} grandPrix The Grand Prix weekend for this circuit.
         */
         this.grandPrix = this.client.grandsPrix.get(this.short_name)
    }
}

module.exports = Circuit