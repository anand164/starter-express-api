'use strict';

var candidateDetailsModel = require('../database').models.candidateDetails;

var create =async (data) => {
	var newUser = new candidateDetailsModel(data);
	return  newUser.save();
};

var findOne =async (data) => {
	return candidateDetailsModel.findOne(data);
}
var findOneAndUpdate = async (identity,data) => {
	return candidateDetailsModel.findOneAndUpdate(identity,data,{new:true})
}
var createOrUpdate = async(identity,data) => {
	let candidateTokenData =  await candidateDetailsModel.findOne(identity)
	if(candidateTokenData){
		return await findOneAndUpdate(identity,data,{new:true})
	} else {
		return await create(data);
	}
}

module.exports = { 
	findOne,
    createOrUpdate,
	findOneAndUpdate,
};
