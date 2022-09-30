'use strict';

var Mongoose 	= require('mongoose');
var bcrypt      = require('bcryptjs');
const uuidv4 = require('uuid/v4');

const SALT_WORK_FACTOR = 10;
const DEFAULT_USER_PICTURE = "/img/user.jpg";

/**
 * Every user has a username, password, socialId, and a picture.
 * If the user registered via username and password(i.e. LocalStrategy), 
 *      then socialId should be null.
 * If the user registered via social authenticaton, 
 *      then password should be null, and socialId should be assigned to a value.
 * 2. Hash user's password
 *
 */
var CandidateSchema = new Mongoose.Schema({
    candidateId: {type:String,default:uuidv4()},
    candidatename: { type: String, default: null },
    password: { type: String, default: null },
    socialId: { type: String, default: null },
    picture:  { type: String, default:  DEFAULT_USER_PICTURE},
    name: {type: String},
    email: {type: String, required: true },

    recent: {type: Array, default: [] },

    isDeleted:{type:Boolean,default:false},
    createdAt:{type:String, default:new Date().toISOString()},
    modifiedAt:{type:String, default:new Date().toISOString()},
    emailToken:{type: String,trim:true,default:uuidv4()},
    accType:{type:String, default:"user"},
    isEmailVerified:{type:Boolean,default:false},
});

/**
 * Before save a user document, Make sure:
 * 1. User's picture is assigned, if not, assign it to default one.
 * 2. Hash user's password
 *
 */
CandidateSchema.pre('save', function(next) {
    var user = this;

    // ensure user picture is set
    if(!user.picture){
        user.picture = DEFAULT_USER_PICTURE;
    }

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

/**
 * Create an Instance method to validate user's password
 * This method will be used to compare the given password with the passwoed stored in the database
 * 
 */
CandidateSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

// Create a user model
var candidateModel = Mongoose.model('candidate', CandidateSchema);

module.exports = candidateModel;