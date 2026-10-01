document.addEventListener('DOMContentLoaded', () => {
  const roleCards = document.querySelectorAll('.role-card');
  const continueBtn = document.getElementById('continueBtn');
  let selectedRole = 'passenger'; // default selection

  // Option selection logic
  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      roleCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      selectedRole = card.getAttribute('data-role');
    });
  });

  // Continue button action
  continueBtn.addEventListener('click', () => {
    if (selectedRole === 'passenger') {
      alert('Proceeding to Passenger registration...');
    } else {
      alert('Proceeding to Driver partner application...');
    }
  });
});

let currentStep = 0;
let selectedRole = 'passenger';
let timerInterval = null;

// Screen Transition Engine
function goToStep(step) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.remove('active');
  });

  const targetScreen = document.getElementById(`step-${step}`);
  if (targetScreen) {
    targetScreen.classList.add('active');
    currentStep = step;
  }
}

function prevStep() {
  if (currentStep > 0) {
    if (currentStep === 2) clearInterval(timerInterval);
    goToStep(currentStep - 1);
  }
}

// ------------------------------------
// INITIAL SETUP & ROLE SELECTION
// ------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const passengerOption = document.getElementById('passengerOption');
  const driverOption = document.getElementById('driverOption');
  const continueBtn = document.getElementById('continueBtn');

  passengerOption.addEventListener('click', () => {
    passengerOption.classList.add('active');
    driverOption.classList.remove('active');
    selectedRole = 'passenger';
  });

  driverOption.addEventListener('click', () => {
    driverOption.classList.add('active');
    passengerOption.classList.remove('active');
    selectedRole = 'driver';
  });

  continueBtn.addEventListener('click', () => {
    if (selectedRole === 'passenger') {
      goToStep(1); // Advances to Phone Input Form
    } else {
      alert('Driver onboarding flow starting...');
    }
  });

  setupOtpInputs();
});

// ------------------------------------
// STEP 1: PHONE VALIDATION
// ------------------------------------
function handleStep1(e) {
  e.preventDefault();
  const phoneInput = document.getElementById('phone-number');
  const errorElement = document.getElementById('phone-error');
  
  let phoneValue = phoneInput.value.replace(/\D/g, '');

  if (phoneValue.startsWith('0')) {
    phoneValue = phoneValue.substring(1);
  }

  if (phoneValue.length !== 10) {
    errorElement.textContent = 'Please enter a valid 10-digit phone number (e.g., 8123456789)';
    return;
  }

  errorElement.textContent = '';
  document.getElementById('display-phone').textContent = `+234 ${phoneValue}`;
  
  goToStep(2);
  startResendTimer();
}

// ------------------------------------
// STEP 2: OTP VERIFICATION
// ------------------------------------
function startResendTimer() {
  clearInterval(timerInterval);
  let timeLeft = 59;
  const timerDisplay = document.getElementById('timer');

  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = '00:00';
    } else {
      const seconds = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
      timerDisplay.textContent = `00:${seconds}`;
      timeLeft--;
    }
  }, 1000);
}

function handleStep2(e) {
  e.preventDefault();
  const otpInputs = document.querySelectorAll('.otp-input');
  const errorElement = document.getElementById('otp-error');

  let otpValue = '';
  otpInputs.forEach((input) => {
    otpValue += input.value.trim();
  });

  if (otpValue.length !== 6 || !/^\d{6}$/.test(otpValue)) {
    errorElement.textContent = 'Please enter all 6 digits correctly.';
    return;
  }

  errorElement.textContent = '';
  clearInterval(timerInterval);
  goToStep(3);
}

// ------------------------------------
// STEP 3: PROFILE COMPLETION
// ------------------------------------
function handleStep3(e) {
  e.preventDefault();
  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const email = document.getElementById('email').value.trim();

  const fnameError = document.getElementById('fname-error');
  const lnameError = document.getElementById('lname-error');
  const emailError = document.getElementById('email-error');

  let isValid = true;

  if (firstName.length < 2) {
    fnameError.textContent = 'First name must be at least 2 letters.';
    isValid = false;
  } else {
    fnameError.textContent = '';
  }

  if (lastName.length < 2) {
    lnameError.textContent = 'Last name must be at least 2 letters.';
    isValid = false;
  } else {
    lnameError.textContent = '';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email !== '' && !emailRegex.test(email)) {
    emailError.textContent = 'Please enter a valid email address.';
    isValid = false;
  } else {
    emailError.textContent = '';
  }

  if (isValid) {
    alert('Account created successfully!');
  }
}

