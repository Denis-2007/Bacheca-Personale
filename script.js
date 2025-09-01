// === PIN ===
let savedPin = localStorage.getItem("userPin") || "123456";
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

// === Dark Mode ===
const darkToggle = document.getElementById("darkModeToggle");
darkToggle.onclick = () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// === Suono ===
const successSound = document.getElementById("successSound");
function playSound() { successSound.play(); }

// === POPUP ===
function openPopup(id) { document.getElementById(id).style.display = "flex"; }
function closePopup(id) { document.getElementById(id).style.display = "none"; }

// === PROMEMORIA ===
const reminderList = document.getElementById("reminderList");
let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
let editReminderIndex = null;

function renderReminders() {
  reminderList.innerHTML = "";
  reminders.forEach((r, i) => {
    const li = document.createElement("li");
    li.setAttribute("data-icon", "📝");

    const label = document.createElement("span");
    label.textContent = r.label;
    label.style.flex = "1";

    // Clic sulla descrizione apre solo visualizzazione
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
      document.getElementById("reminderLabel").value = r.label;
      document.getElementById("reminderDesc").value = r.desc;
      editReminderIndex = i;
      openPopup("reminderPopup");
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "deleteBtn";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      reminders.splice(i, 1);
      localStorage.setItem("reminders", JSON.stringify(reminders));
      renderReminders();
    };

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(delBtn);
    li.appendChild(label);
    li.appendChild(btnGroup);
    reminderList.appendChild(li);
  });
}
renderReminders();

// Apre popup nuovo promemoria
document.getElementById("addReminderBtn").onclick = () => {
  document.getElementById("reminderLabel").value = "";
  document.getElementById("reminderDesc").value = "";
  editReminderIndex = null;
  openPopup("reminderPopup");
};

// Salva promemoria
document.getElementById("saveReminder").onclick = () => {
  const label = document.getElementById("reminderLabel").value.trim();
  const desc = document.getElementById("reminderDesc").value.trim();
  if (!label) return;

  if (editReminderIndex !== null) {
    reminders[editReminderIndex] = { label, desc };
    editReminderIndex = null;
  } else {
    reminders.push({ label, desc });
    playSound();
  }
  localStorage.setItem("reminders", JSON.stringify(reminders));
  renderReminders();
  closePopup("reminderPopup");
};

// Chiudi popup correttamente
document.querySelectorAll(".cancelBtn").forEach(btn => {
  btn.onclick = (e) => {
    const popup = e.target.closest(".popup");
    if (popup) popup.style.display = "none";
  };
});
