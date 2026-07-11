

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useState, useRef } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
import Loader from "../common/loader";

function Register() {

    const [hash, sethash] = useState(true);
    const [name, setname] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    let [token, settoken] = useState(() => {
        let size = localStorage.getItem("token")
        return size ? JSON.parse(size) : ''
    })
    const [headen, setheaden] = useState(false)
    const [atshak, setatshak] = useState(false)
    const [lodeng,setlodeng]=useState(true)
    const [butlogin,setbotlogin]=useState()



 useEffect(() => {
        if (token) {
          return  window.location.href = "/home/all"
        }
          
    }, [])

    const registerApi = async (e) => {
        e.preventDefault()

        if (name == '' || email == "" ||
            password.length < 8 ||
            !/[1-9]/.test(password)) {
            console.log('no')
            setheaden(true)
            setTimeout(() => {
                setheaden(false)
            }, 2000);

            return;
        }

        try {
            const api_regist = await fetch("http://localhost:4000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                })
            })
            setname('')
            setemail('')
            setpassword('')
            const data = await api_regist.json()
            if (data.token) {

                setatshak(true)

                setTimeout(() => {
                    setatshak(false)
                }, 2000);


                settoken(localStorage.setItem("token", JSON.stringify(data.token)))
                localStorage.setItem("name", JSON.stringify(data.name))
                localStorage.setItem("id", JSON.stringify(data.id))
                window.location.href = "/home/all"
            }

            console.log(data)

        } catch (error) {
            console.log(error)
        }

    }



    return (
        
    
            
             <div className="Register">

            <div className="respons">{!headen ? '' : headen && atshak ? <div>yeah register  <i className="Square"><FaCheckSquare /> </i></div>
                :<div>no register <i className="Close"><FaWindowClose /></i></div>  }</div>

            <div className="regist">
                <div className="title">
                    <h2>register for an account</h2>
                </div>
                <form action="" onSubmit={(e) => registerApi(e)}>
                    <label htmlFor="name">name</label>
                    <input onChange={(e) => setname(e.target.value)} value={name} type="text" placeholder="name" id="name" name="name" />

                    <label htmlFor="email">email</label>
                    <input onChange={(e) => setemail(e.target.value)} value={email} type="email" placeholder="email" id="email" name="email" />

                    <label htmlFor="password">password</label>
                    <div className="passw">
                        <input onChange={(e) => setpassword(e.target.value)} value={password} type={hash ? "password" : "text"} placeholder="password" id="password" name="password" />
                        <i className="eye" onClick={() => sethash(!hash)}>{hash ? <FaEyeSlash /> : <FaEye />}</i>

                    </div>
                    <button type="submit">Register</button>

                </form>
                <p>Do you already have an account? <Link to="/login">login</Link></p>


       



        </div>

        </div>

       

    )
}

export default Register