// ------------------------------------
// OTP AUTO-FOCUS & PASTE HANDLER
// ------------------------------------
function setupOtpInputs() {
  const otpInputs = document.querySelectorAll('.otp-input');

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      if (e.target.value.length >= 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').trim();
      if (/^\d{6}$/.test(pastedData)) {
        pastedData.split('').forEach((char, i) => {
          if (otpInputs[i]) otpInputs[i].value = char;
        });
        otpInputs[5].focus();
      }
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  const avatarInput = document.getElementById('avatar-input');
  const avatarPreview = document.getElementById('avatar-preview');
  const avatarDefaultIcon = document.getElementById('avatar-default-icon');

  if (avatarInput) {
    avatarInput.addEventListener('change', function (event) {
      const file = event.target.files[0];

      if (file) {
        // 1. Check if the selected file is an image
        if (!file.type.startsWith('image/')) {
          alert('Please select an image file (e.g. JPG, PNG).');
          return;
        }

        // 2. Read the file
        const reader = new FileReader();

        reader.onload = function (e) {
          // Set image as background of the placeholder circle
          avatarPreview.style.backgroundImage = `url('${e.target.result}')`;
          avatarPreview.style.backgroundSize = 'cover';
          avatarPreview.style.backgroundPosition = 'center';
          avatarPreview.style.backgroundRepeat = 'no-repeat';

          // Hide default emoji/icon icon inside
          if (avatarDefaultIcon) {
            avatarDefaultIcon.style.display = 'none';
          }
        };

        // 3. Convert file into DataURL string
        reader.readAsDataURL(file);
      }
    });
  }
});

