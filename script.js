import { db } from './firebase-init.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// === PIN ===
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

// === Dark mode ===
const darkToggle = document.getElementById("darkModeToggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// === Funzioni popup ===
function openPopup(id) { document.getElementById(id).style.display = "flex"; }
function closePopup(id) { document.getElementById(id).style.display = "none"; }

// === Cambia PIN ===
document.getElementById("settingsBtn").onclick = () => openPopup("settingsPopup");
document.querySelector("#settingsPopup .cancelBtn").onclick = () => closePopup("settingsPopup");
document.getElementById("savePin").onclick = () => {
  const newPin = document.getElementById("newPin").value;
  if (newPin.trim() !== "") {
    savedPin = newPin;
    localStorage.setItem("userPIN", newPin);
    alert("✅ PIN cambiato!");
    closePopup("settingsPopup");
  }
};

// === Suono ===
const successSound = document.getElementById("successSound");
function playSound() { successSound.play(); }

// === Promemoria ===
const reminderList = document.getElementById("reminderList");
let editReminderId = null;

// === Link ===
const linkList = document.getElementById("linkList");
let editLinkId = null;

// === Popup descrizione ===
const descPopup = document.getElementById("descPopup");
const descPopupContent = document.getElementById("descPopupContent");
document.getElementById("descCloseBtn").onclick = () => closePopup("descPopup");

// --- Carica dati ---
async function loadAllData() {
  // Promemoria
  const remindersSnap = await getDocs(collection(db, "promemoria"));
  reminderList.innerHTML = "";
  remindersSnap.forEach(docSnap => {
    const data = docSnap.data();
    addReminderToDOM(docSnap.id, data.label, data.desc, data.priority || "low");
  });

  // Link
  const linksSnap = await getDocs(collection(db, "links"));
  linkList.innerHTML = "";
  linksSnap.forEach(docSnap => {
    const data = docSnap.data();
    addLinkToDOM(docSnap.id, data.label, data.url);
  });
}

// --- Funzioni DOM ---
function addReminderToDOM(id, label, desc, priority) {
  const li = document.createElement("li");
  li.setAttribute("data-icon", "📝");

  // Assegna classe colore in base alla priorità
  li.classList.add(
    priority === "high" ? "reminder-high" :
    priority === "medium" ? "reminder-medium" : "reminder-low"
  );

  const span = document.createElement("span");
  span.textContent = label;
  span.onclick = () => {
    descPopupContent.textContent = desc || "(Nessuna descrizione)";
    openPopup("descPopup");
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
    await deleteDoc(doc(db, "promemoria", id));
    li.remove();
  };

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(delBtn);
  li.appendChild(span);
  li.appendChild(btnGroup);
  reminderList.appendChild(li);
}

// --- Salva promemoria ---
document.getElementById("saveReminder").onclick = async () => {
  const label = document.getElementById("reminderLabel").value;
  const desc = document.getElementById("reminderDesc").value;
  if (!label.trim()) return;

  if (editReminderId) {
    await updateDoc(doc(db, "promemoria", editReminderId), { label, desc });
    editReminderId = null;
    await loadAllData();
  } else {
    const docRef = await addDoc(collection(db, "promemoria"), { label, desc, priority: "low" });
    addReminderToDOM(docRef.id, label, desc, "low");
    playSound();
  }
  closePopup("reminderPopup");
};

// --- Bottone annulla ---
document.querySelector("#reminderPopup .cancelBtn").onclick = () => closePopup("reminderPopup");
document.querySelector("#linkPopup .cancelBtn").onclick = () => closePopup("linkPopup");

// --- Link DOM ---
function addLinkToDOM(id, label, url) {
  const li = document.createElement("li");
  li.setAttribute("data-icon", "🔗");

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
  delBtn.onclick = async () => {
    await deleteDoc(doc(db, "links", id));
    li.remove();
  };

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(delBtn);
  li.appendChild(a);
  li.appendChild(btnGroup);
  linkList.appendChild(li);
}

// --- Salva link ---
document.getElementById("saveLink").onclick = async () => {
  const label = document.getElementById("label").value;
  const url = document.getElementById("url").value;
  if (!label.trim() || !url.trim()) return;

  if (editLinkId) {
    await updateDoc(doc(db, "links", editLinkId), { label, url });
    editLinkId = null;
    await loadAllData();
  } else {
    const docRef = await addDoc(collection(db, "links"), { label, url });
    addLinkToDOM(docRef.id, label, url);
    playSound();
  }
  closePopup("linkPopup");
};

// --- Bottone aggiungi ---
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
