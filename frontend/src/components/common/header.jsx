
import React from "react";
import { Link,useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { MdNightlightRound } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useState } from "react";

function Header() {
    const [name,setname] = useState(()=>{
        const size = localStorage.getItem("name")
       return size?JSON.parse(size) :""
    })
    const token = JSON.parse(localStorage.getItem("token"))
    const location = useLocation()

  
    return (
        <div className="Header">
            <nav>
                <div className="nav_right">
                    <div className="logo">
                        <img src="../images/d2c16d99034f9407fd708dfc3356c688-removebg-preview.png" alt="" />
                       
                     
                    </div>
                    <div className="welocome">
                        <h2>👋 welcome {name}</h2>
                    </div>
                </div>

                <div className="nav_left">
                    <div className="link_r_L">
                        <button>/ {location.pathname.split("/")[1]}</button>
                    </div>
                    <div className="link_svg">
                        <a href="http://github.com" target="blank"><FaGithub /></a>
                        <a href="#"><FaUser /></a>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header