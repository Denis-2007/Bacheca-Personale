import { db } from './firebase-init.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// PIN
let savedPin = localStorage.getItem("userPIN") || "1234";
const pinOverlay = document.getElementById("pinOverlay");
const pinInput = document.getElementById("pinInput");
const pinSubmit = document.getElementById("pinSubmit");
const pinError = document.getElementById("pinError");
const appContent = document.getElementById("appContent");

pinSubmit.onclick = async () => {
  if (pinInput.value === savedPin) {
    pinOverlay.style.display = "none";
    appContent.style.display = "block";
    await loadAllData();
  } else {
    pinError.textContent = "❌ PIN errato!";
    pinInput.value = "";
  }
};

// Dark mode
const darkToggle = document.getElementById("darkModeToggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// Popup functions
function openPopup(id) { document.getElementById(id).style.display = "flex"; }
function closePopup(id) { document.getElementById(id).style.display = "none"; }

// Change PIN
document.getElementById("settingsBtn").onclick = () => openPopup("settingsPopup");
document.getElementById("savePin").onclick = () => {
  const newPin = document.getElementById("newPin").value;
  if (newPin.trim() !== "") {
    savedPin = newPin;
    localStorage.setItem("userPIN", newPin);
    alert("✅ PIN cambiato!");
    closePopup("settingsPopup");
  }
};

// Sound
const successSound = document.getElementById("successSound");
function playSound() { successSound.play(); }

// Promemoria
const reminderList = document.getElementById("reminderList");
let editReminderId = null;

// Popup descrizione promemoria
const descPopup = document.getElementById("descPopup");
const descContent = document.getElementById("descContent");
document.getElementById("descClose").onclick = () => closePopup("descPopup");

// Link
const linkList = document.getElementById("linkList");
let editLinkId = null;

// Load all data
async function loadAllData() {
  reminderList.innerHTML = "";
  const remindersSnap = await getDocs(collection(db, "promemoria"));
  remindersSnap.forEach(docSnap => {
    const data = docSnap.data();
    addReminderToDOM(docSnap.id, data.label, data.desc);
  });

  linkList.innerHTML = "";
  const linksSnap = await getDocs(collection(db, "links"));
  linksSnap.forEach(docSnap => {
    const data = docSnap.data();
    addLinkToDOM(docSnap.id, data.label, data.url);
  });
}

// Add reminder
function addReminderToDOM(id, label, desc) {
  const li = document.createElement("li");
  li.className = "box reminder";
  const span = document.createElement("span");
  span.textContent = label;
  span.onclick = () => { descContent.textContent = desc || "(Nessuna descrizione)"; openPopup("descPopup"); };

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
  delBtn.onclick = async () => { await deleteDoc(doc(db, "promemoria", id)); li.remove(); };

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(delBtn);
  li.appendChild(span);
  li.appendChild(btnGroup);
  reminderList.appendChild(li);
}

document.getElementById("saveReminder").onclick = async () => {
  const label = document.getElementById("reminderLabel").value;
  const desc = document.getElementById("reminderDesc").value;
  if (!label.trim()) return;

  if (editReminderId) {
    await updateDoc(doc(db, "promemoria", editReminderId), { label, desc });
    editReminderId = null;
  } else {
    const docRef = await addDoc(collection(db, "promemoria"), { label, desc });
    addReminderToDOM(docRef.id, label, desc);
    playSound();
  }
  closePopup("reminderPopup");
};

document.getElementById("cancelReminder").onclick = () => { closePopup("reminderPopup"); editReminderId = null; };

// Add link
function addLinkToDOM(id, label, url) {
  const li = document.createElement("li");
  li.className = "box link";
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.textContent = label;

  const btnGroup = document.createElement("div");
  btnGroup.className = "btnGroup";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏️";
  editBtn.onclick = () => {
    document.getElementById("label").value = label;
    document.getElementById("url").value = url;
    editLinkId = id;
    openPopup("linkPopup");
  };

  const delBtn = document.createElement("button");
  delBtn.textContent = "🗑️";
  delBtn.onclick = async () => { await deleteDoc(doc(db, "links", id)); li.remove(); };

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(delBtn);
  li.appendChild(a);
  li.appendChild(btnGroup);
  linkList.appendChild(li);
}

document.getElementById("saveLink").onclick = async () => {
  const label = document.getElementById("label").value;
  const url = document.getElementById("url").value;
  if (!label.trim() || !url.trim()) return;

  if (editLinkId) {
    await updateDoc(doc(db, "links", editLinkId), { label, url });
    editLinkId = null;
  } else {
    const docRef = await addDoc(collection(db, "links"), { label, url });
    addLinkToDOM(docRef.id, label, url);
    playSound();
  }
  closePopup("linkPopup");
};

document.getElementById("cancelLink").onclick = () => { closePopup("linkPopup"); editLinkId = null; };

// Add buttons
document.getElementById("addReminderBtn").onclick = () => {
  document.getElementById("reminderLabel").value = "";
  document.getElementById("reminderDesc").value = "";
  editReminderId = null;
  openPopup("reminderPopup");
};
document.getElementById("addLinkBtn").onclick = () => {
  document.getElementById("label").value = "";
  document.getElementById("url").value = "";
  editLinkId = null;
  openPopup("linkPopup");
};
