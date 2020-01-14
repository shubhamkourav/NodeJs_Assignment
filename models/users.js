var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,

});

userSchema.methods.generateHash = function (password) {
    //console.log("fDFSsfsd")
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};
module.exports = mongoose.model('users', userSchema);
module.exports.Schema = userSchema;