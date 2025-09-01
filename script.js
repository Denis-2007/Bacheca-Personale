// ELEMENTI
const pinOverlay = document.getElementById("pinOverlay");
const pinInput = document.getElementById("pinInput");
const pinSubmit = document.getElementById("pinSubmit");
const appContent = document.getElementById("appContent");
const pinError = document.getElementById("pinError");

const reminderPopup = document.getElementById("reminderPopup");
const reminderList = document.getElementById("reminderList");
const addReminderBtn = document.getElementById("addReminderBtn");
const saveReminder = document.getElementById("saveReminder");
const cancelReminder = document.getElementById("cancelReminder");
const reminderLabel = document.getElementById("reminderLabel");
const reminderDesc = document.getElementById("reminderDesc");

const viewReminderPopup = document.getElementById("viewReminderPopup");
const viewReminderLabel = document.getElementById("viewReminderLabel");
const viewReminderDesc = document.getElementById("viewReminderDesc");
const closeViewReminderBtn = document.getElementById("closeViewReminder");

let reminders = [];

// ===== PIN =====
const PIN_CORRENTE = "1234"; // esempio

pinSubmit.onclick = () => {
  if(pinInput.value === PIN_CORRENTE){
    pinOverlay.style.display = "none";
    appContent.style.display = "block";
  } else {
    pinError.textContent = "PIN errato!";
  }
};

// ===== PROMEMORIA =====
addReminderBtn.onclick = () => {
  reminderLabel.value = "";
  reminderDesc.value = "";
  reminderPopup.style.display = "flex";
};

cancelReminder.onclick = () => {
  reminderPopup.style.display = "none";
};

saveReminder.onclick = () => {
  const label = reminderLabel.value;
  const desc = reminderDesc.value;
  if(label) {
    reminders.push({label, desc});
    renderReminders();
    reminderPopup.style.display = "none";
  }
};

function renderReminders(){
  reminderList.innerHTML = "";
  reminders.forEach((r,i) => {
    const li = document.createElement("li");
    li.textContent = r.label;
    li.onclick = () => {
      viewReminderLabel.textContent = r.label;
      viewReminderDesc.textContent = r.desc;
      viewReminderPopup.style.display = "flex";
    };
    reminderList.appendChild(li);
  });
}

// ===== VISUALIZZA PROMEMORIA =====
closeViewReminderBtn.onclick = () => {
  viewReminderPopup.style.display = "none";
};
