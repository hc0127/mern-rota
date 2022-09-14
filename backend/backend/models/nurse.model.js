const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Nurse = new Schema({
    name: {
        type: String
    },
    rota:{
        type:Array,
    },
    address: {
        type: String
    },
    image: {
        type: String
    },
    cell: {
        type: String
    },
    country: {
        type: String
    },
    experience: {
        type: String
    },
    date: {
        type: Date
    },
    workexp: {
        type: String
    },
    level:{
        type:String
    },
    rate:{
        type:String
    }
});

module.exports = mongoose.model('Nurse', Nurse);