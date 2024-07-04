const token = localStorage.getItem('token');

if (!token){
    window.location.href = '/login'
} else {
    const response = fetch(`http://localhost:3000/${token}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        localStorage.clear();
        window.location.href = '/login'
    }
}