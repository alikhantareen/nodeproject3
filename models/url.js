const mongoose = require('mongoose');

// creating a schema
const { Schema } = mongoose;
const url_schema = new Schema({
    original_url : String,
    short_url : Number
})

// creating a Model
let Url = mongoose.model('Url', url_schema)

module.exports.Url = Url