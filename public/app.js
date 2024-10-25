document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const loginForm = document.getElementById('login-form');
    const userMessage = document.getElementById('user-message');
    const loginMessage = document.getElementById('login-message');

    // Creare cont
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                userMessage.textContent = 'Contul a fost creat cu succes!';
                userForm.reset();
            } else {
                userMessage.textContent = result.message; // Mesaj de eroare
            }
        } catch (error) {
            console.error('Eroare de rețea!', error);
            userMessage.textContent = 'Eroare la trimiterea formularului!';
        }
    });

    // Conectare
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                loginMessage.textContent = result.message; // Mesaj de succes
                loginForm.reset();
            } else {
                loginMessage.textContent = result.message; // Mesaj de eroare
            }
        } catch (error) {
            console.error('Eroare de rețea!', error);
            loginMessage.textContent = 'Eroare la trimiterea formularului!';
        }
    });

    // Pop-up pentru newsletter
    const subscribePopup = document.getElementById('subscribe-popup');
    const subscribeBtn = document.getElementById('subscribe-btn');
    const closeButton = document.querySelector('.close-button');
    const neverShowBtn = document.getElementById('never-show');
    const newsletterEmail = document.getElementById('newsletter-email');

    // Afișare pop-up
    setTimeout(() => {
        if (!localStorage.getItem('newsletterSubscribed')) {
            subscribePopup.style.display = 'block';
        }
    }, 2000);

    // Abonare newsletter
    subscribeBtn.addEventListener('click', () => {
        const email = newsletterEmail.value;
        if (email) {
            localStorage.setItem('newsletterEmail', email);
            localStorage.setItem('newsletterSubscribed', true);
            alert('Te-ai abonat cu succes la newsletter!');
            subscribePopup.style.display = 'none';
        } else {
            alert('Te rog introdu un email valid.');
        }
    });

    // Închidere pop-up
    closeButton.addEventListener('click', () => {
        subscribePopup.style.display = 'none';
    });

    // Nu mai arăta pop-up
    neverShowBtn.addEventListener('click', () => {
        localStorage.setItem('newsletterSubscribed', true);
        subscribePopup.style.display = 'none';
    });
});
