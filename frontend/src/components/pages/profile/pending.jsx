
import React from "react";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineStar } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";

function Pending() {

    const [toggle, settoggle] = useState(false)
    const [title, settitle] = useState('')
    const [descripiton, setdescripiton] = useState('')
    const [priority, setpriority] = useState('')
    const [date, setdate] = useState('')
    const [completed, setcompleted] = useState('')
    const [id, setid] = useState('')
    const [UpUserId, setUpUserId] = useState('')
    const [TrUpdate, setTrUpdate] = useState(false)
    let [list, setlist] = useState([])
    


    useEffect(() => {
        resolve_Item()
    }, [])

    const sendDelete = async(id)=>{

        try{
            const deletApi = await fetch("http://localhost:4000/delete_item",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({id:id})
            })
            const dataDelete = await deletApi.json()
            console.log(dataDelete)
            resolve_Item()
        }catch(error){
            console.log(error)
        }
    }

    const sendUdate = async () => {

        try {
            const updateApi = await fetch("http://localhost:4000/update_item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    descripiton: descripiton,
                    priority: priority,
                    date: date,
                    completed: completed,
                    userid: UpUserId,
                    id: id
                })
            })

            const dataUp = await updateApi.json()
            console.log(dataUp)
            
             inputnone()
              settoggle(false)
              setTrUpdate(false)
              resolve_Item()

        } catch (error) {
            console.log(error)
        }
    }

    const send_task = async (e) => {
        e.preventDefault()

        if (TrUpdate) {
           
             sendUdate()
        }else{
              try {
            const allApi = await fetch("http://localhost:4000/add_item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title,
                    descripiton: descripiton,
                    priority: priority,
                    date: date,
                    completed: completed,
                    userid: JSON.parse(localStorage.getItem("id"))
                })
            })

             inputnone()

            const data = await allApi.json()
            console.log(data)
            settoggle(false)
            resolve_Item()

        } catch (error) {
            console.log(error)
        }

        }
       }

    const resolve_Item = async () => {

        try {

              const allApi = await fetch(`http://localhost:4000/show_item_pending?id=${JSON.parse(localStorage.getItem('id'))}`)

            const dataAll = await allApi.json()
            console.log(dataAll)
            setlist(dataAll.tasks)

        } catch (error) {
            console.log(error)
        }
    }



    function showInp() {
        settoggle(!toggle)
        setTrUpdate(false)
    }
    function inputnone() {
        settitle("")
        setdescripiton("")
        setpriority("")
        setdate("")
        setcompleted("")
        setUpUserId("")
        setid("")
    }

    function update(item) {
        showInp()
        console.log(item)

        setcompleted(item.completed)
        setdate(item.date)
        setdescripiton(item.descripiton)
        setid(item.id)
        setpriority(item.priority)
        settitle(item.title)
        setUpUserId(item.userid)
        setTrUpdate(true)

    }
    return (
        <div className="Pending">
            
            {toggle  ? <div className="gg">
                <div className="group_Input">
                    <i onClick={() => showInp()}><IoMdClose /></i>

                    <form action="" onSubmit={(e) => send_task(e)}>

                        <label htmlFor="title">title</label>
                        <input onChange={(e) => settitle(e.target.value)} value={title} type="text" id='title' placeholder="title" />

                        <label htmlFor="descripiton">descripiton</label>
                        <textarea onChange={(e) => setdescripiton(e.target.value)} value={descripiton} name="descripiton" id="descripiton" placeholder="descripiton" rows={5} cols={5}></textarea>

                        <div className="cont_select">
                            <label htmlFor="priority">priority</label>
                            <select onChange={(e) => setpriority(e.target.value)} value={priority} name="priority" id="priority">
                                <option value="low">low</option>
                                <option value="medium">medium</option>
                                <option value="high">high</option>

                            </select>
                        </div>

                        <label htmlFor="data">date</label>
                        <input onChange={(e) => setdate(e.target.value)} value={date} type="date" id="date" />

                        <div className="cont_select">
                            <label htmlFor="complited">complited</label>
                            <select onChange={(e) => setcompleted(e.target.value)} value={completed} name="complited" id="complited">
                                <option value="0">no</option>
                                <option value="1">yeah</option>
                            </select>
                        </div>

                        <button type="submit" >{TrUpdate?"update task":"add task"}</button>
                    </form>

                </div>
            </div> : ''}

            <div className="now_task">
                <button className="show_Inputs" onClick={() => showInp()}>add now task</button>
            </div>

            <div className="uit">

                <div className="list_tasks">
                    {list.map((item, index) => (

                        <div className="item" key={index}>
                            <h2>{item.title}</h2>
                            <p className="Pdescripiton">{item.descripiton}</p>
                            <div className="icons_edit">
                                <small>{item.date}</small>
                                <p className={item.priority == "low" ? "low" : item.priority == "medium" ? "medium" : "high"}>{item.priority}</p>
                                <i className={item.completed == 0 ? 'GoStar' : 'GoStarFill'}><MdOutlineStar /> </i>
                                <i onClick={() => update(item)} className="BiEdit"><BiEdit /></i>
                                <i className="AiFillDelete" onClick={()=>sendDelete(item.id)}><AiFillDelete /></i>
                            </div>

                        </div>

                    ))}

                </div>
            </div>
         
        </div>
    )
}

export default Pending