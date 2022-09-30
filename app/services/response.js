
/**
 * Custom responce 
 * 
 */
module.exports = (data,message="SUCCESS", status=true, statusCode=200, error=null)=>{
  return {
      status, statusCode, message, data, error 
  }
}