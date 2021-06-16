'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserAdressSchema extends Schema {
  up () {
    this.create('user_adresses', (table) => {
      table.increments()
      table
        .integer('user_id')
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
        .notNullable()
      table.string('street')
      table.string('number')
      table.timestamps()
    })
  }

  down () {
    this.drop('user_adresses')
  }
}

module.exports = UserAdressSchema
