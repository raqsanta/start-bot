const mongoose = require('mongoose')

const LinkSchema = mongoose.Schema({

    title: {
        type: String,
        unique: true
    },

    link: {
        type: String
    },

    price: {
        type: Number
    }

})

module.exports = mongoose.model('link', LinkSchema)