// Function called when submitting Step 3 in your registration flow
function handleStep3(e) {
  e.preventDefault();

  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phoneNumber = document.getElementById('phone-number')?.value || ''; // Replace with your phone input ID

  // Retrieve avatar image preview URL (if uploaded)
  const avatarPreview = document.getElementById('avatar-preview');
  let avatarUrl = '';
  
  if (avatarPreview && avatarPreview.style.backgroundImage) {
    // Extract base64 image string from background-image property
    avatarUrl = avatarPreview.style.backgroundImage
      .replace(/^url\(["']?/, '')
      .replace(/["']?\)$/, '');
  }

  // Create the fresh user object
  const newUserData = {
    fname: firstName,
    lname: lastName,
    phone: phoneNumber,
    email: email,
    avatarUrl: avatarUrl,
    gender: '',
    location: '',
    occupation: ''
  };

  // Save the new user data (overwrites previous session data)
  localStorage.setItem('zarideUserData', JSON.stringify(newUserData));

  // Redirect to the profile page
  window.location.href = 'profile.html';
}


// Step 1 Form Handler
function handleStep1(e) {
  e.preventDefault();
  const phoneInput = document.getElementById('phone-number');
  if (phoneInput && phoneInput.value) {
    // Save phone number so Step 3 can access it
    localStorage.setItem('zaridePhone', phoneInput.value.trim());
  }
  goToStep(2); // Move to OTP step
}

// Step 3 Form Handler
function handleStep3(e) {
  e.preventDefault();

  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const emailInput = document.getElementById('email');
  const email = emailInput ? emailInput.value.trim() : '';

  // Get saved phone number
  const phoneNumber = localStorage.getItem('zaridePhone') || '';

  // Get Avatar Base64 image
  const avatarPreview = document.getElementById('avatar-preview');
  let avatarUrl = '';
  if (avatarPreview && avatarPreview.style.backgroundImage) {
    avatarUrl = avatarPreview.style.backgroundImage
      .replace(/^url\(["']?/, '')
      .replace(/["']?\)$/, '');
  }

  // Create full user profile object
  const newUserData = {
    fname: firstName,
    lname: lastName,
    phone: phoneNumber,
    email: email,
    avatarUrl: avatarUrl,
    gender: '',
    location: '',
    occupation: ''
  };

  // Save to browser storage
  localStorage.setItem('zarideUserData', JSON.stringify(newUserData));

  // Redirect to profile page
  window.location.href = 'profile.html';
}

document.addEventListener("DOMContentLoaded", () => {
  const passengerOption = document.getElementById("passengerOption");
  const driverOption = document.getElementById("driverOption");
  const continueBtn = document.getElementById("continueBtn");

  // Track the selected role (defaults to 'passenger')
  let selectedRole = "passenger";

  // Handle option selections
  passengerOption.addEventListener("click", () => {
    passengerOption.classList.add("active");
    driverOption.classList.remove("active");
    selectedRole = "passenger";
  });

  driverOption.addEventListener("click", () => {
    driverOption.classList.add("active");
    passengerOption.classList.remove("active");
    selectedRole = "driver";
  });

  // Handle Continue button click
  continueBtn.addEventListener("click", () => {
    if (selectedRole === "driver") {
      // Redirect directly to Driver Registration
      window.location.href = "driver-registration.html";
    } else {
      // Advance to Step 1 (Passenger flow)
      goToStep(1);
    }
  });
});

// Step navigation helper function
function goToStep(stepNumber) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  const targetStep = document.getElementById(`step-${stepNumber}`);
  if (targetStep) {
    targetStep.classList.add("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const passengerOption = document.getElementById("passengerOption");
  const driverOption = document.getElementById("driverOption");
  const continueBtn = document.getElementById("continueBtn");

  const formStep1 = document.getElementById("form-step-1");
  const formStep2 = document.getElementById("form-step-2");
  const formStep3 = document.getElementById("form-step-3");

  let selectedRole = "passenger";

  // --- STEP 0: CARD SELECTION ---
  if (passengerOption && driverOption) {
    passengerOption.addEventListener("click", () => {
      passengerOption.classList.add("active");
      driverOption.classList.remove("active");
      selectedRole = "passenger";
    });

    driverOption.addEventListener("click", () => {
      driverOption.classList.add("active");
      passengerOption.classList.remove("active");
      selectedRole = "driver";
    });
  }

  // CONTINUE BUTTON CLICK
  if (continueBtn) {
    continueBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("selectedRole", selectedRole);

      if (selectedRole === "driver") {
        window.location.href = "driver-registration.html";
      } else {
        goToStep(1);
      }
    });
  }

  // --- STEP 1: PHONE FORM SUBMIT ---
  if (formStep1) {
    formStep1.addEventListener("submit", (event) => {
      event.preventDefault();

      const phoneInput = document.getElementById("phone-number");
      const phoneError = document.getElementById("phone-error");
      const phoneVal = phoneInput ? phoneInput.value.trim() : "";

      if (phoneError) phoneError.innerText = "";

      if (!phoneVal) {
        if (phoneError) phoneError.innerText = "Please enter your phone number.";
        return;
      }

      if (!/^\d{10,11}$/.test(phoneVal)) {
        if (phoneError) phoneError.innerText = "Please enter a valid 10 or 11-digit phone number.";
        return;
      }

      const displayPhone = document.getElementById("display-phone");
      if (displayPhone) {
        displayPhone.innerText = `+234 ${phoneVal}`;
      }

      goToStep(2);
    });
  }

  // --- STEP 2: OTP FORM SUBMIT ---
  if (formStep2) {
    formStep2.addEventListener("submit", (event) => {
      event.preventDefault();

      const otpInputs = document.querySelectorAll(".otp-input");
      const otpError = document.getElementById("otp-error");
      let otpCode = "";

      otpInputs.forEach((input) => (otpCode += input.value.trim()));

      if (otpError) otpError.innerText = "";

      if (otpCode.length < 6) {
        if (otpError) otpError.innerText = "Please enter the full 6-digit code.";
        return;
      }

      goToStep(3);
    });
  }

  // --- STEP 3: PROFILE FORM SUBMIT ---
  if (formStep3) {
    formStep3.addEventListener("submit", (event) => {
      event.preventDefault();

      const firstName = document.getElementById("first-name").value.trim();
      const lastName = document.getElementById("last-name").value.trim();
      const fnameError = document.getElementById("fname-error");
      const lnameError = document.getElementById("lname-error");

      if (fnameError) fnameError.innerText = "";
      if (lnameError) lnameError.innerText = "";

      let valid = true;

      if (!firstName) {
        if (fnameError) fnameError.innerText = "First name is required.";
        valid = false;
      }

      if (!lastName) {
        if (lnameError) lnameError.innerText = "Last name is required.";
        valid = false;
      }

      if (!valid) return;

      const userRole = localStorage.getItem("selectedRole");
      if (userRole === "driver") {
        window.location.href = "driver-registration.html";
      } else {
        window.location.href = "index.html";
      }
    });
  }

  // OTP inputs auto-advance
  const otpInputs = document.querySelectorAll(".otp-input");
  otpInputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
      if (e.target.value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });
});

// Navigation helpers
function goToStep(stepNumber) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  const targetStep = document.getElementById(`step-${stepNumber}`);
  if (targetStep) {
    targetStep.classList.add("active");
  }
}

function prevStep() {
  const activeScreen = document.querySelector(".screen.active");
  if (!activeScreen) return;
  const currentNum = parseInt(activeScreen.id.replace("step-", ""), 10);
  if (currentNum > 0) {
    goToStep(currentNum - 1);
  }
}



document.getElementById('passengerLoginForm').addEventListener('submit', function(event) {
  // Prevent default page reloads
  event.preventDefault();

  // Save session data (if using js/auth.js)
  if (typeof setPassengerSession === 'function') {
    setPassengerSession({
      name: 'Passenger User',
      phone: document.getElementById('phoneInput')?.value || ''
    });
  }

  // Redirect to the Passenger Dashboard
  window.location.href = 'passenger/dashboard.html';
});

function handleStep3(event) {
  event.preventDefault(); // Prevents default form refresh
  
  // Verify inputs here if needed
  
  // Redirects directly to passenger dashboard:
  window.location.href = "passenger/dashboard.html";
}