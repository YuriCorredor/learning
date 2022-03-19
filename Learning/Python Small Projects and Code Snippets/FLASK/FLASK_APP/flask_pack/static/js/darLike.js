
  function like(post_id, current_user){

    var likes = document.getElementById(post_id).innerHTML;
    var json = {
      current_user: current_user,
      post_id: post_id, 
    };
   
    var like = document.getElementById('like'+post_id);
    var deslike = document.getElementById('deslike'+post_id);
 
    if (like !== null) {
     if (like.classList.contains('like')) {
         action = 'like';
         like.classList.remove('like');
       }
       else {
         action = 'deslike';
         like.classList.add('like');
       }
    }
    else if(deslike != null) {
       if (deslike.classList.contains('deslike')) {
         action = 'deslike';
         deslike.classList.remove('deslike');
       }
       else {
         action = 'like';
         deslike.classList.add('deslike');
       }
    }
 
    if (action) {
      if (action == 'deslike') {
       var newLikes = parseInt(likes) - 1;
       document.getElementById(post_id).innerHTML = newLikes;
      }
      else {
       var newLikes = parseInt(likes) + 1;
       document.getElementById(post_id).innerHTML = newLikes;
      }
      
      fetch(`${window.origin}/post/${post_id}/${action}`, {
       method: "POST",
       credentials: "include",
       body: JSON.stringify(json),
       cache: "no-cache",
       headers: new Headers({
         "content-type": "application/json"
       })
      })
     .then(function (response) {
       if (response.status != 200) {
         console.log(response.status);
         return;
       }
       response.json().then(function (data){
         
       })
      })
      
    }
 
   }