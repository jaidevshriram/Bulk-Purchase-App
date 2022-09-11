const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    requiredQuantity: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    status: {
        type: Number,
        default: 0,
    },
    rating: {
        type: Number,
        default: 5,
    },
    review:{
        type: [],
    },

});

module.exports = mongoose.model('Product', ProductSchema);