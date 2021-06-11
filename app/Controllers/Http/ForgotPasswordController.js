'use strict'
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
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
}

module.exports = ForgotPasswordController
