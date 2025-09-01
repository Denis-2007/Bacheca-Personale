// PIN
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

// Dark mode
document.getElementById("darkModeToggle").onclick = () => document.body.classList.toggle("dark");

// Popup
function openPopup(popup) { popup.style.display = "flex"; }
function closePopup(popup) { popup.style.display = "none"; }

// SETTINGS
const settingsPopup = document.getElementById("settingsPopup");
document.getElementById("settingsBtn").onclick = () => openPopup(settingsPopup);
document.getElementById("savePin").onclick = () => {
  const newPin = document.getElementById("newPin").value.trim();
  if (newPin) {
    savedPin = newPin;
    localStorage.setItem("userPIN", newPin);
    alert("✅ PIN cambiato!");
    closePopup(settingsPopup);
  }
};

// ==================== PROMEMORIA ====================
const reminderList = document.getElementById("reminderList");
const addReminderBtn = document.getElementById("addReminderBtn");
const reminderPopup = document.getElementById("reminderPopup");
const viewReminderPopup = document.getElementById("viewReminderPopup");
const reminderLabelInput = document.getElementById("reminderLabel");
const reminderDescInput = document.getElementById("reminderDesc");
const saveReminderBtn = document.getElementById("saveReminder");
const cancelReminderBtn = document.getElementById("cancelReminder");
const viewReminderLabel = document.getElementById("viewReminderLabel");
const viewReminderDesc = document.getElementById("viewReminderDesc");
const closeViewReminderBtn = document.getElementById("closeViewReminder");

let reminders = [];
let editReminderIndex = null;

function loadReminders() {
  const stored = localStorage.getItem("reminders");
  reminders = stored ? JSON.parse(stored) : [];
  renderReminders();
}

function saveReminders() {
  localStorage.setItem("reminders", JSON.stringify(reminders));
}

function renderReminders() {
  reminderList.innerHTML = "";
  reminders.forEach((reminder, index) => {
    const li = document.createElement("li");
    li.textContent = reminder.label;
    li.onclick = () => {
      viewReminderLabel.textContent = reminder.label;
      viewReminderDesc.textContent = reminder.desc || "(Nessuna descrizione)";
      openPopup(viewReminderPopup);
    };

    const btnGroup = document.createElement("div");
    btnGroup.style.display = "flex";

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = (e) => {
      e.stopPropagation();
      reminderLabelInput.value = reminder.label;
      reminderDescInput.value = reminder.desc;
      editReminderIndex = index;
      openPopup(reminderPopup);
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      reminders.splice(index, 1);
      saveReminders();
      renderReminders();
    };

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(delBtn);
    li.appendChild(btnGroup);
    reminderList.appendChild(li);
  });
}

// Eventi
addReminderBtn.onclick = () => {
  reminderLabelInput.value = "";
  reminderDescInput.value = "";
  editReminderIndex = null;
  openPopup(reminderPopup);
};
saveReminderBtn.onclick = () => {
  const label = reminderLabelInput.value.trim();
  const desc = reminderDescInput.value.trim();
  if (!label) return;
  if (editReminderIndex !== null) {
    reminders[editReminderIndex] = { label, desc };
    editReminderIndex = null;
  } else {
    reminders.push({ label, desc });
  }
  saveReminders();
  renderReminders();
  closePopup(reminderPopup);
};
cancelReminderBtn.onclick = () => {
  editReminderIndex = null;
  closePopup(reminderPopup);
};

// Chiudi descrizione
closeViewReminderBtn.onclick = () => closePopup(viewReminderPopup);

// Inizializzazione
loadReminders();
