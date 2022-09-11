const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    isVendor: {
        type: Boolean,
        required: true
    },
    productList: {
        type: [],
        default: [],
    },
    rating: {
        type: Number,
        default: 5
    },
    reviews: {
        type: [],
        default: []
    }
});

module.exports = mongoose.model('User', UserSchema);