/**
 * A complete Grand Prix weekend
 * @class
 */
export class GrandPrix {
    constructor(props, client) {
        Object.assign(this, props)
        /**
         * @property {Client} client The client that this object was instantiated from.
         */
        this.client = client

        /**
         * @property {Circuit} circuit The circuit for this Grand Prix weekend.
         */
        this.circuit = this.client.circuits.get(this.short_name)

        if(this.circuit) {
            this.circuit.grandPrix = this
        }
    }
}