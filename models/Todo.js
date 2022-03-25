const mongoose = require('mongoose')

const TodoSchema = mongoose.Schema({

    todos: {
        type: String
    }

})

module.exports = mongoose.model('todo', TodoSchema)