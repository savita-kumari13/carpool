const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data){
    let errors = {};
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirm_password = !isEmpty(data.confirm_password) ? data.confirm_password : '';

    // if(Validator.isLength(data.name, { min: 2, max: 30})){
    //     errors.name = 'Name must be between 2 to 30 chars';
    // }
    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }

    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must have 6 chars';
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    if(!Validator.isLength(data.confirm_password, {min: 6, max: 30})) {
        errors.confirm_password = 'Password must have 6 chars';
    }

    if(!Validator.equals(data.password, data.confirm_password)) {
        errors.confirm_password = 'Password and Confirm Password must match';
    }

    if(Validator.isEmpty(data.confirm_password)) {
        errors.confirm_password = 'Confirm your password';
    }

    // console.log('errors in signing up user : ', errors)
    return {
        errors: errors,
        status: isEmpty(errors)
    }
}