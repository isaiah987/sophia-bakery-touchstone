document.addEventListener('DOMContentLoaded', () => {

  // =============================================================
  // 1. PRODUCT WISHLIST / FAVORITES FEATURE (products.html)
  // =============================================================
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  const favoritesCountEl = document.getElementById('favorites-count');

  // Retrieve stored favorites from localStorage or default to empty array
  let favorites = JSON.parse(localStorage.getItem('bakery_favorites')) || [];

  // Function to update the page UI dynamically
  function updateFavoritesUI() {
    if (favoritesCountEl) {
      favoritesCountEl.textContent = favorites.length;
    }

    favoriteButtons.forEach(button => {
      const productId = button.getAttribute('data-id');
      if (favorites.includes(productId)) {
        button.textContent = '❤️ Favorited';
        button.style.backgroundColor = '#D88C5A';
        button.style.color = '#FFF8F0';
      } else {
        button.textContent = '🤍 Add to Favorites';
        button.style.backgroundColor = '';
        button.style.color = '';
      }
    });
  }

  // Function to toggle favorite state and save to localStorage
  function toggleFavorite(productId) {
    if (favorites.includes(productId)) {
      favorites = favorites.filter(id => id !== productId);
    } else {
      favorites.push(productId);
    }
    localStorage.setItem('bakery_favorites', JSON.stringify(favorites));
    updateFavoritesUI();
  }

  // Attach event listeners to buttons
  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      toggleFavorite(productId);
    });
  });

  updateFavoritesUI();


  // =============================================================
  // 2. FORM VALIDATION & BROWSER STORAGE (contact.html)
  // =============================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const messageInput = document.getElementById('message');

  // AUTOMATIC PRE-FILL FROM LOCALSTORAGE ON PAGE LOAD
  if (nameInput) {
    const savedName = localStorage.getItem('saved_user_name');
    if (savedName) {
      nameInput.value = savedName;
      nameInput.style.borderColor = '#2E8B57';
    }
  }

  // Helper function: Display inline error message under input
  function showError(inputElement, message) {
    let errorSpan = inputElement.parentElement.querySelector('.error-msg');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = 'error-msg';
      errorSpan.style.color = '#B22222';
      errorSpan.style.fontSize = '0.85rem';
      errorSpan.style.fontWeight = 'bold';
      errorSpan.style.display = 'block';
      errorSpan.style.marginTop = '0.25rem';
      inputElement.parentElement.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    inputElement.style.borderColor = '#B22222';
    inputElement.style.backgroundColor = '#FFF0F0';
  }

  // Helper function: Clear error and show GREEN success state
  function clearError(inputElement) {
    const errorSpan = inputElement.parentElement.querySelector('.error-msg');
    if (errorSpan) errorSpan.remove();
    inputElement.style.borderColor = '#2E8B57';
    inputElement.style.backgroundColor = '#F0FFF0';
  }

  // --- VALIDATION FUNCTIONS ---

  // 1. Full Name Check (Requires first + last name, auto-capitalizes)
  function validateName() {
    if (!nameInput) return true;
    const rawName = nameInput.value.trim();
    const nameWords = rawName.split(/\s+/).filter(word => word.length > 0);

    if (!rawName) {
      showError(nameInput, 'Full name is required.');
      return false;
    } else if (nameWords.length < 2) {
      showError(nameInput, 'Please enter both your first and last name (e.g., John Smith).');
      return false;
    } else {
      // Auto-capitalize first letter of each word live on screen
      const formattedName = nameWords
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      nameInput.value = formattedName;
      clearError(nameInput);
      return true;
    }
  }

  // 2. Email Format & Typo Check
  function validateEmail() {
    if (!emailInput) return true;
    const emailValue = emailInput.value.trim().toLowerCase();
    emailInput.value = emailValue;

    // Strict Regex: requires domain name >= 2 chars AND extension >= 2 chars
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/;

    if (!emailValue) {
      showError(emailInput, 'Email address is required.');
      return false;
    } else if (!emailRegex.test(emailValue)) {
      showError(emailInput, 'Please enter a complete, valid email address (e.g., johnsmith@gmail.com).');
      return false;
    } else if (emailValue.endsWith('.co') && !emailValue.endsWith('.com')) {
      showError(emailInput, 'Did you mean .com instead of .co? Please check your email.');
      return false;
    } else {
      clearError(emailInput);
      return true;
    }
  }

  // 3. Message Length Check
  function validateMessage() {
    if (!messageInput) return true;
    const messageValue = messageInput.value.trim();
    if (messageValue.length > 0 && messageValue.length < 10) {
      showError(messageInput, 'Message must be at least 10 characters long.');
      return false;
    } else {
      clearError(messageInput);
      return true;
    }
  }

  // --- LIVE EVENT LISTENERS (Triggers immediately when clicking/tabbing away) ---
  if (nameInput) {
    nameInput.addEventListener('blur', validateName);
  }
  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
  }
  if (messageInput) {
    messageInput.addEventListener('blur', validateMessage);
  }

  // --- SUBMIT EVENT LISTENER ---
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Stop page reload

      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isMessageValid = validateMessage();

      if (isNameValid && isEmailValid && isMessageValid) {
        // Save full name to localStorage
        localStorage.setItem('saved_user_name', nameInput.value.trim());

        // Show submission alert popup
        alert(`Thank you, ${nameInput.value.trim()}! Your message has been submitted successfully.`);

        // Clear comment box after submission
        if (messageInput) messageInput.value = '';
      }
    });
  }
});