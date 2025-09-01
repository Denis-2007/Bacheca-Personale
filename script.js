// === FIREBASE ===
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD2GGWWPn5P2xgw7YGWiJ5ZUXFRbHJkVy4",
  authDomain: "bacheca-presonale.firebaseapp.com",
  projectId: "bacheca-presonale",
  storageBucket: "bacheca-presonale.firebasestorage.app",
  messagingSenderId: "147412610802",
  appId: "1:147412610802:web:b7cddfbf3a11c312576a6b",
  measurementId: "G-QM12GWW70Y"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// === PIN ===
let savedPin = localStorage.getItem("userPIN") || "1234";
const pinOverlay = document.getElementById("pinOverlay");
const pinInput = document.getElementById("pinInput");
const pinSubmit = document.getElementById("pinSubmit");
const pinError = document.getElementById("pinError");
const appContent = document.getElementById("appContent");

pinSubmit.onclick = () => {
  if (pinInput.value === savedPin) {
    pinOverlay.style.display = "none";
    appContent.style.display = "block";
  } else {
    pinError.textContent = "❌ PIN errato!";
    pinInput.value = "";
  }
};

// === Cambia PIN ===
document.getElementById("settingsBtn").onclick = () => openPopup("settingsPopup");
document.getElementById("savePin").onclick = () => {
  const newPin = document.getElementById("newPin").value;
  if (newPin.trim() !== "") {
    savedPin = newPin;
    localStorage.setItem("userPIN", newPin);
    alert("✅ PIN cambiato con successo!");
    closePopup("settingsPopup");
  }
};

// === Dark mode ===
const darkToggle = document.getElementById("darkModeToggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// === Suono ===
const successSound = document.getElementById("successSound");
function playSound() { successSound.play(); }

// === PROMEMORIA ===
const reminderList = document.getElementById("reminderList");
let editReminderId = null;

const remindersCol = collection(db, "reminders");

// Funzione render
function renderReminders(data) {
  reminderList.innerHTML = "";
  data.forEach((docSnap) => {
    const r = docSnap.data();
    const li = document.createElement("li");
    li.setAttribute("data-icon", "📝");

    const label = document.createElement("span");
    label.textContent = r.label;
    label.style.flex = "1";
    label.onclick = () => {
      document.getElementById("viewReminderLabel").textContent = r.label;
      document.getElementById("viewReminderDesc").textContent = r.desc || "(Nessuna descrizione)";
      openPopup("viewReminderPopup");
    };

    const btnGroup = document.createElement("div");
    btnGroup.className = "btnGroup";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "editBtn";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      openPopup("reminderPopup");
      document.getElementById("reminderLabel").value = r.label;
      document.getElementById("reminderDesc").value = r.desc;
      editReminderId = docSnap.id;
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "deleteBtn";
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      await deleteDoc(doc(db, "reminders", docSnap.id));
    };

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(delBtn);

    li.appendChild(label);
    li.appendChild(btnGroup);
    reminderList.appendChild(li);
  });
}

// Listener in tempo reale
onSnapshot(remindersCol, (snapshot) => {
  renderReminders(snapshot.docs);
});

// Pulsanti aggiungi/salva
document.getElementById("addReminderBtn").onclick = () => {
  openPopup("reminderPopup");
  document.getElementById("reminderLabel").value = "";
  document.getElementById("reminderDesc").value = "";
  editReminderId = null;
};

document.getElementById("saveReminder").onclick = async () => {
  const label = document.getElementById("reminderLabel").value.trim();
  const desc = document.getElementById("reminderDesc").value.trim();
  if (label === "") return;

  if (editReminderId) {
    await updateDoc(doc(db, "reminders", editReminderId), { label, desc });
  } else {
    await addDoc(remindersCol, { label, desc });
    playSound();
  }
  closePopup("reminderPopup");
};

// === LINK ===
const linkList = document.getElementById("linkList");
let editLinkId = null;
const linksCol = collection(db, "links");

function renderLinks(data) {
  linkList.innerHTML = "";
  data.forEach((docSnap) => {
    const l = docSnap.data();
    const li = document.createElement("li");
    li.setAttribute("data-icon", "🔗");

    const anchor = document.createElement("a");
    anchor.href = l.url;
    anchor.textContent = l.label;
    anchor.target = "_blank";
    anchor.style.flex = "1";

    const btnGroup = document.createElement("div");
    btnGroup.className = "btnGroup";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "editBtn";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      openPopup("linkPopup");
      document.getElementById("label").value = l.label;
      document.getElementById("url").value = l.url;
      editLinkId = docSnap.id;
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "deleteBtn";
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      await deleteDoc(doc(db, "links", docSnap.id));
    };

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(delBtn);

    li.appendChild(anchor);
    li.appendChild(btnGroup);
    linkList.appendChild(li);
  });
}

onSnapshot(linksCol, (snapshot) => renderLinks(snapshot.docs));

document.getElementById("addLinkBtn").onclick = () => {
  openPopup("linkPopup");
  document.getElementById("label").value = "";
  document.getElementById("url").value = "";
  editLinkId = null;
};

document.getElementById("saveLink").onclick = async () => {
  const label = document.getElementById("label").value.trim();
  const url = document.getElementById("url").value.trim();
  if (label === "" || url === "") return;

  if (editLinkId) {
    await updateDoc(doc(db, "links", editLinkId), { label, url });
  } else {
    await addDoc(linksCol, { label, url });
    playSound();
  }
  closePopup("linkPopup");
};

// === Popup functions ===
function openPopup(id) { document.getElementById(id).style.display = "flex"; }
function closePopup(id) { document.getElementById(id).style.display = "none"; }
