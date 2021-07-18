const mongoose = require('mongoose');

let index = 0

// creating a schema
const { Schema } = mongoose;
const url_schema = new Schema({
    name : String,
    id : Number
})

// creating a Model
let App = mongoose.model('App', url_schema)

module.exports.App = App