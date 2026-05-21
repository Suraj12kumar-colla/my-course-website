import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getFirestore,
doc,
setDoc,
getDocs,
collection,
deleteDoc,
updateDoc,
addDoc
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

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{

if(!user){
window.location.href="index.html";
return;
}

if(user.email !== "kumarladla84@gmail.com"){

alert("Unauthorized Access");

window.location.href="index.html";

}

});

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

window.deleteCode = async function(id){

await deleteDoc(doc(db,"codes",id));

loadCodes();

}

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

<p>Code Used: ${data.activeCode || "N/A"}</p>

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

window.banUser = async function(uid){

let days = prompt("Ban for how many days?");

if(!days) return;

let banExpiry = new Date();

banExpiry.setDate(
banExpiry.getDate() + parseInt(days)
);

await updateDoc(doc(db,"users",uid),{

banned:true,
banExpiry: banExpiry.toISOString()

});

alert("User Banned");

loadUsers();

}

window.kickUser = async function(uid){

await updateDoc(doc(db,"users",uid),{

deviceId:"KICKED_" + Date.now()

});

alert("User Kicked");

loadUsers();

}

window.logoutAdmin = async function(){

await signOut(auth);

window.location.href = "index.html";

}

// CLOUDINARY

const CLOUD_NAME = "dxadgoahq";

const UPLOAD_PRESET = "aarambh_unsigned";

// VIDEO UPLOAD

window.uploadVideo = async function(){

try{

let title =
document.getElementById("videoTitle").value;

let subject =
document.getElementById("videoSubject").value;

let file =
document.getElementById("videoFile").files[0];

let manualLink =
document.getElementById("videoLink").value;

let finalUrl = "";

if(manualLink){

finalUrl = manualLink;

}else{

if(!file){
alert("Select video");
return;
}

const data = new FormData();

data.append("file",file);

data.append("upload_preset",UPLOAD_PRESET);

const res = await fetch(
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
{
method:"POST",
body:data
}
);

const result = await res.json();

finalUrl = result.secure_url;

}

await addDoc(collection(db,"videos"),{

title:title,

subject:subject,

url:finalUrl,

createdAt:new Date().toISOString()

});

alert("Video Uploaded");

}catch(e){

console.log(e);

alert("Upload Failed");

}

}

// PDF UPLOAD

window.uploadPDF = async function(){

try{

let title =
document.getElementById("pdfTitle").value;

let subject =
document.getElementById("pdfSubject").value;

let file =
document.getElementById("pdfFile").files[0];

if(!file){
alert("Select PDF");
return;
}

const data = new FormData();

data.append("file",file);

data.append("upload_preset",UPLOAD_PRESET);

const res = await fetch(
`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`,
{
method:"POST",
body:data
}
);

const result = await res.json();

await addDoc(collection(db,"notes"),{

title:title,

subject:subject,

url:result.secure_url,

createdAt:new Date().toISOString()

});

alert("PDF Uploaded");

}catch(e){

console.log(e);

alert("PDF Upload Failed");

}

}

// ANNOUNCEMENT

window.addAnnouncement = async function(){

let text =
document.getElementById("announcementText").value;

if(!text){
alert("Enter announcement");
return;
}

await addDoc(collection(db,"announcements"),{

text:text,

createdAt:new Date().toISOString()

});

alert("Announcement Posted");

}