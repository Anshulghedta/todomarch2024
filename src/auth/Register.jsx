import React, { useState } from 'react';

function Register(props) {
    const [formData, setFormData] = useState(null);
    const [message, setMessage] = useState(null);

    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const submitForm = async (e) => {
        e.preventDefault();

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
                    setMessage("User created successfully");
                } else {
                    setMessage("something went wrong");
                }
            }
        } else {
            setMessage("something went wrong");
        }

    }

    return (
        <form>
            <div className='mb-3'>
                <label className='form-label'>Name</label>
                <input type="text" name='name' className='form-control' onChange={handleChange} />
            </div>
            <div className='mb-3'>
                <label className='form-label'>Email</label>
                <input type="text" name='email' className='form-control' onChange={handleChange} />
            </div>
            <div className='mb-3'>
                <label className='form-label'>Password</label>
                <input type="password" name='password' className='form-control' onChange={handleChange} />
            </div>

            <p>{message}</p>
            <button onClick={submitForm} className='btn btn-primary'>Register</button>
        </form>
    );
}

export default Register;