firebase.auth().onAuthStateChanged((user)=>{
    if(!user){
        location.replace("index.html")
    }else{
        document.getElementById("user").innerHTML = "Hello, "+user.email
    }
})



function logout(){
    firebase.auth().signOut()
}


function upload(){
    const user = firebase.auth().currentUser;
    console.log(user)
    var image=document.getElementById('image').files[0];
    var post=document.getElementById('post').value;
    var imageName=image.name;
    var storageRef=firebase.storage().ref('images/'+imageName);
    var uploadTask=storageRef.put(image);
    uploadTask.on('state_changed',function(snapshot){
         var progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
         console.log("upload is "+progress+" done");
    },function(error){
      //handle error here
      console.log(error.message);
    },function(){
        //handle successfull upload here..
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
           firebase.database().ref('blogs/').push().set({
                 text:post,
                 imageURL:downloadURL,
                 user:user.uid
           },function(error){
               if(error){
                   alert("Error while uploading");
               }else{
                   alert("Successfully uploaded");
                   //now reset your form
                   document.getElementById('post-form').reset();
                   getdata();
               }
           });
        });
    });

}

window.onload=function(){
    this.getdata();
}


function getdata(){
    document.getElementById("toogle-form").style.display="initial"
    firebase.database().ref('blogs/').once('value').then(function(snapshot){
      var posts_div=document.getElementById('posts');
      posts.innerHTML="";
      var data=snapshot.val();
      console.log(snapshot);
      for(let[key,value] of Object.entries(data)){
        posts_div.innerHTML="<div class='col-sm-4 mt-2 mb-1'>"+
        "<div class='card'>"+
        "<img src='"+value.imageURL+"' style='display: block;margin-left: auto;margin-right: auto;height:250px;width:100%'>"+
        "<div class='card-body'><p class='card-text'>"+value.text+"</p>"+
        "</div></div></div>"+posts_div.innerHTML;
      }
    
    });
}

function delete_post(key){
    firebase.database().ref('blogs/'+key).remove();
    getdata();

}




function mydata(){
    document.getElementById("toogle-form").style.display="none"
    var userid = firebase.auth().currentUser;
    var uid = userid.uid; 
      firebase.database().ref('blogs/').orderByChild('user').equalTo(uid).on("value",function(snapshot){
        var posts_div = document.getElementById('posts');

        posts_div.innerHTML="<center><h2 style='font-size: 50px';>My Blogs</h2></center>"

        var myData = snapshot.val();

        for(let[key,value] of Object.entries(myData)){
            posts_div.innerHTML = posts_div.innerHTML+"<div class='col-sm-4 mt-2 mb-1'>"+
            "<div class = 'card'>" +
            "<img src= '"+value.imageURL+"' style='display: block;margin-left: auto;margin-right: auto;height:250px;width:100%'>" +
            "<div class='card-body'><p class='card-text'>" + value.text + "</p>" +
            "<button class='btn btn-danger' id= '"+key+"' style='font-weight:2px;border: 2px solid black;' onclick = 'delete_post(this.id)'>Delete</button>"+
            "</div></div></div></div>";
        }
   
    });
   
}