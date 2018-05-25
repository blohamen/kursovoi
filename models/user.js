const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String
    },
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rule:   {
        type: String
    },
    rating: {
        type : Number,
    },
    problemRatings:{
        type: Array,
    }
}) 
module.exports = mongoose.model('user', schema);