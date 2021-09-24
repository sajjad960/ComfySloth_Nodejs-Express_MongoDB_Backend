const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide a valid email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE! 
            validator: function(el) {
                return el === this.password
            }
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    }
})


userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;

    next()
})

userSchema.methods.currectPassword = async function (
    candidatePassword, userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


const Users = mongoose.model('Users', userSchema)

// //test User
// const testUser = new Users({
//   name: "Sajjad",
//   email: "sajjadhossain55@gmail.com",
//   role: "admin",
//   password: "sajjad2255",
//   passwordConfirm: "sajjad2255",
// });

// testUser.save().then((doc) => console.log(doc));

module.exports = Users;