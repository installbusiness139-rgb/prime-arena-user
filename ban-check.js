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

// ============ CREATE BAN OVERLAY (agar already nahi hai) ============
function createBanOverlay() {
  // Check if overlay already exists
  if (document.getElementById('globalBanOverlay')) return;

  var overlay = document.createElement('div');
  overlay.id = 'globalBanOverlay';
  overlay.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.9);z-index:999999;justify-content:center;align-items:center;padding:20px;backdrop-filter:blur(5px)';

  var box = document.createElement('div');
  box.style.cssText = 'background:#0f121d;border:1px solid #ff3131;border-radius:18px;padding:30px 22px;width:100%;max-width:360px;text-align:center;box-shadow:0 10px 40px rgba(255,49,49,.3);font-family:Arial,sans-serif';

  box.innerHTML = '<div style="width:80px;height:80px;background:linear-gradient(135deg,#ff3131,#ff5252);border-radius:50%;display:flex;justify-content:center;align-items:center;font-size:40px;margin:0 auto 20px;box-shadow:0 0 30px rgba(255,49,49,.5)">🔒</div>' +
    '<div style="font-size:22px;font-weight:bold;color:#ff3131;margin-bottom:12px;letter-spacing:1px">ACCOUNT BLOCKED</div>' +
    '<div style="font-size:14px;color:#ccc;line-height:1.6;margin-bottom:25px">Your account has been <b style="color:#ffa500">blocked by admin</b>.<br>Please contact support for more information.</div>' +
    '<button id="globalBanBtn" style="width:100%;padding:15px;background:linear-gradient(135deg,#ff6b00,#ffa500);border:none;border-radius:10px;color:#fff;font-size:15px;font-weight:bold;cursor:pointer;letter-spacing:1px">OK, I UNDERSTAND</button>';

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  document.getElementById('globalBanBtn').addEventListener('click', function() {
    try {
      localStorage.removeItem('primeArenaUser');
      sessionStorage.clear();
    } catch(e) {}
    window.location.replace('login.html');
  });
}

// ============ WATCH USER FOR BAN ============
if (user && user.id) {
  // Create overlay as soon as page loads
  if (document.body) {
    createBanOverlay();
  } else {
    document.addEventListener('DOMContentLoaded', createBanOverlay);
  }

  const userRef = doc(db, "users", user.id);
  onSnapshot(userRef, function(snapshot) {
    if (snapshot.exists()) {
      var data = snapshot.data();
      if (data.isBlocked === true) {
        // Show overlay
        var overlay = document.getElementById('globalBanOverlay');
        if (overlay) {
          overlay.style.display = 'flex';
        } else {
          // Fallback - create then show
          createBanOverlay();
          setTimeout(function() {
            var o2 = document.getElementById('globalBanOverlay');
            if (o2) o2.style.display = 'flex';
          }, 100);
        }
      }
    }
  });
}
