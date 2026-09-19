/**
 * Countdown timer for trip departure
 * Updates the #countdownValue element in the UI
 */
const tripStart = new Date('2027-03-16T00:00:00');

function updateCountdown() {
  const remaining = tripStart.getTime() - Date.now();
  const value = document.querySelector('#countdownValue');

  if (!value) return;

  if (remaining <= 0 && remaining > -604800000) {
    value.textContent = 'You are on the trip';
    return;
  }

  if (remaining <= -604800000) {
    value.textContent = 'Trip complete';
    return;
  }

  const days = Math.ceil(remaining / 86400000);
  value.textContent = `${days} ${days === 1 ? 'day' : 'days'} to go`;
}

// Auto-initialize when module is loaded
updateCountdown();