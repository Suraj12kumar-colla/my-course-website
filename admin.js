import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getFirestore,
doc,
setDoc,
getDocs,
collection,
deleteDoc
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
const db = getFirestore(app);

// 🔥 CREATE CODE
window.createCode = async function(){

try{

let code = document.getElementById("code").value;
let expiry = document.getElementById("expiry").value;

if(!expiry){
document.getElementById("status").innerText = "Select expiry date";
return;
}

if(!code){
code = Math.random().toString(36).substring(2,8).toUpperCase();
}

await setDoc(doc(db,"codes",code),{
used:false,
expiry:expiry,
createdAt:new Date().toISOString()
});

document.getElementById("status").innerText = "Code Created ✔: " + code;

loadCodes();

}catch(e){
console.log(e);
document.getElementById("status").innerText = "Error creating code";
}

}

// 🔥 LOAD CODES
window.loadCodes = async function(){

try{

let snap = await getDocs(collection(db,"codes"));

let html = "";

if(snap.empty){
html = "<p>No codes found</p>";
}

snap.forEach(docu=>{

let data = docu.data();

html += `
<div style="background:#222;padding:10px;margin:10px;border-radius:10px">

<p><b>Code:</b> ${docu.id}</p>
<p><b>Used:</b> ${data.used}</p>
<p><b>Expiry:</b> ${data.expiry}</p>

<button onclick="deleteCode('${docu.id}')">Delete</button>

</div>
`;

});

document.getElementById("codesList").innerHTML = html;

}catch(e){
console.log(e);
document.getElementById("codesList").innerHTML = "Error loading codes";
}

}

// 🔥 DELETE CODE
window.deleteCode = async function(codeId){

try{

await deleteDoc(doc(db,"codes",codeId));

loadCodes();

}catch(e){
alert("Delete failed");
console.log(e);
}

}