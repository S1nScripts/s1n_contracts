QBCore = nil


local QBCore = exports['qb-core']:GetCoreObject()



local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)

  SendReactMessage('setVisible', shouldShow)
end

RegisterCommand('contract', function()
  QBCore.Functions.TriggerCallback('getPlayers' , function(players)
    SendReactMessage('getPlayers' ,players)
    toggleNuiFrame(true)
  end)
  
end)


RegisterNUICallback('showContract', function(data , cb)
  SendReactMessage('showContract' ,{contractID= data.id})
end)

RegisterCommand('contracts', function()
  SendReactMessage('showContractsList' ,{})
  toggleNuiFrame(true)
end)



RegisterNUICallback('getContractData' , function(data ,cb)
  QBCore.Functions.TriggerCallback('getContractData' , function(data)
    cb({ContData = data.rows, citizenID = data.citizenID, sentBy = data.SentBy})
  end, data.contractID)
end)

RegisterNUICallback('getContracts' , function(data ,cb)
  QBCore.Functions.TriggerCallback('getContractData' , function(data)
    cb({ContData = data.rows, citizenID = data.citizenID})
  end, 'all')
end)

RegisterNUICallback('signContract' , function(data , cb)
  QBCore.Functions.TriggerCallback('signContractServer' , function(data)
    if(data) then
      cb('ok')
    end
  end, data.contractId, data.signedBy)
end)

RegisterNUICallback('declineContract' , function(data , cb)
  QBCore.Functions.TriggerCallback('declineContractServer' , function(data)
    if(data) then
      cb('ok')
    end
  end, data.contractId)
end)



RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')
  cb({})
end)

RegisterNUICallback('sendContract', function(data, cb)
  QBCore.Functions.TriggerCallback('insertContract' , function(returned)
    cb('ok')
  end , json.encode(data[1].ContractData), json.encode(data[1].users))
end)
