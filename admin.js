import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getFirestore,
doc,
setDoc,
getDocs,
collection,
deleteDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
getAuth,
signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {

apiKey: "AIzaSyCIbu3b-El4ZVkO1Ew1CsLWk3Odx6lLAQg",

authDomain: "mycoursewebsite-a1972.firebaseapp.com",

projectId: "mycoursewebsite-a1972",

storageBucket: "mycoursewebsite-a1972.firebasestorage.app",

messagingSenderId: "988959077553",

appId: "1:988959077553:web:85222201ab4a6ee9579e90"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

// CREATE CODE
window.createCode = async function(){

try{

let code = document.getElementById("code").value;

let expiry = document.getElementById("expiry").value;

if(!expiry){

alert("Select expiry");

return;

}

if(!code){

code = Math.random()
.toString(36)
.substring(2,8)
.toUpperCase();

}

await setDoc(doc(db,"codes",code),{

used:false,

usedBy:"",

expiry:expiry,

createdAt:new Date().toISOString()

});

document.getElementById("status")
.innerText = "Created: " + code;

loadCodes();

}catch(e){

console.log(e);

alert("Error creating code");

}

}

// LOAD CODES
window.loadCodes = async function(){

try{

let snap = await getDocs(collection(db,"codes"));

let html = "";

snap.forEach(docu=>{

let data = docu.data();

html += `

<div class="card">

<p><b>Code:</b> ${docu.id}</p>

<p><b>Used:</b> ${data.used}</p>

<p><b>Expiry:</b> ${data.expiry}</p>

<p><b>Used By:</b> ${data.usedBy || "Not Used"}</p>

<button class="delete-btn"
onclick="deleteCode('${docu.id}')">

Delete

</button>

</div>

`;

});

document.getElementById("codesList")
.innerHTML = html;

}catch(e){

console.log(e);

}

}

// DELETE CODE
window.deleteCode = async function(id){

await deleteDoc(doc(db,"codes",id));

loadCodes();

}

// LOAD USERS
window.loadUsers = async function(){

let snap = await getDocs(collection(db,"users"));

let html = "";

snap.forEach(docu=>{

let data = docu.data();

html += `

<div class="card">

<h3>${data.email}</h3>

<p>Login Count: ${data.loginCount || 0}</p>

<p>Last Login: ${data.lastLogin || "N/A"}</p>

<p>Videos Watched: ${data.videoWatched || 0}</p>

<p>Code Used: ${data.codeUsed || "N/A"}</p>

<p>Status:
${data.banned ? "BANNED" : "ACTIVE"}
</p>

<button class="action-btn"
onclick="banUser('${docu.id}')">

Ban

</button>

<button class="delete-btn"
onclick="kickUser('${docu.id}')">

Kick

</button>

</div>

`;

});

document.getElementById("usersList")
.innerHTML = html;

}

// BAN USER
window.banUser = async function(uid){

await updateDoc(doc(db,"users",uid),{

banned:true

});

alert("User Banned");

loadUsers();

}

// KICK USER
window.kickUser = async function(uid){

await updateDoc(doc(db,"users",uid),{

deviceId:""

});

alert("User Kicked");

loadUsers();

}

// LOGOUT
window.logoutAdmin = async function(){

await signOut(auth);

window.location.href = "index.html";

}