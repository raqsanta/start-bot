const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({

    id: {
        type: Number
    },

    isAdmin: {
        type: Boolean
    },

    course: {
        type: String
    }

})

module.exports = mongoose.model('users', UserSchema)