document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const buttonLog = document.getElementById('order');
    const errorElement = document.getElementById('errorMessage');

    buttonLog.addEventListener('click', async (e) => {
        console.log('привет')
        // e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://edinorog007.github.io/diploma_project/admin/orders', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка входа');
            }

            const data = await response.json();
            
            // Перенаправляем после успешного входа
            window.location.href = '/orders';
            
        } catch (error) {
            errorElement.textContent = error.message;
            console.error('Login error:', error);
        }
    });
});

fetch('/admin/index', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});
