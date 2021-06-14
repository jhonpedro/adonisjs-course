'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Api')} Auth */

class SessionController {
  /**
   * Register a new session for the user
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {Auth} ctx.auth
   */
  async store ({ request, response, auth }) {
    const { email, password } = request.only(['email', 'password'])

    const token = await auth.attempt(email, password)

    return token
  }
}

module.exports = SessionController
