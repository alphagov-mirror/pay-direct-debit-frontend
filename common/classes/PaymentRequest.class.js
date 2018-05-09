'use strict'
const Payer = require('./Payer.class')

class PaymentRequest {
  constructor (opts) {
    this.externalId = opts.external_id
    this.returnUrl = opts.return_url
    this.gatewayAccountId = opts.gateway_account_id
    this.gatewayAccountExternalId = opts.gateway_account_external_id
    this.amount = penceToPounds(opts.amount)
    this.description = opts.description
    this.payer = opts.payer ? new Payer(opts.payer) : null
    this.type = opts.type
    this.state = opts.state
  }
}

const penceToPounds = (pence) => {
  return (parseInt(pence) / 100).toFixed(2)
}

module.exports = PaymentRequest
