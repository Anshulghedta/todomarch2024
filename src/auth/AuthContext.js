import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    //register
    const registerUser = async (formData) => {
        let config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }

        const checkUser = await fetch(`http://localhost:5000/users?email=${formData.email}`, { method: "GET" });
        if (checkUser.ok) {
            const user = await checkUser.json();
            if (user.length > 0) {
                setMessage("User already exists");
            } else {
                const response = await fetch(`http://localhost:5000/users`, config);
                if (response.status === 201) {
                    const user = await response.json();
                    localStorage.setItem("todouser", JSON.stringify(user));
                    setUser(user);
                    setMessage("User created successfully");
                    setTimeout(() => {
                        navigate("/task-list");
                    }, 3000)
                } else {
                    setMessage("something went wrong");
                }
            }
        } else {
            setMessage("something went wrong");
        }
    }


    //login

    const login = async (formData) => {

        const response = await fetch(`http://localhost:5000/users?email=${formData.email}&password=${formData.password}`, { method: "GET" });
        if (response.ok) {
            const user = await response.json();
            if (user.length > 0) {
                localStorage.setItem("todouser", JSON.stringify(user[0]))
                setUser(user[0])
                setMessage("logged in successfully");
                setTimeout(() => {
                    navigate("/task-list");
                }, 3000)
            }
        } else {
            setMessage("something went wrong, please try again");
        }
    }









    // get user on page load
    useEffect(() => {
        let local = localStorage.getItem("todouser");
        if (local) {
            let localuser = JSON.parse(local);
            setUser(localuser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            message,
            registerUser,
            login
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;