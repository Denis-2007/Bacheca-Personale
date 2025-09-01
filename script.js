// FIREBASE
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD2GGWWPn5P2xgw7YGWiJ5ZUXFRbHJkVy4",
  authDomain: "bacheca-presonale.firebaseapp.com",
  databaseURL: "https://bacheca-presonale-default-rtdb.firebaseio.com/",
  projectId: "bacheca-presonale",
  storageBucket: "bacheca-presonale.appspot.com",
  messagingSenderId: "147412610802",
  appId: "1:147412610802:web:b7cddfbf3a11c312576a6b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Sincronizzazione promemoria
const reminderList = document.getElementById("reminderList");
document.getElementById("saveReminder").addEventListener("click", () => {
  const label = document.getElementById("reminderLabel").value.trim();
  const desc = document.getElementById("reminderDesc").value.trim();
  if (label) push(ref(db, "promemoria"), { label, desc, date: new Date().toISOString() });
});
onValue(ref(db, "promemoria"), (snapshot) => {
  reminderList.innerHTML = "";
  snapshot.forEach((child) => {
    const r = child.val();
    const li = document.createElement("li");
    li.setAttribute("data-icon", "📝");
    li.textContent = r.label;
    li.onclick = () => {
      document.getElementById("viewReminderLabel").textContent = r.label;
      document.getElementById("viewReminderDesc").textContent = r.desc || "(Nessuna descrizione)";
      openPopup("viewReminderPopup");
    };
    reminderList.appendChild(li);
  });
});

// Sincronizzazione link
const linkList = document.getElementById("linkList");
document.getElementById("saveLink").addEventListener("click", () => {
  const label = document.getElementById("label").value.trim();
  const url = document.getElementById("url").value.trim();
  if (label && url) push(ref(db, "link"), { label, url });
});
onValue(ref(db, "link"), (snapshot) => {
  linkList.innerHTML = "";
  snapshot.forEach((child) => {
    const l = child.val();
    const li = document.createElement("li");
    li.setAttribute("data-icon", "🔗");
    const a = document.createElement("a");
    a.href = l.url;
    a.textContent = l.label;
    a.target = "_blank";
    li.appendChild(a);
    linkList.appendChild(li);
  });
});
