document.addEventListener('DOMContentLoaded', () => {

  // =============================================================
  // 1. PRODUCT WISHLIST / FAVORITES FEATURE (products.html)
  // =============================================================
  const favoriteButtons = document.querySelectorAll('.favorite-btn');
  const favoritesCountEl = document.getElementById('favorites-count');

  // Array of objects (Data Structure Requirement)
  const bakeryCatalog = [
    { id: 'sourdough', name: 'Classic Artisan Bread' },
    { id: 'baguette', name: 'Signature Seeded Loaf' }
  ];

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
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Stop default HTML submission
      let isValid = true;

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
      }

      // Helper function: Remove inline error message
      function clearError(inputElement) {
        const errorSpan = inputElement.parentElement.querySelector('.error-msg');
        if (errorSpan) errorSpan.remove();
        inputElement.style.borderColor = '';
      }

      // 1. FULL NAME VALIDATION (Required, min 2 names, auto-capitalizes)
      const rawName = nameInput.value.trim();
      const nameWords = rawName.split(/\s+/).filter(word => word.length > 0);

      if (!rawName) {
        showError(nameInput, 'Full name is required.');
        isValid = false;
      } else if (nameWords.length < 2) {
        showError(nameInput, 'Please enter both your first and last name (e.g., John Smith).');
        isValid = false;
      } else {
        // Auto-capitalize first letter of each word
        const formattedName = nameWords
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        nameInput.value = formattedName;
        clearError(nameInput);
      }

      // 2. EMAIL FORMAT VALIDATION
      const emailValue = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailValue) {
        showError(emailInput, 'Email address is required.');
        isValid = false;
      } else if (!emailRegex.test(emailValue)) {
        showError(emailInput, 'Please enter a valid email format (e.g., name@domain.com).');
        isValid = false;
      } else {
        clearError(emailInput);
      }

      // 3. MESSAGE LENGTH CHECK (Triggers error ONLY if text is entered and is < 10 chars)
      if (messageInput) {
        const messageValue = messageInput.value.trim();
        if (messageValue.length > 0 && messageValue.length < 10) {
          showError(messageInput, 'Message must be at least 10 characters long.');
          isValid = false;
        } else {
          clearError(messageInput);
        }
      }

      // SUCCESSFUL SUBMISSION
      if (isValid) {
        // Save formatted name to localStorage
        localStorage.setItem('saved_user_name', nameInput.value.trim());
        
        // Show submission alert
        alert('Thank you! Your message has been submitted successfully.');
        
        // Clear message box, keep auto-filled name ready for next time
        if (messageInput) messageInput.value = '';
      }
    });
  }
});