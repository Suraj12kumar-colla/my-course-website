import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCIbu3b-El4ZVkO1Ew1CsLWk3Odx6lLAQg",
  authDomain: "mycoursewebsite-a1972.firebaseapp.com",
  projectId: "mycoursewebsite-a1972",
  storageBucket: "mycoursewebsite-a1972.firebasestorage.app",
  messagingSenderId: "988959077553",
  appId: "1:988959077553:web:85222201ab4a6ee9579e90",
  measurementId: "G-W4L4RBJ6ZJ"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

window.login = function(){

let email =
document.getElementById('email').value;

let password =
document.getElementById('password').value;

signInWithEmailAndPassword(auth,email,password)

.then(()=>{

window.location.href='dashboard.html';

})

.catch((error)=>{

document.getElementById('msg').innerHTML =
error.message;

});

}