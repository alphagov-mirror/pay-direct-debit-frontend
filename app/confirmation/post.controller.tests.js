'use strict'

// npm dependencies
const chai = require('chai')
const expect = chai.expect
const supertest = require('supertest')
const cheerio = require('cheerio')
const nock = require('nock')
// Local dependencies
const config = require('../../common/config')
const getApp = require('../../server').getApp
const paymentFixtures = require('../../test/fixtures/payments-fixtures')
const {CookieBuilder} = require('../../test/test_helpers/cookie-helper')
let response, $
let paymentRequestExternalId = 'sdfihsdufh2e'
let paymentRequest = paymentFixtures.validPaymentRequest({
  external_id: paymentRequestExternalId
})
describe('confirmation POST controller', () => {
  const cookieHeader = new CookieBuilder()
    .withPaymentRequest(paymentRequest)
    .build()
  afterEach(() => {
    nock.cleanAll()
  })
  describe('when a payment is successfully confirmed', () => {
    before(done => {
      nock(config.CONNECTOR_URL).post(`/v1/api/accounts/${paymentRequest.gatewayAccountId}/payment-requests/${paymentRequestExternalId}/confirm`).reply(201)
      supertest(getApp())
        .post(`/confirmation/${paymentRequestExternalId}`)
        .set('cookie', cookieHeader)
        .end((err, res) => {
          response = res
          done(err)
        })
    })
    it('should redirect to /setup', () => {
      expect(response.statusCode).to.equal(303)
    })
    it('should redirect back to the service using its return url', () => {
      let url = paymentRequest.returnUrl
      expect(response.header).property('location').to.equal(url)
    })
  })
  describe('when failing to confirm a payment', () => {
    before(done => {
      nock(config.CONNECTOR_URL).get(`/v1/api/accounts/${paymentRequest.gatewayAccountId}/payment-requests/${paymentRequestExternalId}/confirm`).reply(409)
      supertest(getApp())
        .post(`/confirmation/${paymentRequestExternalId}`)
        .set('cookie', cookieHeader)
        .end((err, res) => {
          response = res
          $ = cheerio.load(res.text || '')
          done(err)
        })
    })
    it('should return a 500', () => {
      expect(response.statusCode).to.equal(500)
    })
    it('should render error page', () => {
      expect($('.heading-large').text()).to.equal('Sorry, we’re experiencing technical problems')
      expect($('#errorMsg').text()).to.equal('No money has been taken from your account, please try again later.')
    })
  })
})