const BASE_URL = "http://localhost:8080";
$('#search').keyup(()=>{
    let searchVal = $('#search').val()
    if(searchVal.length>2 && searchVal.length<35) {
        let url = BASE_URL+'/get-user/'+searchVal;
        $.ajax(url,{
            success(data){
              console.log(data);
              
              if(data.length){
                
               data.forEach(user => {
                   let _user = `<div class="user">
                   <div class="user-avatar">
                           <img src="${user.picture}" alt="">
                   </div>
                    <div class="user-body">
                            <span class="float-left">${user.name || user.username || user.email}</span>
                            <a onclick="sendInvitationTo(\'${user.userId}\')" class="float-right text-info invite">Send Invitation <i class="fa fa-paper-plane"></i></a>
                    </div>
                </div>`;
                $('.search-modal-body').html(_user)
               });
              } else {
                let _user = `<div class="user">
               <h2>User Not Found</h2>
            </div>`;
             $('.search-modal-body').html(_user)
              }
            },
            error(err){
            //   hasError(userName,userspan,'Network Problem')
              console.log('err',err);

            }
          })
    }
})
$("#search").focusin(function(){
	$("#Modal").show();
});

$("#close").click(function() {
   $('#Modal').hide();
});
function sendInvitationTo(userId){
    console.log(userId)
    let url = BASE_URL+'/send-invitation/'+userId;
    $.ajax(url,{
        success(data){
          console.log(data);
          
          if(data.length){
            
          } else {
            
          }
        },
        error(err){
        //   hasError(userName,userspan,'Network Problem')
          console.log('err',err);

        }
      })
}


