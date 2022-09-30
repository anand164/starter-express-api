'use strict';

var candidateModel = require('../database').models.candidate;

var create =async (data) => {
	var newUser = new candidateModel(data);
	return  newUser.save();
};

var findOne =async (data) => {
	return candidateModel.findOne(data);
}

var findById =async (id) => {
	return candidateModel.findById(id);
}
var findByIdAndUpdate = async (id,data) => {
	return candidateModel.findByIdAndUpdate(id,data,{new:true})
}
var findOneAndUpdate = async (identity,data) => {
	return candidateModel.findOneAndUpdate(identity,data,{new:true})
}
var searchUser = async (searchData)=>{
	searchData = new RegExp('^'+searchData, "i")	
	return candidateModel.find({$or:[{username:searchData},{email:searchData},{name:searchData}]})
}

/**
 * Find a user, and create one if doesn't exist already.
 * This method is used ONLY to find user accounts registered via Social Authentication.
 *
 */
var findOrCreate = async(data) => {
	let user = await findOne({'socialId': data.id})
		if(user) return user;
		else {
			let userInfo = data._json;
			var userData = {
				username: data.username || data.displayName || data.id,
				socialId: data.id,
				email:userInfo.email,
				picture: userInfo.picture && userInfo.picture.data && userInfo.picture.data.url? userInfo.picture.data.url : null
			};
			// To avoid expired Facebook CDN URLs
			// Request user's profile picture using user id 
			// @see http://stackoverflow.com/a/34593933/6649553
			if(data.provider == "facebook" && userData.picture){
				userData.picture = "http://graph.facebook.com/" + data.id + "/picture?type=large";
			}
			return await create(userData);
		}

}

/**
 * A middleware allows user to get access to pages ONLY if the user is already logged in.
 *
 */
var isAuthenticated = function (req, res, next) {
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/');
	}
}

module.exports = { 
	create, 
	findOne, 
	findById, 
	searchUser,
	findOrCreate, 
	findByIdAndUpdate,
	findOneAndUpdate,
	isAuthenticated 
};
