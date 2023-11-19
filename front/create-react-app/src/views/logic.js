export function isLoggedIn() {
    const token = localStorage.getItem('token');
    return token !== null && token !== ""; // Check if the token is not null and not an empty string
}