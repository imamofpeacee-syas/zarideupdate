/* ====================================================
   1. CANVAS MAP ENGINE & FLOATING BUBBLES
==================================================== */
let canvas, ctx;
let animationFrameId;

// Floating Glass Bubbles Array
const bubbles = [];
const NUM_BUBBLES = 26;

let isOnline = false;
let currentStage = "OFFLINE"; // OFFLINE, IDLE, PICKUP, WAITING, TRANSIT
let showHeatmap = false;

// Geo Nodes
const driverPos = { x: 0.20, y: 0.30 };
const pickupPos = { x: 0.45, y: 0.50, name: "Main Campus ABU Gate" };
const dropPos = { x: 0.75, y: 0.80, name: "Congo Campus" };

let requestTimerInterval;
let requestTimeLeft = 15;

function initCanvasMap() {
  canvas = document.getElementById("map-canvas");
  ctx = canvas.getContext("2d");

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  createBubbles();
  renderMap();
}

function createBubbles() {
  bubbles.length = 0;
  for (let i = 0; i < NUM_BUBBLES; i++) {
    bubbles.push({
      x: Math.random() * (canvas ? canvas.width : window.innerWidth),
      y: Math.random() * (canvas ? canvas.height : window.innerHeight),
      radius: Math.random() * 10 + 4,
      vy: -(Math.random() * 0.5 + 0.2),
      vx: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.35 + 0.15
    });
  }
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  createBubbles();
}

function renderMap() {
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  // 1. Dark Green Background Base
  ctx.fillStyle = "#021c10";
  ctx.fillRect(0, 0, w, h);

  // 2. Render Animated Floating Green Bubbles
  bubbles.forEach(b => {
    b.y += b.vy;
    b.x += b.vx;

    if (b.x < 0 || b.x > w) b.vx *= -1;
    if (b.y + b.radius < 0) {
      b.y = h + b.radius;
      b.x = Math.random() * w;
    }

    ctx.fillStyle = `rgba(52, 211, 153, ${b.opacity})`;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Grid Lines
  ctx.strokeStyle = "rgba(14, 82, 51, 0.35)";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 45) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 45) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // 4. Surge Heatmap Overlay (If Active)
  if (showHeatmap && isOnline) {
    drawHeatCircle(w * 0.45, h * 0.50, 90, "rgba(245, 158, 11, 0.25)");
    drawHeatCircle(w * 0.75, h * 0.80, 70, "rgba(239, 68, 68, 0.20)");
  }

  // 5. Main Roads Network
  ctx.strokeStyle = "rgba(16, 185, 129, 0.22)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.15);
  ctx.lineTo(w * 0.45, h * 0.50);
  ctx.lineTo(w * 0.75, h * 0.80);
  ctx.stroke();

  // 6. Draw Stage-Specific Routes & Markers
  if (isOnline) {
    // Driver Icon
    drawDriverMarker(driverPos.x * w, driverPos.y * h);

    if (currentStage === "PICKUP" || currentStage === "WAITING") {
      drawAnimatedRoute(driverPos, pickupPos, "#34D399");
      drawMarker(pickupPos.x * w, pickupPos.y * h, "#10B981", pickupPos.name);
    } else if (currentStage === "TRANSIT") {
      drawAnimatedRoute(driverPos, dropPos, "#F59E0B");
      drawMarker(dropPos.x * w, dropPos.y * h, "#EF4444", dropPos.name);
    }
  }

  animationFrameId = requestAnimationFrame(renderMap);
}

