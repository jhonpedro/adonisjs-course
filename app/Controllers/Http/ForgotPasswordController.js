'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  /**
   * Creates a new token and sends a email with it
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        { link: `${request.input('redirect_url')}?token=${user.token}` },
        (message) => {
          message.to(user.email).from('emailDeTest@gmail.com').subject('Password reset')
        }
      )
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({ error: 'no user found with this email' })
    }
  }

  /**
   * Updates the password validating the token in the database
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ request, response }) {
    try {
      const { token, password } = request.only(['token', 'password'])

      const user = await User.findByOrFail('token', token)

      const tokenCreatedAtMili = new Date(user.token_created_at).getTime()
      const currentMili = new Date().getTime()

      // changing the first number can change the duration in days
      const tokenMiliValidity = 1 * 24 * 60 * 60 * 1000
      const isTokenValid = currentMili - tokenCreatedAtMili < tokenMiliValidity

      if (!isTokenValid) {
        return response.status(404).send({ error: 'token expired' })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      user.save()

      return response.status(200)
    } catch (error) {
      return response.status(error.status).send({ error: 'an error occurred when reseting the password' })
    }
  }
}

module.exports = ForgotPasswordController
