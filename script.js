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

const soundCreate = document.getElementById("soundCreate");
const soundSave   = document.getElementById("soundSave");
const soundDelete = document.getElementById("soundDelete");
const soundClick  = document.getElementById("soundClick");

function playSound(type){
  if(!soundEnabled) return;
  switch(type){
    case "create": soundCreate.play(); break;
    case "save":   soundSave.play(); break;
    case "delete": soundDelete.play(); break;
    case "click":  soundClick.play(); break;
  }
}

// toggle suoni
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

/* --- PROMEMORIA --- */
const reminderList=document.getElementById("reminderList");
let editReminderId=null;

/* --- LINK --- */
const linkList=document.getElementById("linkList");
let editLinkId=null;

/* --- LISTENER DATI --- */
function listenData(){
  onSnapshot(collection(db,"promemoria"), (snapshot)=>{
    reminderList.innerHTML="";
    snapshot.forEach(docSnap=>{
      const data=docSnap.data();
      addReminderToDOM(docSnap.id,data.label,data.desc);
    });
  });

  onSnapshot(collection(db,"links"), (snapshot)=>{
    linkList.innerHTML="";
    snapshot.forEach(docSnap=>{
      const data=docSnap.data();
      addLinkToDOM(docSnap.id,data.label,data.url);
    });
  });
}

/* --- FUNZIONI DOM --- */
function addReminderToDOM(id,label,desc){
  const li=document.createElement("li");
  const span=document.createElement("span");
  span.textContent=label;
  span.onclick=()=>{
    document.getElementById("descContent").textContent=desc||"(Nessuna descrizione)";
    playSound("click");
    openPopup("descPopup");
  };

  const btnGroup=document.createElement("div");
  btnGroup.className="btnGroup";

  const editBtn=document.createElement("button");
  editBtn.textContent="✏️";
  editBtn.onclick=()=>{
    document.getElementById("reminderLabel").value=label;
    document.getElementById("reminderDesc").value=desc;
    editReminderId=id;
    openPopup("reminderPopup");
  };

  const delBtn=document.createElement("button");
  delBtn.textContent="🗑️";
  delBtn.onclick=async()=>{
    await deleteDoc(doc(db,"promemoria",id));
    playSound("delete");
  };

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(delBtn);
  li.appendChild(span);
  li.appendChild(btnGroup);
  reminderList.appendChild(li);
}

document.getElementById("saveReminder").onclick=async()=>{
  const label=document.getElementById("reminderLabel").value;
  const desc=document.getElementById("reminderDesc").value;
  if(!label.trim()) return;

  if(editReminderId){
    await updateDoc(doc(db,"promemoria",editReminderId),{label,desc});
    playSound("save");
    editReminderId=null;
  } else {
    await addDoc(collection(db,"promemoria"),{label,desc});
    playSound("create");
  }
  closePopup("reminderPopup");
};

document.getElementById("cancelReminder").onclick=()=>closePopup("reminderPopup");

function addLinkToDOM(id,label,url){
  const li=document.createElement("li");
  const a=document.createElement("a");
  a.href=url; a.target="_blank"; a.textContent=label;

  const btnGroup=document.createElement("div");
  btnGroup.className="btnGroup";

  const editBtn=document.createElement("button");
  editBtn.textContent="✏️";
  editBtn.onclick=()=>{
    document.getElementById("label").value=label;
    document.getElementById("url").value=url;
    editLinkId=id;
    openPopup("linkPopup");
  };

  const delBtn=document.createElement("button");
  delBtn.textContent="🗑️";
  delBtn.onclick=async()=>{
    await deleteDoc(doc(db,"links",id));
    playSound("delete");
  };

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(delBtn);
  li.appendChild(a);
  li.appendChild(btnGroup);
  linkList.appendChild(li);
}

document.getElementById("saveLink").onclick=async()=>{
  const label=document.getElementById("label").value;
  const url=document.getElementById("url").value;
  if(!label.trim() || !url.trim()) return;

  if(editLinkId){
    await updateDoc(doc(db,"links",editLinkId),{label,url});
    playSound("save");
    editLinkId=null;
  } else {
    await addDoc(collection(db,"links"),{label,url});
    playSound("create");
  }
  closePopup("linkPopup");
};

document.getElementById("cancelLink").onclick=()=>closePopup("linkPopup");

/* --- BOTTONI AGGIUNGI --- */
document.getElementById("addReminderBtn").onclick=()=>{
  document.getElementById("reminderLabel").value="";
  document.getElementById("reminderDesc").value="";
  editReminderId=null;
  openPopup("reminderPopup");
};
document.getElementById("addLinkBtn").onclick=()=>{
  document.getElementById("label").value="";
  document.getElementById("url").value="";
  editLinkId=null;
  openPopup("linkPopup");
};

/* --- POPUP DESCRIZIONE --- */
document.getElementById("closeDescBtn").onclick=()=>closePopup("descPopup");
