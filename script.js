document.addEventListener('DOMContentLoaded', () => {
  // =============================================================
  // 1. PRODUCT WISHLIST / FAVORITES FEATURE (products.html)
  // =============================================================
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  const favoritesCountEl = document.getElementById('favorites-count');

  // Array of available products (Data structure requirement)
  const bakeryCatalog = [
    { id: 'sourdough', name: 'Artisan Sourdough' },
    { id: 'baguette', name: 'French Baguette' },
    { id: 'cinnamon-roll', name: 'Cinnamon Roll' }
  ];

  // Retrieve stored array from localStorage or default to empty array
  let favorites = JSON.parse(localStorage.getItem('bakery_favorites')) || [];

  // Function to update the page display dynamically
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

  // Function to toggle favorite state and update storage
  function toggleFavorite(productId) {
    if (favorites.includes(productId)) {
      favorites = favorites.filter(id => id !== productId);
    } else {
      favorites.push(productId);
    }
    // Save state to Browser Storage
    localStorage.setItem('bakery_favorites', JSON.stringify(favorites));
    updateFavoritesUI();
  }

  // Attach event listeners to favorite buttons
  favoriteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      toggleFavorite(productId);
    });
  });

  // Load favorites on initial page render
  updateFavoritesUI();


  // =============================================================
  // 2. JAVASCRIPT FORM VALIDATION (contact.html)
  // =============================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const messageInput = document.getElementById('message');

  // Pre-fill remembered name from localStorage if available
  if (nameInput && localStorage.getItem('saved_user_name')) {
    nameInput.value = localStorage.getItem('saved_user_name');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default submission
      let isValid = true;

      // Helper function: Display custom error message near field
      function showError(inputElement, message) {
        let errorSpan = inputElement.parentElement.querySelector('.error-msg');
        if (!errorSpan) {
          errorSpan = document.createElement('span');
          errorSpan.className = 'error-msg';
          errorSpan.style.color = '#B22222';
          errorSpan.style.fontSize = '0.85rem';
          errorSpan.style.display = 'block';
          errorSpan.style.marginTop = '0.25rem';
          inputElement.parentElement.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        inputElement.style.borderColor = '#B22222';
      }

      // Helper function: Clear error message
      function clearError(inputElement) {
        const errorSpan = inputElement.parentElement.querySelector('.error-msg');
        if (errorSpan) errorSpan.remove();
        inputElement.style.borderColor = '';
      }

      // Validation 1: Required Name
      if (!nameInput.value.trim()) {
        showError(nameInput, 'Full name is required.');
        isValid = false;
      } else {
        clearError(nameInput);
      }

      // Validation 2: Email Format Check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, 'Email address is required.');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email format (e.g., name@domain.com).');
        isValid = false;
      } else {
        clearError(emailInput);
      }

      // Validation 3: Minimum Length Check on Message
      if (messageInput && messageInput.value.trim().length < 10) {
        showError(messageInput, 'Message must be at least 10 characters long.');
        isValid = false;
      } else if (messageInput) {
        clearError(messageInput);
      }

      // If valid, save user name to localStorage and confirm
      if (isValid) {
        localStorage.setItem('saved_user_name', nameInput.value.trim());
        alert('Thank you! Your message has been submitted successfully.');
        contactForm.reset();
      }
    });
  }
}); 