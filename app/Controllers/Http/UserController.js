'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */

const User = use('App/Models/User')

class UserController {
  /**
   * Creates and store a new user
   *
   * @param {Object} ctx
   * @param {Request} ctx.request
   */
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }
}

module.exports = UserController
