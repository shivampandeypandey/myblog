
document.getElementById("loginForm").addEventListener("submit",(event)=>{
    event.preventDefault()
})


document.getElementById("signupForm").addEventListener("submit",(event)=>{
    event.preventDefault()
})

firebase.auth().onAuthStateChanged((user)=>{
    if(user){
        location.replace("blog.html")
    }
})

function login(){
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error)=>{
        document.getElementById("error").innerHTML = error.message
    })
}

function googleSignIn(){
    provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result){
      console.log(result);
      alert("Signed in with google");
      window.location = 'blog.html';
    }).catch(function(err){
      console.log(err);
      alert("Failed");
    });
  }

function signInForm(){
    document.getElementById("log-in").style.display="initial"
    document.getElementById("sign-up").style.display="none";
}

function signUpForm(){
    document.getElementById("log-in").style.display="none"
    document.getElementById("sign-up").style.display="initial";
}

function signUp(){
    const email = document.getElementById("signupemail").value;
    const password = document.getElementById("signuppassword").value;
    const confirmpassword=document.getElementById("signupConfirmpassword").value;
    console.log(email)
    if(password===confirmpassword){
        firebase.auth().createUserWithEmailAndPassword(email, password).then((res)=>{
            const user = firebase.auth().currentUser;
            // console.log(user)
        })
        .catch((error) => {
            document.getElementById("signuperror").innerHTML = error.message
        });
    }else{
        document.getElementById("signuperror").innerHTML = "Both passwords must match!!!"
    }
}

function forgotPass(){
    const email = document.getElementById("email").value;
    firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
        alert("Reset link sent to your email id")
    })
    .catch((error) => {
        document.getElementById("error").innerHTML = error.message
    });
}