function drawHeatCircle(x, y, radius, color) {
  let grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawAnimatedRoute(from, to, color) {
  const w = canvas.width;
  const h = canvas.height;

  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(from.x * w, from.y * h);
  ctx.lineTo(to.x * w, to.y * h);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawDriverMarker(x, y) {
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "12px sans-serif";
  ctx.fillText("🛺", x - 7, y + 4);
}

function drawMarker(x, y, color, label) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#A7F3D0";
  ctx.font = "10px Plus Jakarta Sans";
  ctx.fillText(label, x + 12, y + 4);
}

function recenterMap() {
  driverPos.x = 0.20;
  driverPos.y = 0.30;
}

function toggleSurgeHeatmap() {
  showHeatmap = !showHeatmap;
}

window.onload = initCanvasMap;

/* ====================================================
   2. DRIVER STATE & ONLINE/OFFLINE CONTROLS
==================================================== */
function toggleOnlineStatus(checked) {
  isOnline = checked;
  const indicator = document.getElementById("sidebar-status-dot");
  const text = document.getElementById("sidebar-status-text");

  if (isOnline) {
    indicator.classList.add("online");
    text.innerText = "ONLINE";
    showPanel("panel-online-idle");
    currentStage = "IDLE";

    // Simulate incoming ride after 3.5s
    setTimeout(simulateIncomingRequest, 3500);
  } else {
    indicator.classList.remove("online");
    text.innerText = "OFFLINE";
    showPanel("panel-offline");
    currentStage = "OFFLINE";
  }
}

function triggerOnlineFromPanel() {
  document.getElementById("driver-status-toggle").checked = true;
  toggleOnlineStatus(true);
}

/* ====================================================
   3. RIDE REQUEST DISPATCH FLOW
==================================================== */
function simulateIncomingRequest() {
  if (!isOnline || currentStage !== "IDLE") return;

  document.getElementById("modal-request").classList.add("active");
  requestTimeLeft = 15;
  const fill = document.getElementById("request-timer-fill");

  requestTimerInterval = setInterval(() => {
    requestTimeLeft -= 0.1;
    fill.style.width = (requestTimeLeft / 15) * 100 + "%";

    if (requestTimeLeft <= 0) {
      clearInterval(requestTimerInterval);
      declineRequest();
    }
  }, 100);
}

function acceptRequest() {
  clearInterval(requestTimerInterval);
  document.getElementById("modal-request").classList.remove("active");
  currentStage = "PICKUP";
  showPanel("panel-enroute-pickup");

  // Animate driver moving toward pickup
  let step = 0;
  const interval = setInterval(() => {
    step += 0.05;
    driverPos.x = 0.20 + (pickupPos.x - 0.20) * step;
    driverPos.y = 0.30 + (pickupPos.y - 0.30) * step;

    if (step >= 1) clearInterval(interval);
  }, 200);
}

function declineRequest() {
  clearInterval(requestTimerInterval);
  document.getElementById("modal-request").classList.remove("active");
  currentStage = "IDLE";
}

/* ====================================================
   4. ACTIVE TRIP STAGE CONTROLS
==================================================== */
function arriveAtPickup() {
  currentStage = "WAITING";
  showPanel("panel-waiting-rider");

  let seconds = 105;
  const timerElem = document.getElementById("wait-timer");
  const waitInterval = setInterval(() => {
    seconds--;
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    timerElem.innerText = `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;

    if (seconds <= 0 || currentStage !== "WAITING") clearInterval(waitInterval);
  }, 1000);
}

function startRideTransit() {
  currentStage = "TRANSIT";
  showPanel("panel-in-transit");

  let progress = 10;
  const fill = document.getElementById("trip-progress-fill");

  const interval = setInterval(() => {
    progress += 15;
    fill.style.width = progress + "%";

    driverPos.x = pickupPos.x + (dropPos.x - pickupPos.x) * (progress / 100);
    driverPos.y = pickupPos.y + (dropPos.y - pickupPos.y) * (progress / 100);

    if (progress >= 100) clearInterval(interval);
  }, 800);
}

function completeTripAndCollect() {
  document.getElementById("modal-fare-summary").classList.add("active");
}

function finishFareCollection() {
  document.getElementById("modal-fare-summary").classList.remove("active");
  currentStage = "IDLE";
  showPanel("panel-online-idle");
  recenterMap();

  // Simulate next ride request after 5s
  setTimeout(simulateIncomingRequest, 5000);
}

/* ====================================================
   5. UTILITIES, MODALS & RATINGS
==================================================== */
function showPanel(panelId) {
  document.querySelectorAll(".card-panel").forEach(p => p.classList.remove("active"));
  document.getElementById(panelId).classList.add("active");
}

function switchTab(tabName) {
  closeModals();
  document.querySelectorAll(".nav-item, .m-nav-item").forEach(i => i.classList.remove("active"));

  if (tabName === "earnings") {
    document.getElementById("modal-earnings").classList.add("active");
    document.getElementById("nav-earnings")?.classList.add("active");
    document.getElementById("m-nav-earnings")?.classList.add("active");
  } else if (tabName === "history") {
    document.getElementById("modal-history").classList.add("active");
    document.getElementById("nav-history")?.classList.add("active");
    document.getElementById("m-nav-history")?.classList.add("active");
  } else if (tabName === "performance") {
    document.getElementById("modal-performance").classList.add("active");
    document.getElementById("nav-performance")?.classList.add("active");
  } else if (tabName === "vehicle") {
    document.getElementById("modal-vehicle").classList.add("active");
    document.getElementById("nav-vehicle")?.classList.add("active");
    document.getElementById("m-nav-vehicle")?.classList.add("active");
  } else {
    document.getElementById("nav-dashboard")?.classList.add("active");
    document.getElementById("m-nav-dashboard")?.classList.add("active");
  }
}

function closeModals() {
  document.querySelectorAll(".slide-modal").forEach(m => m.classList.remove("active"));
}

function openCancelModal() { document.getElementById("modal-cancel").classList.add("active"); }
function closeCancelModal() { document.getElementById("modal-cancel").classList.remove("active"); }

function confirmCancelRide() {
  closeCancelModal();
  currentStage = "IDLE";
  showPanel("panel-online-idle");
  recenterMap();
}

function setPassengerRating(stars) {
  document.querySelectorAll(".star").forEach((s, idx) => {
    if (idx < stars) s.classList.add("active");
    else s.classList.remove("active");
  });
}

function triggerSOS() {
  alert("🚨 EMERGENCY SOS ACTIVATED! Campus Security and Emergency Contact notified with live GPS pin.");
}

function callRider() { alert("Calling Passenger Zainab A. (+234 801 234 5678)..."); }
function chatRider() { alert("In-app chat window opened with passenger."); }