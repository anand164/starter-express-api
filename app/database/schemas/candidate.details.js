'use strict';

var Mongoose 	= require('mongoose');
const uuidv4 = require('uuid/v4');

var CandidateDetailsSchema = new Mongoose.Schema({
    firstName:{ type: String, default: null },
    lastName:{ type: String, default: null },
    lastName:{ type: String, default: null },
    lastName:{ type: String, default: null },
    hobbies:{ type: String, default: null },
    gender:{ type: String, default: null },
    location:{ type: String, default: null },
    preferredLocation:{ type: Array, default: [] },
    dateOfBirth:{ type: String, default: null },
    designation:{ type: String, default: null },
    title:{ type: String, default: null },
    telecommute:{ type: Boolean, default: null },
    relocate:{ type: Boolean, default: null },
    travel:{ type: String, default: null },
    workAuthorization:{ type: String, default: null },
    summary:{ type: String, default: null },
    technicalSkills:{ type: Array, default: [] },
    otherSkills:{ type: Array, default: [] },
    experience:{ type: Array, default: [] },
    education:{ type: Array, default: [] },
    socialLinkes:{ type: Array, default: [] },
    references:{ type: Array, default: [] },
    candidateId: {type:String,default:uuidv4()},
    createdAt:{type:String, default:new Date().toISOString()},
    modifiedAt:{type:String, default:new Date().toISOString()},
});


var candidateDetailsModel = Mongoose.model('candidate_details', CandidateDetailsSchema);

module.exports = candidateDetailsModel;