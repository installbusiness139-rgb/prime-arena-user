import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyC22oO0eveUN3GL9WNtJSzdKghN-X67ZmU",
authDomain: "prime-arena-a302b.firebaseapp.com",
projectId: "prime-arena-a302b",
storageBucket: "prime-arena-a302b.firebasestorage.app",
messagingSenderId: "118236794000",
appId: "1:118236794000:web:cd0e5bf7503b72f1cf5c15",
measurementId: "G-EQJP1D9C92"
};

var app;
try {
if (getApps().length === 0) {
app = initializeApp(firebaseConfig);
} else {
app = getApps()[0];
}
} catch(e) {
app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);

var user = {};
try {
user = JSON.parse(localStorage.getItem('primeArenaUser') || '{}');
} catch(e) {
user = {};
}

if (user && user.id) {
const userRef = doc(db, "users", user.id);
onSnapshot(userRef, function(snapshot) {
if (snapshot.exists()) {
var data = snapshot.data();
if (data.isBlocked === true) {
try {
localStorage.removeItem('primeArenaUser');
sessionStorage.clear();
} catch(e) {}
alert('Your account has been blocked by admin. Please contact support.');
window.location.replace('login.html');
}
}
});
           }
