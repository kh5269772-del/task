
import React, { useState, useEffect } from "react";
import { IoCameraOutline } from "react-icons/io5";
import PieChartWithNeedle from "./graph";
import All from "./all";
import { PiColumnsPlusLeft } from "react-icons/pi";
import { IoMenu } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useWindowSize } from "@react-hook/window-size";
import { Link, useLocation, useParams } from "react-router-dom";
import Completed from "./completed";
import Pending from "./pending";
import Overdue from "./overdue";
import Loader from "../../common/loader";


function Home() {

    const { type } = useParams()
    let [isLodeng, setisLodeng] = useState(true)
    const [name, setname] = useState("")
    const [avatar, setavatar] = useState("")
    const [email, setemail] = useState("")
    const [toggle, settoggle] = useState(true)
    const [width, setwidth] = useState(window.innerWidth)
    const [homeDa, sethomeDa] = useState(true)
    const [widthsize, setwidthsize] = useWindowSize()
    const [g, setg] = useState('all')
    const [all, setall] = useState('')
    const [completed, setcompleted] = useState('')
    const [pending, setpending] = useState('')

    let [token, settoken] = useState(() => {

        let size = localStorage.getItem("token")
        return size ? JSON.parse(size) : ''
    })

    useEffect(() => {

        api_profilemy()

    }, [token])
    

    useEffect(() => {

        setg(type)

    }, [type])


    useEffect(() => {
        console.log(widthsize)
        if (widthsize < 650) {
            settoggle(false)
        } else {
            settoggle(true)
        }

    }, [width])


    useEffect(() => {

        const towidth = () => {

            if (window.innerWidth < 650) {
                settoggle(false)
                sethomeDa(true)

            } else {
                settoggle(true)
            }
        }


        window.addEventListener("resize", towidth)

        return () => { window.removeEventListener("resize", towidth) }
    }, [])

    useEffect(() => {
        const hhfd = async () => {
            const show_number = await fetch(`http://localhost:4000/data/number?id=${JSON.parse(localStorage.getItem("id"))}`)
            const number_data = await show_number.json()
            // console.log(number_data)
            setall(number_data.all)
            setcompleted(number_data.completed)
            setpending(number_data.pending)
            localStorage.setItem("completed",JSON.stringify(number_data.completed))
            localStorage.setItem("pending",JSON.stringify(number_data.pending))
            
        }

       setInterval(()=>{
         hhfd()
       },500)
    }, [])
    
    if (token == '') {
        localStorage.clear()
        window.location.href = "/login"
        return;
    };









    const api_profilemy = async () => {

        try {
            const profile = await fetch("http://localhost:4000/home_pto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ authHead: `Bearer ${token}` })
            })

            const dsfile = await profile.json()

            if (!profile.ok || profile.status == 402 || profile.status == 403) {
                localStorage.clear()
                window.location.href = "/login"
                return;
            }

            console.log(dsfile)
            setname(dsfile.name)
            setavatar(dsfile.avatar)
            setemail(dsfile.email)
            setisLodeng(false)



        } catch (error) {
            console.log(error)
            setisLodeng(false)
        }
    }





    function sign_out() {


        localStorage.clear()
        settoken('')
        window.location.href = '/'
    }

    if (isLodeng) {
        return <div style={{ textAlign: "center" }}>Loading...</div>
    }







    async function option_avatar(e) {
        const file = e.target.files[0]


        if (file) {

            const form_data = new FormData()
            form_data.append("avatar", file)
            form_data.append("email", email)
            try {
                const apiAvater = await fetch("http://localhost:4000/change_avatar", {
                    method: "POST",
                    body: form_data
                })
                const data = await apiAvater.json()
                console.log(data)
                setavatar(data.avatar)
            } catch (error) {
                console.log(error)
            }
        }
    }

    function show_pro() {
        settoggle(!toggle)
        sethomeDa(!homeDa)

    }
    // function ggi() {
    //     settoggle(!toggle)
    // }







    //overdue
    return (


        <div className="Home">

            {homeDa &&
                <div className="profile_center">
                    {g == 'all' ? <All /> : g == "completed" ? <Completed /> : g == 'pending' ? <Pending /> : g=='overdue'?<Overdue />:''}

                </div>
            }


            <i onClick={() => show_pro()} className="mulre">{toggle ? <IoMdClose /> : <IoMenu />}</i>

            {toggle ? <div className="pro_right">

                <div className="top_data_user">
                    <div className="avatar">
                        <img src={avatar || "../images/profile-icon-symbol-design-illustration-vector.jpg"} alt="" />
                        <label htmlFor="file"><i><IoCameraOutline /> </i></label>
                        <input type="file" onChange={(e) => option_avatar(e)} id="file" />

                        <div className="name_us">
                            <h2>hello, </h2>
                            <p>{name}</p>
                        </div>

                    </div>

                    <div className="data_tasks">

                        <div className="totle">
                            <h3>totale tasks:</h3>
                            <p>{all}</p>
                        </div>

                        <div className="in_progress">
                            <h3>in progress:</h3>
                            <p>{pending}</p>
                        </div>

                        <div className="open_tasks">
                            <h3>open tasks:</h3>
                            <p>{pending}</p>
                        </div>

                        <div className="completed">
                            <h3>completed:</h3>
                            <p>{completed}</p>
                        </div>
                    </div>
                </div>

                <div className="graph">
                    {<PieChartWithNeedle isAnimationActive={true}  />}
                </div>






                <div className="sign_out">
                    <button onClick={() => sign_out()}>sign out</button>
                </div>

            </div>
                : ""}

        </div>
    )
}

export default Home