import { db } from './firebase-init.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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

// === Dark mode toggle ===
const darkToggle = document.getElementById("darkModeToggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// === Suono ===
const successSound = document.getElementById("successSound");
function playSound() { successSound.play(); }

// === PROMEMORIA ===
const reminderPopup = document.getElementById("reminderPopup");
const viewReminderPopup = document.getElementById("viewReminderPopup");
const reminderList = document.getElementById("reminderList");
let editReminderId = null;

document.getElementById("addReminderBtn").onclick = () => {
  reminderPopup.style.display = "flex";
  document.getElementById("reminderLabel").value = "";
  document.getElementById("reminderDesc").value = "";
  editReminderId = null;
};
document.getElementById("cancelReminder").onclick = () => { reminderPopup.style.display = "none"; };

// Salvataggio promemoria
document.getElementById("saveReminder").onclick = async () => {
  const label = document.getElementById("reminderLabel").value.trim();
  const desc = document.getElementById("reminderDesc").value.trim();
  if (!label) return alert("Inserisci etichetta!");
  if (editReminderId) {
    const docRef = doc(db, "reminders", editReminderId);
    await updateDoc(docRef, { label, description: desc });
  } else {
    await addDoc(collection(db, "reminders"), { label, description: desc });
  }
  reminderPopup.style.display = "none";
  playSound();
  await loadReminders();
};

// Chiudi visualizzazione promemoria
document.getElementById("closeViewReminder").onclick = () => {
  viewReminderPopup.style.display = "none";
};

// Mostra lista promemoria
async function loadReminders() {
  reminderList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "reminders"));
  querySnapshot.forEach(docSnap => {
    const data = docSnap.data();
    const li = document.createElement("li");
    li.textContent = data.label;
    li.style.cursor = "pointer";
    li.onclick = () => {
      document.getElementById("viewReminderLabel").textContent = data.label;
      document.getElementById("viewReminderDesc").textContent = data.description;
      viewReminderPopup.style.display = "flex";
    };

    const btnGroup = document.createElement("div");
    btnGroup.className = "btnGroup";
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "editBtn";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      reminderPopup.style.display = "flex";
      document.getElementById("reminderLabel").value = data.label;
      document.getElementById("reminderDesc").value = data.description;
      editReminderId = docSnap.id;
    };
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "deleteBtn";
    deleteBtn.onclick = async (e) => {
      e.stopPropagation();
      if (confirm("Vuoi eliminare il promemoria?")) {
        await deleteDoc(doc(db, "reminders", docSnap.id));
        playSound();
        await loadReminders();
      }
    };
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    li.appendChild(btnGroup);
    reminderList.appendChild(li);
  });
}

async function loadAllData() { await loadReminders(); /* aggiungi link se serve */ }
