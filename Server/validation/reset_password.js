const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateResetPasswordInput(data){
    let errors = {};
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirm_password = !isEmpty(data.confirm_password) ? data.confirm_password : '';

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Please enter your password';
    }
    
    if(Validator.isEmpty(data.confirm_password)) {
        errors.password = 'Please enter your password';
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must have 6 chars';
    }
    
    if(!Validator.equals(data.password, data.confirm_password)) {
        errors.confirm_password = "Passwords don't match";
    }

    return {
        errors: errors,
        status: isEmpty(errors)
    }
}