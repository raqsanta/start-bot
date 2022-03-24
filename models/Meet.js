const mongoose = require('mongoose');

const MeetSchema = mongoose.Schema({

    title: {
        type: String
    },

    image: {
        type: String
    },

    description: {
        title: {
            type: String
        },
        text: {
            type: String
        },
        link: {
            type: String
        }
    },


})

module.exports = mongoose.model('meet', MeetSchema )