import React, {useState} from 'react';
import './App.css'
import {debugData} from "../utils/debugData";
import {fetchNui} from "../utils/fetchNui";


import Create from './Create';
import Receive from './Receive';
import { useNuiEvent } from '../hooks/useNuiEvent';
import ContractsList from './ContractsList';
// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: 'setVisible',
    data: true,
  }
])

const App: React.FC = () => {
  const [page, setPage] = useState('')
  const [dataToSend, setData] = useState<any |null>([])

  useNuiEvent<any>('getPlayers' , function(){
    setPage('Create')
  })

  useNuiEvent<any>('showContract' , function(){
    setPage('Receive')
  })

  useNuiEvent<any>('showContractsList' , function(){
    setPage('ContractsList')
  })
  return (
    <div className="nui-wrapper">
      <div className='popup-thing' style={page == 'Create' ? {height: '92vh'} : {height: 'fit-content'}} >
        <div className='InsideContainer'>
        <div style={page === 'Create' ? {display: 'block', width: '100%'} : {display: 'none'}}>
          <Create/>
        </div>
        <div style={page === 'Receive' ? {display: 'block' , width: '100%'} : {display: 'none'}}>
          <Receive/>
        </div>
        <div style={page === 'ContractsList' ? {display: 'block' , width: '100%'} : {display: 'none'}}>
          <ContractsList/>
        </div>
        </div>
      </div>
    </div>
  );
}

export default App;
