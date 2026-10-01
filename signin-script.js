document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const passengerTab = document.getElementById('passengerTab');
  const driverTab = document.getElementById('driverTab');
  const submitBtn = document.getElementById('submitBtn');

  const usePhoneBtn = document.getElementById('usePhoneBtn');
  const useEmailBtn = document.getElementById('useEmailBtn');
  const phoneGroup = document.getElementById('phoneGroup');
  const emailGroup = document.getElementById('emailGroup');
  const phoneNumber = document.getElementById('phoneNumber');
  const emailAddress = document.getElementById('emailAddress');

  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');

  let currentRole = 'passenger';

  // 1. Role Toggle (Passenger vs Driver)
  passengerTab.addEventListener('click', () => {
    passengerTab.classList.add('active');
    driverTab.classList.remove('active');
    currentRole = 'passenger';
    submitBtn.textContent = 'Sign In as Passenger';
  });

  driverTab.addEventListener('click', () => {
    driverTab.classList.add('active');
    passengerTab.classList.remove('active');
    currentRole = 'driver';
    submitBtn.textContent = 'Sign In to Driver Portal';
  });

  // 2. Input Mode Switcher (Phone vs Email)
  usePhoneBtn.addEventListener('click', () => {
    usePhoneBtn.classList.add('active');
    useEmailBtn.classList.remove('active');
    phoneGroup.classList.remove('hidden');
    emailGroup.classList.add('hidden');
    phoneNumber.required = true;
    emailAddress.required = false;
  });

  useEmailBtn.addEventListener('click', () => {
    useEmailBtn.classList.add('active');
    usePhoneBtn.classList.remove('active');
    emailGroup.classList.remove('hidden');
    phoneGroup.classList.add('hidden');
    emailAddress.required = true;
    phoneNumber.required = false;
  });

  // 3. Password Visibility Toggle
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    togglePasswordBtn.textContent = isPassword ? 'Hide' : 'Show';
  });

  // 4. Form Submission Simulation
  document.getElementById('signinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`Successfully signed in as ${currentRole.toUpperCase()}! Directing to dashboard...`);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const passengerTab = document.getElementById('passengerTab');
  const driverTab = document.getElementById('driverTab');
  const submitBtn = document.getElementById('submitBtn');

  const usePhoneBtn = document.getElementById('usePhoneBtn');
  const useEmailBtn = document.getElementById('useEmailBtn');
  const phoneGroup = document.getElementById('phoneGroup');
  const emailGroup = document.getElementById('emailGroup');
  const phoneNumber = document.getElementById('phoneNumber');
  const emailAddress = document.getElementById('emailAddress');

  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const signinForm = document.getElementById('signinForm');

  let currentRole = 'passenger';

  // 1. Role Toggle (Passenger vs Driver)
  passengerTab.addEventListener('click', () => {
    passengerTab.classList.add('active');
    driverTab.classList.remove('active');
    currentRole = 'passenger';
    submitBtn.textContent = 'Sign In as Passenger';
  });

  driverTab.addEventListener('click', () => {
    driverTab.classList.add('active');
    passengerTab.classList.remove('active');
    currentRole = 'driver';
    submitBtn.textContent = 'Sign In to Driver Portal';
  });

  // 2. Input Mode Switcher (Phone vs Email)
  usePhoneBtn.addEventListener('click', () => {
    usePhoneBtn.classList.add('active');
    useEmailBtn.classList.remove('active');
    phoneGroup.classList.remove('hidden');
    emailGroup.classList.add('hidden');
    phoneNumber.required = true;
    emailAddress.required = false;
  });

  useEmailBtn.addEventListener('click', () => {
    useEmailBtn.classList.add('active');
    usePhoneBtn.classList.remove('active');
    emailGroup.classList.remove('hidden');
    phoneGroup.classList.add('hidden');
    emailAddress.required = true;
    phoneNumber.required = false;
  });

  // 3. Password Visibility Toggle
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.getAttribute('type') === 'password';
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    togglePasswordBtn.textContent = isPassword ? 'Hide' : 'Show';
  });

  // Helper function to handle inline error messages
  function showFieldError(inputElement, message) {
    let existingError = inputElement.parentElement.parentElement.querySelector('.error-msg');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-msg';
    errorDiv.style.color = '#EA4335';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    inputElement.parentElement.parentElement.appendChild(errorDiv);
    inputElement.style.borderColor = '#EA4335';
  }

  function clearFieldError(inputElement) {
    let existingError = inputElement.parentElement.parentElement.querySelector('.error-msg');
    if (existingError) existingError.remove();
    inputElement.style.borderColor = '';
  }

  // 4. Form Submission & Wrong Password Detection Simulation
  signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFieldError(passwordInput);

    const enteredPassword = passwordInput.value;
    const correctMockPassword = "password123"; // Mock password for testing simulation

    // Check if wrong password is inserted
    if (enteredPassword !== correctMockPassword) {
      showFieldError(passwordInput, 'Incorrect password. Please try again or click "Forgot Password?".');
      passwordInput.focus();
      return;
    }

    // Success flow
    alert(`Successfully signed in as ${currentRole.toUpperCase()}! Directing to dashboard...`);
  });

  // 5. Social Logins (Google & Apple popup simulation)
  const socialButtons = document.querySelectorAll('.btn-social');
  
  socialButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const provider = index === 0 ? 'Google' : 'Apple';
      
      // Simulating native application popup behavior window
      const popupWidth = 500;
      const popupHeight = 600;
      const left = (window.innerWidth - popupWidth) / 2;
      const top = (window.innerHeight - popupHeight) / 2;
      
      const authWindow = window.open(
        '', 
        `Sign in with ${provider}`, 
        `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`
      );

      if (authWindow) {
        authWindow.document.write(`
          <html lang="en">
            <head><title>Sign in with ${provider} - Zaride</title></head>
            <body style="font-family:sans-serif; text-align:center; padding-top:50px; background-color:#f9f9f9;">
              <h2 style="color:#333;">Logging in with ${provider}</h2>
              <p style="color:#666;">Please complete authorization in the secure popup...</p>
              <div style="margin-top:30px; font-size:14px; color:#008751;">Secure connection established</div>
            </body>
          </html>
        `);

        // Close simulated popup automatically after 2 seconds and log in user
        setTimeout(() => {
          authWindow.close();
          alert(`Successfully authenticated via ${provider}! Redirecting to Zaride dashboard...`);
        }, 2000);
      } else {
        alert(`Pop-up blocked by browser. Proceeding with standard ${provider} authentication redirect.`);
      }
    });
  });
});