import { db } from "./firebase-init.js";
import {
  collection, addDoc, deleteDoc, updateDoc, doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

/* --- VARIABILI GLOBALI --- */
const reminderList = document.getElementById("reminderList");
const linkList = document.getElementById("linkList");
const ideaList = document.getElementById("ideaList");
let editingIdeaId = null;
let editingReminderId = null;

/* --- SUONI --- */
function playSound(type) {
  if (!soundsOn) return;
  const sounds = {
    create: document.getElementById("soundCreate"),
    save: document.getElementById("soundSave"),
    delete: document.getElementById("soundDelete"),
    click: document.getElementById("soundClick"),
  };
  if (sounds[type]) {
    sounds[type].currentTime = 0;
    sounds[type].play();
  }
}
let soundsOn = true;

/* --- POPUP --- */
function openPopup(id) {
  document.getElementById(id).style.display = "flex";
}
function closePopup(id) {
  document.getElementById(id).style.display = "none";
  if (id === "ideaPopup") {
    document.getElementById("ideaLabel").value = "";
    document.getElementById("ideaDesc").value = "";
    editingIdeaId = null;
  }
  if (id === "reminderPopup") {
    document.getElementById("reminderLabel").value = "";
    document.getElementById("reminderDesc").value = "";
    editingReminderId = null;
  }
}

/* --- LOGIN PIN --- */
const pinOverlay = document.getElementById("pinOverlay");
const pinSubmit = document.getElementById("pinSubmit");
const pinError = document.getElementById("pinError");
pinSubmit.onclick = () => {
  const pinInput = document.getElementById("pinInput").value;
  const savedPin = localStorage.getItem("bachecaPin") || "1234";
  if (pinInput === savedPin) {
    pinOverlay.style.display = "none";
    document.getElementById("appContent").style.display = "block";
    playSound("click");
  } else {
    pinError.textContent = "❌ PIN errato";
  }
};

/* --- PROMEMORIA --- */
document.getElementById("addReminderBtn").onclick = () => openPopup("reminderPopup");
document.getElementById("cancelReminder").onclick = () => closePopup("reminderPopup");

document.getElementById("saveReminder").onclick = async () => {
  const label = document.getElementById("reminderLabel").value;
  const desc = document.getElementById("reminderDesc").value;
  if (label.trim() !== "") {
    if (editingReminderId) {
      await updateDoc(doc(db, "reminders", editingReminderId), { label, desc });
    } else {
      await addDoc(collection(db, "reminders"), { label, desc });
    }
    playSound("save");
    closePopup("reminderPopup");
  }
};

window.deleteReminder = async (id) => {
  await deleteDoc(doc(db, "reminders", id));
  playSound("delete");
};
window.editReminder = (id, label, desc) => {
  editingReminderId = id;
  document.getElementById("reminderLabel").value = label;
  document.getElementById("reminderDesc").value = desc;
  openPopup("reminderPopup");
};

/* --- LINKS --- */
document.getElementById("addLinkBtn").onclick = () => openPopup("linkPopup");
document.getElementById("cancelLink").onclick = () => closePopup("linkPopup");

document.getElementById("saveLink").onclick = async () => {
  const label = document.getElementById("label").value;
  const url = document.getElementById("url").value;
  if (label.trim() !== "" && url.trim() !== "") {
    await addDoc(collection(db, "links"), { label, url });
    playSound("save");
    closePopup("linkPopup");
  }
};

window.deleteLink = async (id) => {
  await deleteDoc(doc(db, "links", id));
  playSound("delete");
};

/* --- IDEE --- */
const ideaBtn = document.getElementById("ideaBtn");
ideaBtn.onclick = () => openPopup("ideaPopup");
document.getElementById("cancelIdea").onclick = () => closePopup("ideaPopup");

document.getElementById("saveIdea").onclick = async () => {
  const label = document.getElementById("ideaLabel").value;
  const desc = document.getElementById("ideaDesc").value;
  if (label.trim() !== "") {
    if (editingIdeaId) {
      await updateDoc(doc(db, "ideas", editingIdeaId), { label, desc });
    } else {
      await addDoc(collection(db, "ideas"), { label, desc });
    }
    playSound("save");
    closePopup("ideaPopup");
  }
};

window.deleteIdea = async (id) => {
  await deleteDoc(doc(db, "ideas", id));
  playSound("delete");
};
window.editIdea = (id, label, desc) => {
  editingIdeaId = id;
  document.getElementById("ideaLabel").value = label;
  document.getElementById("ideaDesc").value = desc;
  openPopup("ideaPopup");
};

/* --- LISTENER FIREBASE --- */
function listenData() {
  onSnapshot(collection(db, "reminders"), (snapshot) => {
    reminderList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const r = docSnap.data();
      const li = document.createElement("li");
      li.innerHTML = `<span>${r.label}</span>
        <div class="btnGroup">
          <button onclick="editReminder('${docSnap.id}','${r.label}','${r.desc||""}')">✏️</button>
          <button onclick="deleteReminder('${docSnap.id}')">🗑️</button>
        </div>`;
      reminderList.appendChild(li);
    });
  });

  onSnapshot(collection(db, "links"), (snapshot) => {
    linkList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const l = docSnap.data();
      const li = document.createElement("li");
      li.innerHTML = `<a href="${l.url}" target="_blank">${l.label}</a>
        <div class="btnGroup">
          <button onclick="deleteLink('${docSnap.id}')">🗑️</button>
        </div>`;
      linkList.appendChild(li);
    });
  });

  onSnapshot(collection(db, "ideas"), (snapshot) => {
    ideaList.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const i = docSnap.data();
      const li = document.createElement("li");
      li.innerHTML = `<span>${i.label}</span>
        <div class="btnGroup">
          <button onclick="editIdea('${docSnap.id}','${i.label}','${i.desc||""}')">✏️</button>
          <button onclick="deleteIdea('${docSnap.id}')">🗑️</button>
        </div>`;
      ideaList.appendChild(li);
    });
  });
}
listenData();

