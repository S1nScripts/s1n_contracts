import React, {useEffect, useState} from 'react';
import './App.css'
// import {debugData} from "../utils/debugData";
// import {fetchNui} from "../utils/fetchNui";

import dollarIcon from '../images/dollaricon.png'
import plusIcon from '../images/plusIcon.png'
import date from '../images/date.png'
import { useNuiEvent } from '../hooks/useNuiEvent';
import { fetchNui } from '../utils/fetchNui';
import Vector from '../images/Vector.png'
import Notselected from '../images/notSelectedVector.png'
import sendGrey from '../images/sendGrey.png';
import sendGreen from '../images/sendGreen.png';

const ContractsList: React.FC = () => {
        // States

    // const [ContractID , setContractId] = useState('')
    const [UserCitizenID , setCitizenID] = useState('')

    //
    const [ContractsList, setContracts] = useState<any | null>([]);
    const [sentBy, setSentBy] = useState('');
    const [Expanded ,setExpand] = useState('')
   
  
    // // Functions
    function Accept(id: string) {
        fetchNui('signContract' , {
            contractId: id,
            signedBy: UserCitizenID
        }).then((retData) => {
            setExpand('1')
            if(retData) {
                fetchNui('getContracts' , {}).then((retData) => {
                    setContracts(retData.ContData)
                    setCitizenID(retData.citizenID)
                })
            }
        })
        
    }

    function Decline(id: string) {
        fetchNui('declineContract' , {
            contractId: id,
        }).then((retData) => {
            if(retData) {
                setExpand('1')
                fetchNui('getContracts' , {}).then((retData) => {
                    setContracts(retData.ContData)
                    setCitizenID(retData.citizenID)
                })
            }
        
        })
    }
    
    function format(num: number) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    }

    function showContract(id: string) {
        fetchNui('showContract' , {
            id: id
        }).then((retData) => {
            setContracts(retData.ContData)
            setCitizenID(retData.citizenID)
        })
    }
    useNuiEvent<any>('showContractsList' , function(){
        setExpand('1')
        fetchNui('getContracts' , {}).then((retData) => {
            setContracts(retData.ContData)
            setCitizenID(retData.citizenID)
        })

    })
       
   


    let loaded = true
    return(
        <div>
        {loaded ? 
            <div className='ContractReceive'>
                <div className='Row2'>
                    <h1 style={{fontFamily: 'Gilroy' , fontWeight: '800' , fontSize: 'calc(19px + 0.4vw)', color: '#9EA4AF'}}>Contract You Recevie</h1>
                    <p style={{fontSize: 'calc(8px + 0.4vw)', fontFamily:'Poppins', color: '#9B9B9B'}}>Lorem Ipsum is simply dummy text of the print.</p>
                </div>
                <div className='Row2' style={{gap: '0.5vw'}}>
                    {ContractsList.map((e:any) => {
                        return(
                            <div className={Expanded === e.contractionData ? 'contractRow Expanded' : 'contractRow'} onClick={() => {setExpand(e.contractionData)}} style={{width: '90%'}}>
                                <div style={{display: 'flex' , justifyContent: 'center' , alignItems: 'center' , gap: '2.5vw', whiteSpace: 'nowrap', paddingTop: '0.7vw'}}>
                                    <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5vw', paddingLeft: '1vw'}}>
                                        <img src={Expanded === e.contractionData ? Vector : Notselected}></img>
                                        <span style={{display: 'flex' , flexDirection: 'column', justifyContent: 'center'}}>
                                            <p style={{fontFamily: 'Poppins' , color: '#9EA4AF', fontWeight: '500' ,fontSize: 'calc(8px + 0.4vw)'}}>{JSON.parse(e.contractionData).title}</p>
                                            <p style={{fontFamily: 'Poppins' , color: '#9EA4AF', fontWeight: '400',fontSize: 'calc(4px + 0.4vw)'}} onClick={() => {showContract(e.contractionID)}}>Details Contract</p>
                                        </span>
                                    </span>
                                    <span>
                                        <p style={{fontFamily: 'Poppins' , color: '#6C7380' ,fontSize: 'calc(5px + 0.4vw)', fontWeight: '600' }}>Last {Math.floor(((new Date(JSON.parse(e.contractionData).date).getTime()) - new Date().getTime())/ (86400000))} Days</p>
                                    </span>
                                    <span>
                                        <p style={{fontFamily: 'Poppins' , color: '#6C7380' ,fontSize: 'calc(5px + 0.4vw)', fontWeight: '600' }}>${format(JSON.parse(e.contractionData).awards)}</p>
                                    </span>
                                    <span style={{display: 'flex' , justifyContent: 'center' , alignItems: 'center', paddingRight: '1vw'}}>
                                    <img src={Expanded === e.contractionData ? sendGreen : sendGrey}></img>
                                    </span>
                                </div>
                                <div className='ExpandedData' style={Expanded === e.contractionData? {display: 'block'} : {display: 'none'}}>
                                    <div style={{display: 'flex', gap: '1vw',flexDirection: 'row'}}>
                                        <div className='expandedRow'>
                                            <img src={dollarIcon}></img>
                                            <p>{format(JSON.parse(e.contractionData).awards)}</p>
                                        </div>
                                        <div className='expandedRow'>
                                            <img src={date}></img>
                                            <p>{Math.floor(((new Date(JSON.parse(e.contractionData).date).getTime()) - new Date().getTime())/ (86400000))} Days</p>
                                        </div>
                                    </div>
                                    <div style={{display: 'flex' ,flexDirection: 'column', gap: '1vw', width: '100%'}}>
                                        <div style={{display: 'flex', flexDirection: 'column' , gap: '0.2vw', width: '100%', marginTop: '1vw', paddingLeft: '12vw'}}>
                                            <p style={{fontFamily: 'Poppins' , fontWeight: '500' , fontSize: 'calc(4px + 0.4vw)', color: '#A9A9A9'}}>Sent by</p>
                                            <p style={{fontFamily: 'Poppins' , fontWeight: '500' , fontSize: 'calc(3px + 0.4vw)', color: '#666666'}}>{JSON.parse(e.sentBy).Name}</p>
                                        </div>
                                        {
                                                e.signedBy.includes(UserCitizenID) == true ? '' :
                                        <div className='acceptdeclinebuttons'>
                                    
                                                <button onClick={(event:any) => {Decline(e.contractionID); event.stopPropagation()}} style={{color: '#A02E2E' , border: '0.1vw solid #A02E2E', fontFamily: 'Poppins'}} className='buttonAcceptOrDecline'>Decline</button>
                                                <button onClick={(event:any) =>{ Accept(e.contractionID); event.stopPropagation()}} style={{color: '#2EA080' , border: '0.1vw solid #2EA080' , fontFamily: 'Poppins'}} className='buttonAcceptOrDecline'>Accept</button>
                                            
                                          
                                        </div>
                                        }
                                    </div>
                                
                                </div>
                            </div>
                        )
                    })}
                </div>
              
            </div>
        : ''}
        </div>
        
        
       
    )
}
export default ContractsList;
