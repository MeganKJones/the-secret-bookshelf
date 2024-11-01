// Add Todo JS
const todoForm = document.getElementById('bookForm');
if (todoForm) {
    todoForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            title: data.title,
            author: data.author,
            rating: parseInt(data.rating),
            complete: data.complete === "on",
            completed_date: data.completed_date,
            published_date: data.published_date,
            genre: data.genre
        };

        try {
            const response = await fetch('/books/add-book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('access_token')}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                form.reset(); // Clear the form
            } else {
                // Handle error
                const errorData = await response.json();
                alert(`Error: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Edit Todo JS
const editTodoForm = document.getElementById('editBookForm');
if (editTodoForm) {
    editTodoForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        var url = window.location.pathname;
        const bookId = url.substring(url.lastIndexOf('/') + 1);
        console.log(data.title)
        const payload = {
            title: data.title,
            author: data.author,
            rating: parseInt(data.rating),
            complete: data.complete === "on",
            completed_date: data.completed_date,
            published_date: data.published_date,
            genre: data.genre
        };

        try {
            const token = getCookie('access_token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            console.log(`${bookId}, ${payload.completed_date}`)

            const response = await fetch(`/books/book/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                window.location.href = '/books/my_books'; // Redirect to the todo page
            } else {
                // Handle error
                const errorData = await response.json();
                alert(`Error: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });

    document.getElementById('deleteButton').addEventListener('click', async function () {
        var url = window.location.pathname;
        const todoId = url.substring(url.lastIndexOf('/') + 1);

        try {
            const token = getCookie('access_token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`/books/book/${todoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Handle success
                window.location.href = '/books/my_books'; // Redirect to the todo page
            } else {
                // Handle error
                const errorData = await response.json();
                alert(`Error: ${JSON.stringify(errorData.detail)}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });


}

// Login JS
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const payload = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            payload.append(key, value);
        }

        try {
            const response = await fetch('/auth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: payload.toString()
            });


            if (response.ok) {
                // Handle success (e.g., redirect to dashboard)
                const data = await response.json();
                // Delete any cookies available
                logout();
                // Save token to cookie
                document.cookie = `access_token=${data.access_token}; path=/`;
                window.location.href = '/books/my_books'; // Change this to your desired redirect page
            } else {
                // Handle error
                const errorData = await response.json();
                alert(`Error: ${errorData.detail}`);
                console.error('Login error:', errorData);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Register JS
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.password2) {
            alert("Passwords do not match");
            return;
        }

        const payload = {
            email: data.email,
            username: data.username,
            first_name: data.firstname,
            last_name: data.lastname,
            role: data.role,
            phone_number: data.phone_number,
            password: data.password
        };

        try {
            const response = await fetch('/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                window.location.href = '/auth/login-page';
            } else {
                // Handle error
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}


// Helper function to get a cookie by name
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

function logout() {
    // Get all cookies
    const cookies = document.cookie.split(";");

    // Iterate through all cookies and delete each one
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        // Set the cookie's expiry date to a past date to delete it
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // Redirect to the login page
    window.location.href = '/auth/login-page';
};