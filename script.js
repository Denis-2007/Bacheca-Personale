import { db } from './firebase-init.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ===== PIN =====
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

// ===== Dark Mode =====
const darkToggle = document.getElementById("darkModeToggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// ===== Suono =====
const successSound = document.getElementById("successSound");
function playSound() { successSound.play(); }

// ===== POPUP =====
function openPopup(id) { document.getElementById(id).style.display = "flex"; }
function closePopup(id) { document.getElementById(id).style.display = "none"; }
document.getElementById("settingsBtn").onclick = () => openPopup("settingsPopup");
document.getElementById("addReminderBtn").onclick = () => openPopup("reminderPopup");
document.getElementById("addLinkBtn").onclick = () => openPopup("linkPopup");

// ===== Cambia PIN =====
document.getElementById("savePin").onclick = () => {
  const newPin = document.getElementById("newPin").value;
  if (newPin.trim() !== "") {
    savedPin = newPin;
    localStorage.setItem("userPIN", newPin);
    alert("✅ PIN cambiato!");
    closePopup("settingsPopup");
  }
};

// ===== PROMEMORIA =====
const reminderList = document.getElementById("reminderList");
let editReminderId = null;

async function loadAllData() {
  // Carica promemoria
  const remindersSnap = await getDocs(collection(db, "promemoria"));
  reminderList.innerHTML = "";
  remindersSnap.forEach(docSnap => addReminderToDOM(docSnap.id, docSnap.data().label, docSnap.data().desc));

  // Carica link
  const linkSnap = await getDocs(collection(db, "links"));
  const linkList = document.getElementById("linkList");
  linkList.innerHTML = "";
  linkSnap.forEach(docSnap => addLinkToDOM(docSnap.id, docSnap.data().label, docSnap.data().url));
}

function addReminderToDOM(id, label, desc) {
  const li = document.createElement("li");
  li.setAttribute("data-icon", "📝");

  const span = document.createElement("span");
  span.textContent = label;
  span.style.flex = "1";
  span.onclick = () => alert(desc || "(Nessuna descrizione)");

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

// ===== LINK =====
const linkList = document.getElementById("linkList");
let editLinkId = null;

function addLinkToDOM(id, label, url) {
  const li = document.createElement("li");
  li.setAttribute("data-icon", "🔗");

  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.textContent = label;
  a.style.flex = "1";

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
