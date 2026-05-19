import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
getAuth, 
signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

window.login = async function(){

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;
let code = document.getElementById("code").value;

try{

// 1. LOGIN USER
await signInWithEmailAndPassword(auth,email,password);

// 2. CHECK CODE
const ref = doc(db,"codes",code);
const snap = await getDoc(ref);

if(!snap.exists()){
document.getElementById("msg").innerText = "Invalid Code";
return;
}

let data = snap.data();

let today = new Date().toISOString().split("T")[0];

// 3. EXPIRY CHECK
if(data.expiry < today){
document.getElementById("msg").innerText = "Code Expired";
return;
}

// 4. USED CHECK
if(data.used){
document.getElementById("msg").innerText = "Code Already Used";
return;
}

// 5. MARK CODE AS USED
await updateDoc(ref,{
used:true
});

// 6. GET USER DATA (ADMIN CHECK)
const userRef = doc(db,"users",auth.currentUser.uid);
const userSnap = await getDoc(userRef);

if(userSnap.exists() && userSnap.data().admin === true){

// 👑 ADMIN
window.location.href = "admin.html";

}else{

// 👤 NORMAL USER
window.location.href = "dashboard.html";

}

}catch(e){
document.getElementById("msg").innerText = "Login Failed";
}

}