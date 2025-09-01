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

const linkPopup = document.getElementById("linkPopup");
const linkList = document.getElementById("linkList");
const addLinkBtn = document.getElementById("addLinkBtn");
const saveLinkBtn = document.getElementById("saveLink");
const cancelLinkBtn = document.getElementById("cancelLink");
const linkLabelInput = document.getElementById("linkLabel");
const linkURLInput = document.getElementById("linkURL");

const settingsPopup = document.getElementById("settingsPopup");
const settingsBtn = document.getElementById("settingsBtn");
const closeSettingsBtn = document.getElementById("closeSettings");
const savePinBtn = document.getElementById("savePin");
const newPinInput = document.getElementById("newPin");

let reminders = [];
let links = [];
let currentPIN = "1234";

// ===== PIN =====
pinSubmit.onclick = () => {
  if(pinInput.value === currentPIN){
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
cancelReminder.onclick = () => { reminderPopup.style.display = "none"; };
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
closeViewReminderBtn.onclick = () => { viewReminderPopup.style.display = "none"; };

// ===== LINK =====
addLinkBtn.onclick = () => {
  linkLabelInput.value = "";
  linkURLInput.value = "";
  linkPopup.style.display = "flex";
};
cancelLinkBtn.onclick = () => { linkPopup.style.display = "none"; };
saveLinkBtn.onclick = () => {
  const label = linkLabelInput.value;
  const url = linkURLInput.value;
  if(label && url){
    links.push({label, url});
    renderLinks();
    linkPopup.style.display = "none";
  }
};
function renderLinks(){
  linkList.innerHTML = "";
  links.forEach(l => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = l.url;
    a.target = "_blank";
    a.textContent = l.label;
    li.appendChild(a);
    linkList.appendChild(li);
  });
}

// ===== IMPOSTAZIONI PIN =====
settingsBtn.onclick = () => { settingsPopup.style.display = "flex"; };
closeSettingsBtn.onclick = () => { settingsPopup.style.display = "none"; };
savePinBtn.onclick = () => {
  if(newPinInput.value) { currentPIN = newPinInput.value; newPinInput.value = ""; settingsPopup.style.display = "none"; }
};
