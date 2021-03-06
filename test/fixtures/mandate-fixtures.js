'use strict'

const Payer = require('../../common/classes/Payer.class')
const Mandate = require('../../common/classes/Mandate.class')
const GatewayAccount = require('../../common/classes/GatewayAccount.class')
const Service = require('../../common/classes/Service.class')

const randomExternalId = () => Math.random().toString(36).substring(7)
const randomNumber = () => Math.round(Math.random() * 10000) + 1
const randomUrl = () => 'https://' + randomExternalId() + '.com'

module.exports = {
  validTokenExchangeResponse: (opts = {}) => {
    const data = {
      external_id: opts.external_id || randomExternalId(),
      mandate_reference: opts.mandate_reference || 'buy Silvia a coffee',
      type: opts.type || 'CHARGE',
      state: opts.state || randomNumber(),
      return_url: opts.return_url || randomUrl(),
      gateway_account_external_id: opts.gateway_account_external_id || randomExternalId(),
      gateway_account_id: opts.gateway_account_id || randomNumber()
    }
    return {
      getPlain: () => {
        return data
      }
    }
  },
  validGatewayAccountResponse: (opts = {}) => {
    const data = {
      gatewayAccountId: opts.gatewayAccountId || randomNumber(),
      gatewayAccountExternalId: opts.gatewayAccountExternalId || randomExternalId(),
      paymentMethod: opts.paymentMethod || 'DIRECT_DEBIT',
      paymentProvider: opts.paymentProvider || 'SANDBOX',
      type: opts.type || 'TEST'
    }
    return {
      getPlain: () => {
        return data
      }
    }
  },
  validMandateResponse: (opts = {}) => {
    const data = {
      external_id: opts.external_id || randomExternalId(),
      return_url: opts.return_url || randomUrl(),
      gateway_account_id: 23 || opts.gateway_account_id,
      gateway_account_external_id: opts.gateway_account_external_id || randomExternalId(),
      mandate_reference: opts.mandate_reference || 'buy Silvia a beer',
      state: opts.state || 'started',
      internal_state: opts.internal_state || 'AWAITING_DIRECT_DEBIT_DETAILS',
      payer: opts.payer || null
    }
    return {
      getPlain: () => {
        return data
      },
      getObject: () => {
        return new Mandate(data)
      }
    }
  },
  validCreatePayerResponse: (opts = {}) => {
    const data = {
      payer_external_id: opts.payer_external_id || randomExternalId()
    }
    return {
      getPlain: () => {
        return data
      }
    }
  },

  validPayer: (opts = {}) => {
    const data = {
      payer_external_id: opts.payer_external_id || randomExternalId(),
      account_holder_name: opts.account_holder_name || 'mr. payment',
      email: opts.email || 'user@example.test',
      account_number: opts.account_number || '12345678',
      sort_code: opts.sort_code || '123456',
      requires_authorisation: opts.requires_authorisation || 'false'
    }
    return new Payer(data)
  },
  validGatewayAccount: (opts = {}) => {
    const data = {
      gateway_account_id: opts.gateway_account_id || randomExternalId(),
      gateway_account_external_id: opts.gateway_account_external_id || randomExternalId(),
      payment_method: opts.payment_method || 'DIRECT_DEBIT',
      service_name: opts.service_name || 'GOV.UK Direct Cake service',
      payment_provider: opts.payment_provider || 'SANDBOX',
      description: opts.description || 'Gateway account description',
      type: opts.type || 'TEST',
      analytics_id: opts.analytics_id || randomExternalId()
    }

    return new GatewayAccount(data)
  },
  validService: (opts = {}) => {
    const data = {
      external_id: opts.external_id || randomExternalId(),
      service_name: {
        en: opts.name || 'GOV.UK Direct Cake service'
      },
      gateway_account_ids: opts.gateway_account_ids || [randomExternalId()],
      merchant_details: opts.merchant_details || {
        name: 'Silvia needs coffee',
        address_line1: 'Anywhere',
        address_line2: 'Anyhow',
        address_city: 'London',
        address_postcode: 'AW1H 9UX',
        address_country: 'GB',
        phone_number: '28398203',
        email: 'bla@bla.test'
      }
    }

    return new Service(data)
  }
}
