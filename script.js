import { db } from './firebase-init.js';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* --- PIN --- */
let savedPin = localStorage.getItem("userPIN") || "1234";
const pinOverlay = document.getElementById("pinOverlay");
const pinInput = document.getElementById("pinInput");
const pinSubmit = document.getElementById("pinSubmit");
const pinError = document.getElementById("pinError");
const appContent = document.getElementById("appContent");

pinSubmit.onclick = async () => {
  if(pinInput.value===savedPin){
    pinOverlay.style.display="none";
    appContent.style.display="block";
    listenData();
  } else {
    pinError.textContent="❌ PIN errato!";
    pinInput.value="";
  }
};

/* --- DARK MODE --- */
const darkToggle = document.getElementById("darkModeToggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent=document.body.classList.contains("dark")?"☀️":"🌙";
};

/* --- POPUP --- */
function openPopup(id){ document.getElementById(id).style.display="flex"; }
function closePopup(id){ document.getElementById(id).style.display="none"; }
window.closePopup = closePopup;

/* --- SETTINGS PIN --- */
document.getElementById("settingsBtn").onclick=()=>openPopup("settingsPopup");
document.getElementById("savePin").onclick=()=>{
  const newPin=document.getElementById("newPin").value;
  if(newPin.trim()!==""){
    savedPin=newPin;
    localStorage.setItem("userPIN",newPin);
    alert("✅ PIN cambiato!");
    closePopup("settingsPopup");
  }
};
document.getElementById("closeSettings").onclick=()=>closePopup("settingsPopup");

/* --- SUONI --- */
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";
let audioUnlocked = false;

const soundCreate = document.getElementById("soundCreate");
const soundSave   = document.getElementById("soundSave");
const soundDelete = document.getElementById("soundDelete");
const soundClick  = document.getElementById("soundClick");

document.body.addEventListener("click", () => {
  if(!audioUnlocked){
    [soundCreate, soundSave, soundDelete, soundClick].forEach(audio => {
      audio.play().catch(()=>{});
      audio.pause();
      audio.currentTime = 0;
    });
    audioUnlocked = true;
  }
}, { once: true });

function playSound(type){
  if(!soundEnabled || !audioUnlocked) return;
  let audio;
  switch(type){
    case "create": audio = soundCreate; break;
    case "save":   audio = soundSave; break;
    case "delete": audio = soundDelete; break;
    case "click":  audio = soundClick; break;
  }
  if(audio){
    audio.currentTime = 0;
    audio.play();
  }
}
const toggleSoundBtn = document.getElementById("toggleSound");
function updateSoundBtn(){
  if(soundEnabled){
    toggleSoundBtn.textContent = "🔊 Suoni Attivi";
    toggleSoundBtn.classList.add("on");
    toggleSoundBtn.classList.remove("off");
  } else {
    toggleSoundBtn.textContent = "🔇 Suoni Disattivi";
    toggleSoundBtn.classList.add("off");
    toggleSoundBtn.classList.remove("on");
  }
}
updateSoundBtn();
toggleSoundBtn.onclick = ()=>{
  soundEnabled = !soundEnabled;
  localStorage.setItem("soundEnabled", soundEnabled);
  updateSoundBtn();
};

/* --- REMINDERS FIREBASE --- */
const reminderList=document.getElementById("reminderList");
document.getElementById("addReminderBtn").onclick=()=>openPopup("reminderPopup");
document.getElementById("cancelReminder").onclick=()=>closePopup("reminderPopup");
document.getElementById("saveReminder").onclick=async ()=>{
  const label=document.getElementById("reminderLabel").value;
  const desc=document.getElementById("reminderDescEditable").innerHTML;
  if(label.trim()!==""){
    await addDoc(collection(db,"reminders"),{label,desc});
    playSound("save");
    closePopup("reminderPopup");
  }
};

/* --- LINKS FIREBASE --- */
const linkList=document.getElementById("linkList");
document.getElementById("addLinkBtn").onclick=()=>openPopup("linkPopup");
document.getElementById("cancelLink").onclick=()=>closePopup("linkPopup");
document.getElementById("saveLink").onclick=async ()=>{
  const label=document.getElementById("label").value;
  const url=document.getElementById("url").value;
  if(label.trim()!==""&&url.trim()!==""){
    await addDoc(collection(db,"links"),{label,url});
    playSound("save");
    closePopup("linkPopup");
  }
};

/* --- MOSTRA DESCRIZIONE --- */
const descPopup=document.getElementById("descPopup");
const descContent=document.getElementById("descContent");
document.getElementById("closeDescBtn").onclick=()=>closePopup("descPopup");

/* --- FIREBASE LISTENER --- */
function listenData(){
  onSnapshot(collection(db,"reminders"),snapshot=>{
    reminderList.innerHTML="";
    snapshot.forEach(docSnap=>{
      const r=docSnap.data();
      const li=document.createElement("li");
      li.innerHTML=`<span>${r.label}</span>
      <div class="btnGroup">
        <button onclick="showDesc(\`${r.desc}\`)">👁️</button>
        <button onclick="deleteReminder('${docSnap.id}')">🗑️</button>
      </div>`;
      reminderList.appendChild(li);
    });
  });

  onSnapshot(collection(db,"links"),snapshot=>{
    linkList.innerHTML="";
    snapshot.forEach(docSnap=>{
      const l=docSnap.data();
      const li=document.createElement("li");
      li.innerHTML=`<a href="${l.url}" target="_blank">${l.label}</a>
      <div class="btnGroup">
        <button onclick="deleteLink('${docSnap.id}')">🗑️</button>
      </div>`;
      linkList.appendChild(li);
    });
  });
}
window.showDesc=(desc)=>{
  descContent.innerHTML=desc;
  openPopup("descPopup");
};
window.deleteReminder=async(id)=>{
  await deleteDoc(doc(db,"reminders",id));
  playSound("delete");
};
window.deleteLink=async(id)=>{
  await deleteDoc(doc(db,"links",id));
  playSound("delete");
};

/* --- FORMATTAZIONE TESTO --- */
window.highlight=(color)=>{
  document.execCommand("hiliteColor",false,color);
};

/* --- MIGLIORIE + CATEGORIE --- */
document.getElementById("improvementsBtn").onclick=()=>openPopup("improvementsPopup");
const categoryBtn=document.getElementById("categoryBtn");
const categoryDropdown=document.getElementById("categoryDropdown");
categoryBtn.onclick=()=>{
  categoryDropdown.classList.toggle("hidden");
};
