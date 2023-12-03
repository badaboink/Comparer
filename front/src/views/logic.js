import jwt_decode from "jwt-decode";

export function isLoggedIn() {
    const token = localStorage.getItem('token');
    if(token != null)
    {
        const decoded = jwt_decode(token);
        const isTokenExpired = Date.now() >= decoded.exp * 1000;
    
        if (isTokenExpired) {
            localStorage.clear();
            return false;
        }
    }
    return token !== null && token !== "";
}

export function isAdmin(){
    const token = localStorage.getItem('token');
    if (token !== null)
    {
        const decoded = jwt_decode(token);
        if (decoded.role === "Admin")
        {
            return true;
        }
    }
    return false;
}

export function getUsername(){
    const token = localStorage.getItem('token');
    if (token !== null)
    {
        const decoded = jwt_decode(token);
        return decoded.username;
    }
    return null;
}

export function isOwner(username){
    const token = localStorage.getItem('token');
    if (token !== null)
    {
        const decoded = jwt_decode(token);
        if(username === decoded.username)
        {
            return true;
        }
        else {
            if(isAdmin())
            {
                return true;
            }
        }
    }
    return false;
}