
import React from "react";
import { AiOutlineAppstore } from "react-icons/ai";
import { PiCheckSquareOffsetLight } from "react-icons/pi";
import { TbClockCheck } from "react-icons/tb";
import { LuSquareSlash } from "react-icons/lu";
import { useState } from "react";
import All from "../pages/profile/all";

import { Link, useParams, useLocation } from "react-router-dom";

function After() {
    const location = useLocation()
    let [metha, setmetha] = useState(location.pathname.split("/")[2])

    const token = JSON.parse(localStorage.getItem("token"))

    function clickLinks(id) {
        if (!token) {
            return;
        }

        setmetha(id)
    }

    return (
        <div className="After">
            <div className="lesticons">

                <div className="won" > <Link to={token ? "/home/all" : "/login"} onClick={() => clickLinks('all')} className={metha == 'all' ? 'acolo' : ''} ><i><AiOutlineAppstore /></i></Link> <p>all</p></div>

                <div className="tow" ><Link to={token ? "/home/completed" : "/login"} onClick={() => clickLinks('completed')} className={metha == 'completed' ? 'acolo' : ''}  ><i><PiCheckSquareOffsetLight /></i></Link><p>complete</p></div>

                <div className="thre" > <Link to={token ? "/home/pending" : "/login"} onClick={() => clickLinks('pending')} className={metha == 'pending' ? 'acolo' : ''}  ><i><TbClockCheck /></i></Link><p>pending</p></div>

                <div className="for" ><Link to={token ? "/home/overdue" : "/login"} onClick={() => clickLinks('overdue')} className={metha == 'overdue' ? 'acolo' : ''} ><i><LuSquareSlash /></i></Link><p>overdue</p></div>
            </div>

        </div>
    )
}

// {!clickNow?"#":window.location.href == "http://localhost:3000/home"?"#":"/home"}

export default After 