'use strict';

var Mongoose 	= require('mongoose');
const uuidv4 = require('uuid/v4');

var CandidateTokenStatusSchema = new Mongoose.Schema({
    tokenId: {type:String,default:uuidv4()},
    candidateId: {type:String,default:uuidv4()},
    tokenList: {type: Array, default: [] },
    createdAt:{type:String, default:new Date().toISOString()},
    modifiedAt:{type:String, default:new Date().toISOString()},
});


// Create a candidateTokenStatusModel model
var candidateTokenStatusModel = Mongoose.model('candidate_token_status', CandidateTokenStatusSchema);

module.exports = candidateTokenStatusModel;