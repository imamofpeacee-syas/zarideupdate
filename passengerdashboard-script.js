/* ====================================================
   1. ANIMATED CANVAS MAP ENGINE (Zaria & ABU Main Campus)
==================================================== */
let canvas, ctx;
let selectedFare = 150;
let animationFrameId;

// Simulated Geo Nodes
const mapNodes = {
  pickup: { x: 0.35, y: 0.45, label: "Main Campus ABU" },
  drop: { x: 0.70, y: 0.75, label: "Congo Campus" },
  driver: { x: 0.15, y: 0.25, label: "Sulaiman (Driver)" }
};

let currentDriverPos = { x: 0.15, y: 0.25 };
let isRideActive = false;

function initCanvasMap() {
  canvas = document.getElementById("map-canvas");
  ctx = canvas.getContext("2d");
  
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  renderMap();
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}

function renderMap() {
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  // Clear Background
  ctx.fillStyle = "#0B1120";
  ctx.fillRect(0, 0, w, h);

  // Draw Grid/Roads Network
  ctx.strokeStyle = "#1F2937";
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Draw Main Trunk Roads
  ctx.strokeStyle = "#374151";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.2);
  ctx.lineTo(w * 0.4, h * 0.45);
  ctx.lineTo(w * 0.7, h * 0.75);
  ctx.stroke();

  // Draw Route Polyline if Active
  if (isRideActive) {
    ctx.strokeStyle = "#10B981";
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(currentDriverPos.x * w, currentDriverPos.y * h);
    ctx.lineTo(mapNodes.pickup.x * w, mapNodes.pickup.y * h);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw Passenger Pickup Marker
  drawMarker(mapNodes.pickup.x * w, mapNodes.pickup.y * h, "#10B981", "Pickup Point");

  // Draw Driver Marker
  if (isRideActive) {
    drawDriverMarker(currentDriverPos.x * w, currentDriverPos.y * h);
  }

  animationFrameId = requestAnimationFrame(renderMap);
}

function drawMarker(x, y, color, label) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#9CA3AF";
  ctx.font = "10px Plus Jakarta Sans";
  ctx.fillText(label, x + 12, y + 4);
}

function drawDriverMarker(x, y) {
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.arc(x, y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "10px sans-serif";
  ctx.fillText("🛺", x - 6, y + 4);
}

function recenterMap() {
  currentDriverPos = { x: 0.15, y: 0.25 };
}

// Initialize on Load
window.onload = initCanvasMap;

/* ====================================================
   2. FARE & PRESET LOGIC
==================================================== */
function setPreset(destination) {
  document.getElementById("drop-input").value = destination;
  calculateFare();
}

function calculateFare() {
  const dest = document.getElementById("drop-input").value;
  if (!dest) return;

  if (dest.includes("Congo") || dest.includes("PZ") || dest.includes("Kwangila")) {
    document.getElementById("price-keke").innerText = "₦300";
    document.getElementById("price-go").innerText = "₦700";
    document.getElementById("price-comfort").innerText = "₦1,200";
  } else {
    document.getElementById("price-keke").innerText = "₦150";
    document.getElementById("price-go").innerText = "₦400";
    document.getElementById("price-comfort").innerText = "₦700";
  }
}

function selectVehicle(element, name, fare) {
  document.querySelectorAll(".vehicle-item").forEach(v => v.classList.remove("selected"));
  element.classList.add("selected");
  selectedFare = fare;
}

/* ====================================================
   3. DISPATCH & TRACKING FLOW
==================================================== */
function startSearchingDriver() {
  const dest = document.getElementById("drop-input").value;
  if (!dest) {
    alert("Please select or type a destination.");
    return;
  }

  showPanel("panel-searching");

  // Simulate Driver Match after 2.5s
  setTimeout(() => {
    showPanel("panel-tracking");
    document.getElementById("sum-pickup").innerText = document.getElementById("pickup-input").value;
    document.getElementById("sum-drop").innerText = dest;
    isRideActive = true;

    // Animate Driver approaching pickup point
    let step = 0;
    const interval = setInterval(() => {
      step += 0.05;
      currentDriverPos.x = 0.15 + (mapNodes.pickup.x - 0.15) * step;
      currentDriverPos.y = 0.25 + (mapNodes.pickup.y - 0.25) * step;

      if (step >= 1) {
        clearInterval(interval);
        document.getElementById("eta-text").innerText = "Driver Has Arrived!";
      }
    }, 300);
  }, 2500);
}

function startRideTransit() {
  showPanel("panel-transit");
  document.getElementById("transit-fare").innerText = "₦" + selectedFare;

  let progress = 35;
  const interval = setInterval(() => {
    progress += 20;
    if (progress <= 100) {
      document.getElementById("transit-progress").style.width = progress + "%";
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

function finishTripAndRate() {
  showPanel("panel-booking");
  isRideActive = false;
  document.getElementById("modal-rating").classList.add("active");
}

/* ====================================================
   4. CANCEL & RATING CONTROLS
==================================================== */
function openCancelModal() {
  document.getElementById("modal-cancel").classList.add("active");
}

function closeCancelModal() {
  document.getElementById("modal-cancel").classList.remove("active");
}

function confirmCancelRide() {
  closeCancelModal();
  isRideActive = false;
  showPanel("panel-booking");
  alert("Ride request canceled.");
}

function setRating(stars) {
  document.querySelectorAll(".star").forEach((s, idx) => {
    if (idx < stars) s.classList.add("active");
    else s.classList.remove("active");
  });
}

function selectTip(element) {
  document.querySelectorAll(".t-chip").forEach(c => c.classList.remove("selected"));
  element.classList.add("selected");
}

function submitRating() {
  document.getElementById("modal-rating").classList.remove("active");
  alert("Thank you for rating your Zaride trip!");
}

/* ====================================================
   5. NAVIGATION & UTILITIES
==================================================== */
function showPanel(panelId) {
  document.querySelectorAll(".card-panel").forEach(p => p.classList.remove("active"));
  document.getElementById(panelId).classList.add("active");
}

function switchTab(tabName) {
  closeModals();
  document.querySelectorAll(".nav-item, .m-nav-item").forEach(i => i.classList.remove("active"));

  if (tabName === "history") {
    document.getElementById("modal-history").classList.add("active");
    document.getElementById("nav-history")?.classList.add("active");
    document.getElementById("m-nav-history")?.classList.add("active");
  } else if (tabName === "payment") {
    document.getElementById("modal-payment").classList.add("active");
    document.getElementById("nav-payment")?.classList.add("active");
    document.getElementById("m-nav-payment")?.classList.add("active");
  } else if (tabName === "profile") {
    document.getElementById("modal-profile").classList.add("active");
    document.getElementById("nav-profile")?.classList.add("active");
    document.getElementById("m-nav-profile")?.classList.add("active");
  } else {
    document.getElementById("nav-book")?.classList.add("active");
    document.getElementById("m-nav-book")?.classList.add("active");
  }
}

function selectPaymentMethod(methodName, element) {
  document.querySelectorAll(".pay-item").forEach(p => p.classList.remove("selected"));
  element.classList.add("selected");
  document.getElementById("selected-pay-method").innerText = methodName;
  closeModals();
}

function closeModals() {
  document.querySelectorAll(".slide-modal").forEach(m => m.classList.remove("active"));
}