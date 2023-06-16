import React, {useEffect, useState} from 'react';
import './App.css'
// import {debugData} from "../utils/debugData";
// import {fetchNui} from "../utils/fetchNui";

import dollarIcon from '../images/dollaricon.png'
import plusIcon from '../images/plusIcon.png'
import date from '../images/date.png'
import { useNuiEvent } from '../hooks/useNuiEvent';
import { fetchNui } from '../utils/fetchNui';

const Receive: React.FC = () => {
    // States

    // const [ContractID , setContractId] = useState('')
    const [UserCitizenID , setCitizenID] = useState('')

    //
    const [Data, setData] = useState<any | null>([]);

    const [sentBy, setSentBy] = useState('');

  
    // // Functions
    function SignContract() {
        fetchNui('signContract' , {
            contractId: Data.contractionID,
            signedBy: UserCitizenID
        }).then((retData) => {
            setData([])
            setCitizenID('')
            setSentBy('')
        })
    }

    
    function format(num: number) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    }

    useNuiEvent<any>('showContract' , function(data){
        fetchNui('getContractData' , {
            contractID: data.contractID,
        }).then((retData) => {
           setData(retData.ContData)
           setCitizenID(retData.citizenID)
           setSentBy(JSON.parse(retData.sentBy).Name)
        })
    })
       
    

    

    let loaded = Data.length !== 0
    return(
        <div style={{width: '100%'}}>
        {loaded ? 
            <div className='ContractReceive'>
                <div className='Row2'>
                    <h1 style={{fontFamily: 'Gilroy' , fontWeight: '800' , fontSize: 'calc(19px + 0.4vw)', color: '#9EA4AF'}}>{JSON.parse(Data.contractionData).title}</h1>
                    <div style={{display:'flex', justifyContent: 'center' , alignItems: 'center', gap:'0.1vw'}}>
                        <img style={{height: '1.2vh'}} src={dollarIcon}></img>
                        <p style={{fontSize: 'calc(8px + 0.4vw)', fontFamily:'Poppins', color: '#9B9B9B'}}>{format(JSON.parse(Data.contractionData).awards)}</p>
                    </div>
                </div>
                <div className='Row2' style={{width: '90%'}}>
                    <p style={{fontFamily:'Poppins' , color: '#787878', fontSize: 'calc(7px + 0.4vw)'}}>{JSON.parse(Data.contractionData).details}</p>
                </div>
                <div className='Row2' style={{width: '90%'}}>
                <p style={{fontFamily:'Poppins' , color: '#787878', fontSize: 'calc(7px + 0.4vw)'}}>{JSON.parse(Data.contractionData).conditions}</p>
                </div>
                <div style={{display: 'flex' , alignItems: 'center' , justifyContent: 'center', width: '100%'}}>
                    <div className='ContractSignatures' style={{marginTop: '1.5vw'}}>
                        <div className='Signature'>
                        <p style={{fontFamily: 'Pristina', fontSize: 'calc(20px + 0.4vw)', color: '#9F9F9F'}}>{sentBy}</p>
                            <hr style={{width: '8vw', border: '0.1vw solid rgba(255, 255, 255, 0.15)'}}></hr>
                            <p style={{fontSize: 'calc(6px + 0.4vw)' , fontFamily: 'Poppins', marginTop: '0.4vw', color: '#8F8F8F'}}>Seller's Signature</p>
                        </div>
                        <div className='Signature'>
                            <p style={{fontFamily: 'Pristina', fontSize: 'calc(20px + 0.4vw)', color: '#9F9F9F'}}>Buyer</p>
                            <hr style={{width: '8vw', border: '0.1vw solid rgba(255, 255, 255, 0.15)'}}></hr>
                            <p style={{fontSize: 'calc(6px + 0.4vw)' , fontFamily: 'Poppins', marginTop: '0.4vw', color: '#8F8F8F'}}>Buyer's Signature</p>
                        </div>
                    </div>
                </div>
                {
                    Data.signedBy.includes(UserCitizenID) ? 
                    ' ':   
                <div className='ContractActions' style={{marginTop: '2vw'}}>
                    <button onClick={() => {SignContract()}}>Sign Contract</button>
                </div>
                }
              
            </div>
        : ''}
        </div>
        
        
       
    )
}

export default Receive;
