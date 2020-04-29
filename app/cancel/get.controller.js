'use strict'

const { renderErrorView } = require('../../common/response')
const connectorClient = require('../../common/clients/connector-client')

module.exports = (req, res) => {
  const mandate = res.locals.mandate

  const params = {
    returnUrl: mandate.returnUrl
  }
  connectorClient.mandate.cancelMandate(mandate.gatewayAccountExternalId, mandate.externalId, req.correlationId)
    .then(() => {
      return res.render('app/cancel/get', params)
    })
    .catch(err => {
      renderErrorView(req, res, 'No money has been taken from your account, please try again later.', 500, err)
    })
}
