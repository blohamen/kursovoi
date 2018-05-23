const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
    },
    solutions: {
        type: Array,
    }
}) 
module.exports = mongoose.model('problems', schema);