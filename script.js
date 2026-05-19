import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
getAuth, 
signInWithEmailAndPassword,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
getFirestore,
doc,
getDoc,
updateDoc,
setDoc
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

// LOGIN
await signInWithEmailAndPassword(auth,email,password);

// CODE CHECK
const ref = doc(db,"codes",code);
const snap = await getDoc(ref);

if(!snap.exists()){
document.getElementById("msg").innerText = "Invalid Code";
return;
}

let data = snap.data();

let today = new Date().toISOString().split("T")[0];

if(data.used){
document.getElementById("msg").innerText = "Code Already Used";
return;
}

if(data.expiry < today){
document.getElementById("msg").innerText = "Code Expired";
return;
}

// MARK CODE USED
await updateDoc(ref,{ used:true });

// 🔥 ANALYTICS SYSTEM (NEW)
const user = auth.currentUser;

const userRef = doc(db,"users",user.uid);
const userSnap = await getDoc(userRef);

if(userSnap.exists()){
await updateDoc(userRef,{
loginCount: (userSnap.data().loginCount || 0) + 1,
lastLogin: new Date().toISOString(),
email: user.email
});
}else{
await setDoc(userRef,{
loginCount: 1,
lastLogin: new Date().toISOString(),
email: user.email
});
}

localStorage.setItem("login","true");

window.location.href="dashboard.html";

}catch(e){
document.getElementById("msg").innerText = "Login Failed";
}

}