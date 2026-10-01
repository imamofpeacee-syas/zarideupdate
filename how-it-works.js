// Tab switcher for Passenger vs Driver steps
function switchTab(role) {
  const passengerTab = document.getElementById('passengerTab');
  const driverTab = document.getElementById('driverTab');
  
  const passengerSteps = document.getElementById('passengerSteps');
  const driverSteps = document.getElementById('driverSteps');

  if (role === 'passenger') {
    passengerTab.classList.add('active');
    driverTab.classList.remove('active');

    passengerSteps.classList.add('active');
    driverSteps.classList.remove('active');
  } else if (role === 'driver') {
    driverTab.classList.add('active');
    passengerTab.classList.remove('active');

    driverSteps.classList.add('active');
    passengerSteps.classList.remove('active');
  }
}