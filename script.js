import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getAuth,
signInWithEmailAndPassword,
signOut
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

await signInWithEmailAndPassword(auth,email,password);

const user = auth.currentUser;

const userRef = doc(db,"users",user.uid);

const userSnap = await getDoc(userRef);

if(userSnap.exists()){

let userData = userSnap.data();

if(userData.banned){

let now = new Date();
let banDate = new Date(userData.banExpiry);

if(now < banDate){
alert("Your account is banned");
await signOut(auth);
return;
}

}

}

const codeRef = doc(db,"codes",code);

const codeSnap = await getDoc(codeRef);

if(!codeSnap.exists()){
document.getElementById("msg").innerText = "Invalid Code";
return;
}

let codeData = codeSnap.data();

let today = new Date().toISOString().split("T")[0];

if(codeData.expiry < today){
document.getElementById("msg").innerText = "Code Expired";
return;
}

if(codeData.used){
document.getElementById("msg").innerText = "Code Already Used";
return;
}

let deviceId = localStorage.getItem("deviceId");

if(!deviceId){

deviceId = Math.random().toString(36).substring(2);

localStorage.setItem("deviceId",deviceId);

}

if(userSnap.exists()){

let oldDevice = userSnap.data().deviceId;

if(oldDevice && oldDevice !== deviceId){

alert("Account already active on another device");

await signOut(auth);

return;

}

}

await setDoc(userRef,{

email:user.email,

loginCount: userSnap.exists()
? (userSnap.data().loginCount || 0) + 1
: 1,

lastLogin:new Date().toISOString(),

deviceId:deviceId,

banned:false,

activeCode:code,

codeExpiry:codeData.expiry,

videoWatched:0,

tamperAttempts:0,

lastActive:new Date().toISOString()

},{ merge:true });

await updateDoc(codeRef,{

used:true,

usedBy:user.email,

usedAt:new Date().toISOString()

});

localStorage.setItem("login","true");

window.location.href="dashboard.html";

}catch(e){

console.log(e);

document.getElementById("msg").innerText = "Login Failed";

}

}

window.checkExpiry = async function(){

const user = auth.currentUser;

if(!user) return;

const ref = doc(db,"users",user.uid);

const snap = await getDoc(ref);

if(!snap.exists()) return;

let data = snap.data();

let today =
new Date().toISOString().split("T")[0];

if(data.codeExpiry < today){

alert("Access expired");

await signOut(auth);

window.location.href="index.html";

}

if(data.banned){

if(data.banExpiry){

let now = new Date();

let banDate = new Date(data.banExpiry);

if(now < banDate){

alert("You are banned");

await signOut(auth);

window.location.href="index.html";

}

}

}

let deviceId =
localStorage.getItem("deviceId");

if(data.deviceId !== deviceId){

alert("Session expired");

await signOut(auth);

window.location.href="index.html";

}

}

setInterval(()=>{
checkExpiry();
},5000);