/* --- FORMATTATORE TESTO --- */
const boldBtn = document.getElementById("boldBtn");
const highlightYellow = document.getElementById("highlightYellow");
const highlightBlue = document.getElementById("highlightBlue");
const highlightViolet = document.getElementById("highlightViolet");

function toggleFormat(button, command, value = null) {
  if (document.queryCommandState(command)) {
    document.execCommand(command, false, value);
    button.classList.remove("active");
  } else {
    document.execCommand(command, false, value);
    button.classList.add("active");
  }
}

boldBtn.onclick = () => toggleFormat(boldBtn, "bold");
highlightYellow.onclick = () => toggleFormat(highlightYellow, "hiliteColor", "yellow");
highlightBlue.onclick = () => toggleFormat(highlightBlue, "hiliteColor", "lightblue");
highlightViolet.onclick = () => toggleFormat(highlightViolet, "hiliteColor", "violet");

/* --- DARK MODE --- */
document.getElementById("darkModeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

/* --- IMPOSTAZIONI --- */
document.getElementById("settingsBtn").onclick = () => openPopup("settingsPopup");
document.getElementById("closeSettings").onclick = () => closePopup("settingsPopup");
document.getElementById("savePin").onclick = () => {
  const newPin = document.getElementById("newPin").value;
  if (newPin.trim() !== "") {
    localStorage.setItem("bachecaPin", newPin);
    alert("🔑 PIN aggiornato!");
  }
};
document.getElementById("toggleSound").onclick = function () {
  soundsOn = !soundsOn;
  this.classList.toggle("on", soundsOn);
  this.classList.toggle("off", !soundsOn);
  this.textContent = soundsOn ? "🔊 Suoni Attivi" : "🔇 Suoni Disattivi";
};
