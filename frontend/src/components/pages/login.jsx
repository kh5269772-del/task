

import React from "react";
import { Link } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useState, useRef } from "react";
import { specialCharMap } from "@testing-library/user-event/dist/keyboard";
import { FaCheckSquare } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";

function Login() {
    const [hash, sethash] = useState(true)
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [headen, setheaden] = useState(false)
    const [atshak, setatshak] = useState(false)


    const send_login = async (e) => {
        e.preventDefault()

        try {
            const api = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })


            const data = await api.json()
            console.log(data)
            if (data.token) {

                setatshak(true)
                setTimeout(() => {
                    setatshak(false)
                }, 2000);

                localStorage.setItem("token", JSON.stringify(data.token))
                localStorage.setItem("name", JSON.stringify(data.name))
                localStorage.setItem("id", JSON.stringify(data.id))
                window.location.href = '/home/all'
            } else {
                setheaden(true)
                setTimeout(() => {
                    setheaden(false)
                }, 2000);

                return;
            }
        } catch (error) {
            console.log(error)
            setheaden(true)
            setTimeout(() => {
                setheaden(false)
            }, 2000);

            return;

        }
    }

    return (
        <div className="Login">
            <div className="respons">{!headen ? '' : headen && atshak ? <div>yeah register  <i className="Square"><FaCheckSquare /> </i></div>
                : <div>no register <i className="Close"><FaWindowClose /></i></div>}</div>

            <div className="regist">
                <div className="title">
                    <h2>login to your account</h2>
                </div>
                <form action="" onSubmit={(e) => send_login(e)}>
                    <label htmlFor="email">email</label>
                    <input onChange={(e) => setemail(e.target.value)} value={email} type="email" placeholder="email" id="email" name="email" />

                    <label htmlFor="password">password</label>
                    <div className="passw">
                        <input onChange={(e) => setpassword(e.target.value)} value={password} type={hash ? "password" : "text"} placeholder="password" id="password" name="password" />
                        <i className="eye" onClick={() => sethash(!hash)}>{hash ? <FaEyeSlash /> : <FaEye />}</i>

                    </div>
                    <button type="submit">Login</button>

                </form>
                <p>Don't have an account? <Link to="/">register</Link></p>


            </div>



        </div>
    )
}

export default Login