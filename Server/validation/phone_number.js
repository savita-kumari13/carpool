const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validatePhoneNumberInput(data){
    let errors = {};
    data.phone_number = !isEmpty(data.phone_number) ? data.phone_number : '';

    if(Validator.isEmpty(data.phone_number)) {
        errors.phone_number = 'Phone number is required';
    }

    if(!Validator.isLength(data.phone_number, { min: 6, max: 10})){
        errors.phone_number = 'Please enter valid phone number';
    }

    return {
        errors: errors,
        status: isEmpty(errors)
    }
}