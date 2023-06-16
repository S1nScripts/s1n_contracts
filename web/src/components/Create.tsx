import React, {useState} from 'react';
import './App.css'
// import {debugData} from "../utils/debugData";
// import {fetchNui} from "../utils/fetchNui";

import dollarIcon from '../images/dollaricon.png'
import plusIcon from '../images/plusIcon.png'
import date from '../images/date.png'
import { useNuiEvent } from '../hooks/useNuiEvent';
import { fetchNui } from '../utils/fetchNui';

const Create: React.FC = () => {
    


  // States
  const [Title , setTitle] = useState("")
  const [Details , setDetails] = useState("")
  const [Conditions , setConditions] = useState("")
  const [Awards , setAwards] = useState('')
  const [DateState , setDate] = useState('')

  const [activeUsers , setactiveUsers] = useState<any | null>([])


  useNuiEvent<any>("getPlayers", (data) => {
    let table:any = []                      
    data.map((e:any) => {
        table.push({PlayerName: e.PlayerName, Id: e.Id, Added: false})
    })
    setactiveUsers(table)
  });

  // Functions
  function AddPlayer(data: any) {
    let Index = activeUsers.findIndex((item:any) => item.Id === data.Id)
    const array = [... activeUsers]
    array[Index].Added = true
    setactiveUsers(array)   
  }

  function cleanStates() {
    setTitle('')
    setDetails('')
    setConditions('')
    setAwards('')
    setDate('')
    setactiveUsers([])
  }

  function hasDatePassed(dateInput:string) {
    const currentDate: Date = new Date();
    const inputDate : Date = new Date(dateInput);

    return inputDate < currentDate;

  }
  
  function removePlayer(data: any) {
    let Index = activeUsers.findIndex((item:any) => item.Id === data.Id)
    const array = [... activeUsers]
    array[Index].Added = false
    setactiveUsers(array)   
  }
  
  
  function Send() {
    if(hasDatePassed(DateState) == true) {
        return console.log(`Please check the date`)
    }
    if(!(Title || Details ||Conditions || Awards )) {
        console.log(`Please fill all the fields`)
    } else {
        if((activeUsers.findIndex((item:any) => item.Added === true) > -1)) {
            let usersAdded = activeUsers.filter((e:any) => e.Added !== false)
            fetchNui("sendContract", [
                {ContractData: {
                    title: Title,
                    details: Details,
                    conditions: Conditions,
                    awards: Awards,
                    date: DateState,
                },
                users:usersAdded
            },
                ]).then((retData) => {
                if (retData == "ok") {
                    cleanStates()
                    fetchNui("hideFrame")
                }
            })
            return 
        } else {
            return console.log('PLease add players')
        }
        
    }
  }

  function format(num: number) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
  return (
    <div className='CreateInside'>
        <div className='Title'>
            <p>Create Contract</p>
            <p style={{fontSize: 'calc(5.5px + 0.4vw)', fontWeight: 'normal', fontFamily: 'Poppins'}}>Lorem Ipsum is simply dummy text of the print.</p>
        </div>
        <div className="InputRows">
            <div className='Row'>
                <p>Contract Title</p>
                <input value={Title} onChange={(e) => {setTitle(e.target.value)}} className='Input'></input>
            </div>
            <div className='Row'>
                <p>Contract Details</p>
                <textarea className='Textarea' value={Details} onChange={(e) => {setDetails(e.target.value)}} rows={4} />
            </div>
            <div className='Row'>
                <p>Contract Conditions</p>
                <textarea className='Textarea' value={Conditions} onChange={(e) => {setConditions(e.target.value)}} rows={4} />
            </div>
            <div className='Row'>
                <p>Contract Awards</p>
                <div style={{display: 'flex' , alignItems: 'center'}}>
                    <img className='IconInput' src={dollarIcon}></img>
                    <input value={Awards} onChange={(e) => {setAwards(e.target.value)}} type='number' style={{paddingLeft: '2vw', fontSize: 'calc(10px + 0.4vw)'}} className='Input'></input>
                </div>
            </div>
            <div className='Row'>
                <p>Contract Duration</p>
                <div style={{display: 'flex' , alignItems: 'center'}}>
                    <img className='IconInput' style={{marginLeft: '19vw'}} src={date}></img>
                    <input value={DateState} onChange={(e) => {setDate(e.target.value)}} className='Input' type='date' style={{textAlign: 'left', paddingLeft: '1vw'}}></input>
                </div>
            </div>
            <div className='Row'>
                <p>Add Users</p>
                <div className='Users'>
                    <div style={{display: 'flex' , gap: '0.5vw', maxWidth: '19vw', overflowX: 'auto' , overflowY: 'hidden', height: '2vw', whiteSpace: 'nowrap'}}>
                    {
                        activeUsers.map((e:any) => {
                            if(e.Added === true) {
                                return(
                                    <p onClick={() => {removePlayer(e)}}>{e.PlayerName}</p>
                                )
                            }
                        })
                    }
                    </div>
                 
                    <div className='UsersList'>
                        {
                            activeUsers.length ? 
                            activeUsers.map((e:any) => {
                                if(e.Added === false) {
                                    return(
                                        <div className='User'>
                                            <p>{e.PlayerName}</p>
                                            <img src={plusIcon} onClick={() => {AddPlayer(e)}} style={{position: 'relative', float: 'right', paddingRight: '0.5vw'}}></img>
                                        </div>
                                    )
                                }
                             
                                
                            })
                            : <p style={{color: '#9EA4AF', fontFamily: 'Poppins', fontWeight: '500'}}>No players found :(</p>
                        }
                      
                       
                    </div>
                </div>
            </div>
        </div>
        <div className='ContractActions'>
            <button onClick={() => {Send()}}>Send The Contract</button>
        </div>
    </div>
  );
}

export default Create;
