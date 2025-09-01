// 🔹 FIREBASE SETUP
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD2GGWWPn5P2xgw7YGWiJ5ZUXFRbHJkVy4",
  authDomain: "bacheca-presonale.firebaseapp.com",
  projectId: "bacheca-presonale",
  storageBucket: "bacheca-presonale.firebasestorage.app",
  messagingSenderId: "147412610802",
  appId: "1:147412610802:web:b7cddfbf3a11c312576a6b",
  measurementId: "G-QM12GWW70Y"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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
let reminders = [];
let editReminderIndex = null;

const reminderRef = ref(db, "promemoria");

// 🔹 Ascolta cambiamenti in real-time
onValue(reminderRef, (snapshot) => {
  reminders = [];
  snapshot.forEach((child) => reminders.push({ key: child.key, ...child.val() }));
  renderReminders();
});

function renderReminders() {
  reminderList.innerHTML = "";
  reminders.forEach((r, i) => {
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
      editReminderIndex = i;
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "deleteBtn";
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      const childRef = ref(db, "promemoria/" + r.key);
      await set(childRef, null); // elimina da Firebase
    };

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(delBtn);

    li.appendChild(label);
    li.appendChild(btnGroup);
    reminderList.appendChild(li);
  });
}

document.getElementById("addReminderBtn").onclick = () => {
  openPopup("reminderPopup");
  document.getElementById("reminderLabel").value = "";
  document.getElementById("reminderDesc").value = "";
  editReminderIndex = null;
};

document.getElementById("saveReminder").onclick = () => {
  const label = document.getElementById("reminderLabel").value;
  const desc = document.getElementById("reminderDesc").value;
  if (label.trim() !== "") {
    if (editReminderIndex !== null) {
      const key = reminders[editReminderIndex].key;
      set(ref(db, "promemoria/" + key), { label, desc, data: new Date().toISOString() });
    } else {
      push(reminderRef, { label, desc, data: new Date().toISOString() });
      playSound();
    }
    closePopup("reminderPopup");
  }
};

// === LINK ===
const linkList = document.getElementById("linkList");
let links = [];
let editLinkIndex = null;
const linkRef = ref(db, "link");

onValue(linkRef, (snapshot) => {
  links = [];
  snapshot.forEach((child) => links.push({ key: child.key, ...child.val() }));
  renderLinks();
});

function renderLinks() {
  linkList.innerHTML = "";
  links.forEach((l, i) => {
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
      editLinkIndex = i;
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "deleteBtn";
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      await set(ref(db, "link/" + l.key), null);
    };

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(delBtn);

    li.appendChild(anchor);
    li.appendChild(btnGroup);
    linkList.appendChild(li);
  });
}

document.getElementById("addLinkBtn").onclick = () => {
  openPopup("linkPopup");
  document.getElementById("label").value = "";
  document.getElementById("url").value = "";
  editLinkIndex = null;
};

document.getElementById("saveLink").onclick = () => {
  const label = document.getElementById("label").value;
  const url = document.getElementById("url").value;
  if (label.trim() !== "" && url.trim() !== "") {
    if (editLinkIndex !== null) {
      const key = links[editLinkIndex].key;
      set(ref(db, "link/" + key), { label, url });
    } else {
      push(linkRef, { label, url });
      playSound();
    }
    closePopup("linkPopup");
  }
};

// === Funzioni popup ===
function openPopup(id) { document.getElementById(id).style.display = "flex"; }
function closePopup(id) { document.getElementById(id).style.display = "none"; }
