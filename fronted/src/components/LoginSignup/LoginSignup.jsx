import React, { useState } from 'react' 
import './LoginSignUp.css'


import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import phone_icon from '../assets/phone.png'
import password_icon from '../assets/password.png'

const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(true)

    const [form, setForm] = useState({
            username: '',
            email: '',
            phone_number: '',
            password: ''
        })

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const url = `http://localhost:8000${isLogin ? "/auth/login" : "/auth/register"}`;

        const body = isLogin? 
            {
                email: form.email,
                password: form.password
            } 
            : {
                username: form.username,
                email: form.email,
                phone_number: form.phone_number,
                password: form.password
            }
        
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body),
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Something went wrong. Please try again.");
                    return;
                }

                localStorage.setItem('token', data.access_token);

                setForm({
                    username: "",
                    email: "",
                    password: "",
                    phone_number: "",
                });
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            }
    }

  return (
    <div className='container'>
      <div className='header'>
        <div className="text">{isLogin?'Login':'Sign Up'}</div>
        <div className="underline"> 
        </div>
        <div className="dont-have-login">{isLogin ? "Don't have a login? " : "Already have a login? "}
            <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Click here!": "Back to Login"}</span>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="inputs">
                {!isLogin && (
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input 
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder='Username' 
                    />
                </div>
                )}
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input 
                        type="email"
                        name="email"
                        value={form.email} 
                        onChange={handleChange}
                        placeholder='Email'
                    />
                </div>
                {!isLogin &&(
                <div className="input">
                    <img src={phone_icon} alt="" />
                    <input 
                        type="tel" 
                        name='phone_number'
                        value={form.phone_number}
                        onChange={handleChange}
                        placeholder='Phone number' 
                    />
                </div>
                )}
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input 
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder='Password'
                    />
                </div>
            </div>
            <div className="submit-container">
            <button 
                type="submit" className="submit">{isLogin ? 'Login' : 'Sign Up'}
            </button>
        </div>  
        </form>
        {isLogin && (
        <div className="forgot-password">Lost Password? 
            <span> Click here!</span>
        </div>
        )}

             


      </div>
    </div>
  )
}

export default LoginSignup
