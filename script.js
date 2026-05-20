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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "XXXX",
  appId: "XXXX"
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

const user = auth.currentUser;

// USER CHECK
const userRef = doc(db,"users",user.uid);

const userSnap = await getDoc(userRef);

// BAN CHECK
if(userSnap.exists()){

let userData = userSnap.data();

if(userData.banned){

alert("Your account is banned");

await signOut(auth);

return;

}

}

// CODE CHECK
const codeRef = doc(db,"codes",code);

const codeSnap = await getDoc(codeRef);

if(!codeSnap.exists()){

document.getElementById("msg").innerText = "Invalid Code";

return;

}

let codeData = codeSnap.data();

let today = new Date().toISOString().split("T")[0];

// EXPIRED
if(codeData.expiry < today){

document.getElementById("msg").innerText = "Code Expired";

return;

}

// USED
if(codeData.used){

document.getElementById("msg").innerText = "Code Already Used";

return;

}

// DEVICE ID
let deviceId = localStorage.getItem("deviceId");

if(!deviceId){

deviceId = Math.random().toString(36).substring(2);

localStorage.setItem("deviceId",deviceId);

}

// SAVE USER DATA
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

videoWatched:0

},{ merge:true });

// MARK CODE USED
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

// AUTO LOGOUT CHECK
window.checkExpiry = async function(){

const user = auth.currentUser;

if(!user) return;

const ref = doc(db,"users",user.uid);

const snap = await getDoc(ref);

if(!snap.exists()) return;

let data = snap.data();

let today = new Date().toISOString().split("T")[0];

if(data.codeExpiry < today){

alert("Access expired");

await signOut(auth);

window.location.href="index.html";

}

}