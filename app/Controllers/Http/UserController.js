'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {import('@adonisjs/lucid/src/Database/')} */
const Database = use('Database')
const User = use('App/Models/User')

class UserController {
  /**
   * Creates and store a new user
   *
   * @param {Object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const data = request.only(['username', 'email', 'password'])
    const adresses = request.input('adresses', [])

    const trx = await Database.beginTransaction()
    try {
      const user = User.create(data, trx)
      await user.adresses().createMany(adresses, trx)

      await trx.commit()
      return response.send({ ...user })
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}

module.exports = UserController
