'use strict'

class Task {
  get validateAll () {
    return true
  }

  get rules () {
    console.log('\n\n\n\n\nValidate\n\n\n\n\n')
    return {
      title: 'required',
      due_date: 'date'
    }
  }
}

module.exports = Task
