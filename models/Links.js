const mongoose = require('mongoose')

const LinkSchema = mongoose.Schema({

    title: {
        type: String,
        unique: true
    },
    
    course: {
        type: String
    },

    link: {
        type: String
    },

    price: {
        type: Number
    }

})

module.exports = mongoose.model('link', LinkSchema)