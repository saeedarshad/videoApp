const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isGold : {
        type : Boolean,
        default : false
    },
    phone : {
        type: String,
        required: true,
        minlength :5,
        maxlength : 10
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().required(),
        phone: Joi.string().min(5).max(10).required(),
        isGold : Joi.boolean()
    };

    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
exports.customerSchema = customerSchema;