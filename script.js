import { db } from "./firebase-init.js";
import { collection, addDoc, deleteDoc, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const pinOverlay = document.getElementById("pinOverlay");
const pinInput = document.getElementById("pinInput");
const pinSubmit = document.getElementById("pinSubmit");
const pinError = document.getElementById("pinError");
const appContent = document.getElementById("appContent");

const reminderList = document.getElementById("reminderList");
let editReminderId = null;

// ===== FUNZIONI POPUP =====
function openPopup(id){ document.getElementById(id).style.display = "flex"; }
function closePopup(id){ document.getElementById(id).style.display = "none"; }

// ===== PIN =====
pinSubmit.addEventListener("click", () => {
  const pin = pinInput.value;
  const savedPin = localStorage.getItem("userPin") || "123456";
  if(pin === savedPin){
    pinOverlay.style.display = "none";
    appContent.style.display = "block";
  } else { pinError.textContent = "PIN errato!"; }
});

// ===== PROMEMORIA =====
async function loadReminders(){
  const querySnapshot = await getDocs(collection(db, "promemoria"));
  querySnapshot.forEach(docSnap => {
    addReminderToDOM(docSnap.id, docSnap.data().label, docSnap.data().desc);
  });
}

function addReminderToDOM(id, label, desc){
  const li = document.createElement("li");
  li.setAttribute("data-icon","📝");

  const span = document.createElement("span");
  span.textContent = label;
  span.style.flex = "1";
  span.onclick = () => {
    document.getElementById("reminderLabel").value = label;
    document.getElementById("reminderDesc").value = desc;
    editReminderId = id;
    openPopup("reminderPopup");
  };

  const btnGroup = document.createElement("div");
  btnGroup.className = "btnGroup";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.onclick = () => {
    document.getElementById("reminderLabel").value = label;
    document.getElementById("reminderDesc").value = desc;
    editReminderId = id;
    openPopup("reminderPopup");
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.onclick = async () => {
    await deleteDoc(doc(db,"promemoria",id));
    li.remove();
  };

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(delBtn);
  li.appendChild(span);
  li.appendChild(btnGroup);
  reminderList.appendChild(li);
}

// APRI POPUP NUOVO PROMEMORIA
document.getElementById("addReminderBtn").onclick = () => { openPopup("reminderPopup"); }

// SALVA PROMEMORIA
document.getElementById("saveReminder").onclick = async () => {
  const label = document.getElementById("reminderLabel").value;
  const desc = document.getElementById("reminderDesc").value;
  if(editReminderId){
    const docRef = doc(db,"promemoria",editReminderId);
    await updateDoc(docRef,{label,desc});
    location.reload();
  } else {
    await addDoc(collection(db,"promemoria"),{label,desc});
  }
  closePopup("reminderPopup");
  location.reload();
}

loadReminders();
