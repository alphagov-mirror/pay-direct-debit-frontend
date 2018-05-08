'use strict'

// NPM dependencies
const _ = require('lodash')

// Local dependencies
const {getSessionVariable} = require('../../common/config/cookies')

module.exports = (req, res) => {
  const paymentRequest = res.locals.paymentRequest
  const session = getSessionVariable(req, paymentRequest.externalId)
  const params = {
    paymentRequestExternalId: paymentRequest.externalId,
    description: paymentRequest.description,
    amount: paymentRequest.amount,
    returnUrl: `/change-payment-method/${paymentRequest.externalId}`,
    paymentAction: 'setup'
  }
  const formValues = session.formValues

  if (!_.isEmpty(formValues)) {
    // set values to current view
    params.formValues = formValues
    params.validationErrors = session.validationErrors
    // clear form values from session
    delete session.formValues
    delete session.validationErrors
  }
  res.render('app/setup/get', params)
}
