const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateChangePasswordInput(data){
    let errors = {};
    data.current_password = !isEmpty(data.current_password) ? data.current_password : '';
    data.new_password = !isEmpty(data.new_password) ? data.new_password : '';
    data.confirm_new_password = !isEmpty(data.confirm_new_password) ? data.confirm_new_password : '';

    if(Validator.isEmpty(data.current_password)) {
        errors.current_password = 'Please enter your current password';
    }
    
    if(Validator.isEmpty(data.confirm_new_password)) {
        errors.confirm_new_password = 'Please enter a new password';
    }

    if(!Validator.isLength(data.new_password, {min: 6, max: 30})) {
        errors.new_password = 'Password must have 6 chars';
    }
    if(Validator.isEmpty(data.new_password)) {
        errors.new_password = 'Please enter a new password';
    }
    if(!Validator.equals(data.new_password, data.confirm_new_password)) {
        errors.confirm_new_password = "Passwords don't match";
    }

    return {
        errors: errors,
        status: isEmpty(errors)
    }
}