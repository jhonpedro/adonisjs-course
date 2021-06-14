'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/')} Response */

const File = use('App/Models/File')
const Helper = use('Helpers')

/**
 * Resourceful controller for interacting with files
 */
class FileController {
  /**
   *
   * @param {Object} ctx
   * @param {Object} ctx.params
   * @param {Response} ctx.response
   */
  async get ({ params, response }) {
    const { id } = params
    console.log(id)

    try {
      const file = await File.findOrFail(id)

      return response.download(Helper.tmpPath(`uploads/${file.file}`))
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({ error: 'an error occured when getting the file' })
    }
  }

  /**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      if (!request.file('file')) {
        return response.status(403).send({ error: 'any file provided' })
      }

      const upload = request.file('file', { size: '2mb' })

      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Helper.tmpPath('uploads'), { name: fileName })

      if (!upload.moved()) {
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        mimetype: upload.subtype

      })

      return file
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({ error: 'an error occured when uploading' })
    }
  }
}

module.exports = FileController
