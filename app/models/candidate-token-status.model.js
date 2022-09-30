'use strict';

var candidateTokenStatusModel = require('../database').models.candidateTokenStatus;

var create =async (data) => {
	var newUser = new candidateTokenStatusModel(data);
	return  newUser.save();
};

var findOne =async (data) => {
	return candidateTokenStatusModel.findOne(data);
}
var findOneAndUpdate = async (identity,data) => {
	return candidateTokenStatusModel.findOneAndUpdate(identity,data,{new:true})
}
var removeToken = async(candidateId,token) => {
	let candidateTokenData =  await candidateTokenStatusModel.findOne({candidateId:candidateId})
	if(candidateTokenData){
		let tokenlist = candidateTokenData.tokenList;
		tokenlist.includes(token);
		tokenlist.splice(tokenlist.indexOf(token), 1);
		return await findOneAndUpdate({candidateId:candidateId},{tokenList:tokenlist},{new:true})
	} else {
		return Promise.resolve(null)
	}
}
var createOrUpdate = async(identity,token) => {
	let newData = {tokenList:[token],candidateId:identity.candidateId}
	let candidateTokenData =  await candidateTokenStatusModel.findOne(identity)
	if(candidateTokenData){
		let tokenlist = candidateTokenData.tokenList;
		tokenlist.push(token)
		return await findOneAndUpdate(identity,{tokenList:tokenlist},{new:true})
	} else {
		return await create(newData);
	}
}

module.exports = { 
	create, 
	findOne,
    createOrUpdate,
	removeToken,
	findOneAndUpdate,
};
