import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
getFirestore,
doc,
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
const db = getFirestore(app);

window.createCode = async function(){

let code = document.getElementById("code").value;
let expiry = document.getElementById("expiry").value;

if(!code || !expiry){
document.getElementById("status").innerText = "Fill all fields";
return;
}

await setDoc(doc(db,"codes",code),{
used:false,
expiry:expiry
});

document.getElementById("status").innerText = "Code Created Successfully";

}