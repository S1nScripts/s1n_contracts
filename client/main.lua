
--
--- Framework imports
--

local QBCore = exports['qb-core']:GetCoreObject()

--
--- Functions
--

local function toggleNuiFrame(shouldShow)
  SetNuiFocus(shouldShow, shouldShow)

  SendReactMessage('setVisible', shouldShow)
end

--
--- Commands
--

RegisterCommand('contract', function()
  QBCore.Functions.TriggerCallback('getPlayers', function(players)
    if not players then return end

    SendReactMessage('getPlayers', players)
    toggleNuiFrame(true)
  end)
end, false)

RegisterCommand('contracts', function()
  SendReactMessage('showContractsList',{})
  toggleNuiFrame(true)
end, false)

--
--- NUI Callbacks
--

RegisterNUICallback('showContract', function(data, cb)
  if not data then return end
  if not data.id then return end

  SendReactMessage('showContract',{contractID = data.id})
end)

RegisterNUICallback('getContractData', function(data,cb)
  QBCore.Functions.TriggerCallback('getContractData', function(data)
    if not data then return end
    if not data.rows then return end
    if not data.citizenID then return end
    if not data.SentBy then return end

    cb({ContData = data.rows, citizenID = data.citizenID, sentBy = data.SentBy})
  end, data.contractID)
end)

RegisterNUICallback('getContracts', function(data,cb)
  QBCore.Functions.TriggerCallback('getContractData', function(data)
    if not data then return end
    if not data.rows then return end
    if not data.citizenID then return end

    cb({ContData = data.rows, citizenID = data.citizenID})
  end, 'all')
end)

RegisterNUICallback('signContract', function(data, cb)
  if not data then return end
  if not data.contractId then return end
  if not data.signedBy then return end

  QBCore.Functions.TriggerCallback('signContractServer', function(data)
    if(data) then
      cb('ok')
    end
  end, data.contractId, data.signedBy)
end)

RegisterNUICallback('declineContract', function(data, cb)
  if not data then return end
  if not data.contractId then return end

  QBCore.Functions.TriggerCallback('declineContractServer', function(data)
    if not data then return end
    
    cb('ok')
  end, data.contractId)
end)

RegisterNUICallback('sendContract', function(data, cb)
  if not data then return end
  if not data[1] then return end

  QBCore.Functions.TriggerCallback('insertContract', function()
    cb('ok')
  end, json.encode(data[1].ContractData), json.encode(data[1].users))
end)

RegisterNUICallback('hideFrame', function(_, cb)
  toggleNuiFrame(false)
  debugPrint('Hide NUI frame')

  cb({})
end)