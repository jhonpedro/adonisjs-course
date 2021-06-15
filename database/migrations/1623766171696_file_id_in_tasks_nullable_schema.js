'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileIdInTasksNullableSchema extends Schema {
  up () {
    this.table('tasks', (table) => {
      table.integer('file_id').nullable().alter()
    })
  }

  down () {
    this.table('file_id_in_tasks_nullables', (table) => {
      table.integer('file_id').notNullable().alter()
    })
  }
}

module.exports = FileIdInTasksNullableSchema
