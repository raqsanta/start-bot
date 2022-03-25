const mongoose = require('mongoose')

const TodoSchema = mongoose.Schema({

    title: {
        type: String
    },

    date: {
        day: {
            type: Number
        },
        month: {
            type: Number
        },
        year: {
            type: Number
        }
    }

})

module.exports = mongoose.model('todo', TodoSchema)