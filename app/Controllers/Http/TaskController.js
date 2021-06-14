'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Task = use('App/Models/Task')

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index ({ params, request, response }) {
    const tasks = await Task.query()
      .where('project_id', params.projects_id)
      .with('user')
      .fetch()

    return tasks
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store ({ params, request }) {
    const data = request.only(['user_id', 'title', 'description', 'due_date', 'file_id'])

    const task = await Task.create({ ...data, project_id: params.projects_id })

    await task.load('user')
    await task.load('project')

    return task
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async show ({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id)

      await task.load('user')
      await task.load('project')

      return task
    } catch (error) {
      return response.status(403).send({ error: 'task was not found' })
    }
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const data = request.only(['title', 'description', 'due_date'])

    try {
      const task = await Task.findOrFail(params.id)

      task.merge(data)

      await task.save()
    } catch (error) {
      return response.status(403).send({ error: 'task was not updated due to an error' })
    }
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy ({ params, response }) {
    const { id } = params

    try {
      const task = await Task.findOrFail(id)

      await task.delete()
    } catch (error) {
      return response.status(403).send({ error: 'maybe this task does not exists' })
    }
  }
}

module.exports = TaskController
