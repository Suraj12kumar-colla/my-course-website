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

const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "YOUR_DOMAIN",

projectId: "YOUR_PROJECT_ID",

storageBucket: "YOUR_BUCKET",

messagingSenderId: "XXXX",

appId: "XXXX"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

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

code = Math.random().toString(36)
.substring(2,8)
.toUpperCase();

}

await setDoc(doc(db,"codes",code),{

used:false,

expiry:expiry,

createdAt:new Date().toISOString()

});

document.getElementById("status")
.innerText = "Created: " + code;

loadCodes();

}catch(e){

console.log(e);

}

}

// LOAD CODES
window.loadCodes = async function(){

let snap = await getDocs(collection(db,"codes"));

let html = "";

snap.forEach(docu=>{

let data = docu.data();

html += `

<div style="
background:#222;
padding:15px;
margin-top:15px;
border-radius:12px;
">

<p><b>Code:</b> ${docu.id}</p>

<p><b>Used:</b> ${data.used}</p>

<p><b>Expiry:</b> ${data.expiry}</p>

<p><b>Used By:</b> ${data.usedBy || "Not Used"}</p>

<button onclick="deleteCode('${docu.id}')">
Delete
</button>

</div>

`;

});

document.getElementById("codesList")
.innerHTML = html;

}

// DELETE
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

<div style="
background:#111;
padding:15px;
margin-top:15px;
border-radius:12px;
">

<h3>${data.email}</h3>

<p>Login Count: ${data.loginCount}</p>

<p>Last Login: ${data.lastLogin}</p>

<p>Videos Watched: ${data.videoWatched}</p>

<p>Status:
${data.banned
? "BANNED"
: "ACTIVE"}
</p>

<button onclick="banUser('${docu.id}')">
Ban
</button>

<button onclick="kickUser('${docu.id}')">
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

alert("User banned");

loadUsers();

}

// KICK USER
window.kickUser = async function(uid){

await updateDoc(doc(db,"users",uid),{

deviceId:""

});

alert("User kicked");

loadUsers();

}