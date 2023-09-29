math.randomseed(os.time())

local QBCore = exports['qb-core']:GetCoreObject()

QBCore.Functions.CreateCallback('getPlayers', function(source, cb)
    local onlinePlayers = QBCore.Functions.GetPlayers()
    local Data = {}

    for _, v in pairs(onlinePlayers) do
        local player = QBCore.Functions.GetPlayer(v)
        local citizenid = player.PlayerData.citizenid
        local firstname = player.PlayerData.charinfo.firstname
        local lastname = player.PlayerData.charinfo.lastname

        table.insert(Data, {PlayerName = firstname .. ' ' .. lastname, Id = citizenid})
    end

    cb(Data)
end)

function GetUserIdByCid(cid) 
    local onlinePlayers = QBCore.Functions.GetPlayers()

    for _, v in pairs(onlinePlayers) do
        local player = QBCore.Functions.GetPlayer(v)
        local citizenid = player.PlayerData.citizenid

        if citizenid == cid then
            return v
        end
    end
end

function generateID()
    local characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    local id = ""

  
    for _ = 1, 6 do
      local randomIndex = math.random(1, #characters)
      local randomChar = characters:sub(randomIndex, randomIndex)

      id = id .. randomChar
    end
  
    return id
end


function checkDate(us_mdY) 
    local pattern = "(%d+)-(%d+)-(%d+)"
    local timeToConvert = us_mdY
    local year, month, day = timeToConvert:match(pattern)
    local convertedTimestamp = os.time({year = year, month = month, day = day})

    return (convertedTimestamp - os.time()) >= 0
end

QBCore.Functions.CreateCallback('insertContract' , function(source, cb , contractData, users)
    local Player = QBCore.Functions.GetPlayer(source)
    local firstname = Player.PlayerData.charinfo.firstname
    local lastname = Player.PlayerData.charinfo.lastname

    exports.oxmysql:insert('INSERT INTO contracts (contractionID , contractionData, sentBy, Users) VALUES (@ID, @Data, @SentBy, @Users)', {
        ['@ID'] =  generateID(),
        ['@Data'] = contractData,
        ['@SentBy'] = json.encode({cid = Player.PlayerData.citizenid , Name = firstname..' '..lastname}),
        ['@Users'] = users,
    })

    for _, v in pairs(json.decode(users)) do
        local PlayerID = GetUserIdByCid(v.Id)

        TriggerClientEvent('QBCore:Notify', PlayerID, "You have received a new contract, type /contracts to see it", "success")
    end

    cb('ok')
end)


QBCore.Functions.CreateCallback('getContractData' , function(source, cb, contractid)
    local returnall = false
    
    if(contractid == 'all') then
        returnall = true
    end

    local Player = QBCore.Functions.GetPlayer(source)
    local citizenid = Player.PlayerData.citizenid

    if not returnall then
        exports["oxmysql"]:execute("SELECT * FROM contracts WHERE contractionID = @ID", {["@ID"] = contractid}, function(result)
            if not result[1] then return end
            
            cb({rows = result[1] , citizenID = citizenid , SentBy = result[1].sentBy})
        end)
    else
        exports["oxmysql"]:execute("SELECT * FROM contracts WHERE Users LIKE @citizenID", {["@citizenID"] = '%'..citizenid..'%'}, function(result)
            if(result[1] ~= nil) then
                local ok = {}

                for k,v in pairs(result) do
                    if not checkDate(json.decode(v.contractionData).date) then
                        exports.oxmysql:execute( "DELETE FROM contracts WHERE contractionID = @ID", { ['@ID'] = contractid} )
                    else
                        table.insert(ok , v)
                    end
                end

                cb({rows = ok , citizenID = citizenid , SentBy = result[1].sentBy})
            else
                return
            end
        end)
    end
end)


QBCore.Functions.CreateCallback('signContractServer' , function(source, cb, contractid, signedBy)
    exports["oxmysql"]:execute("SELECT * FROM contracts WHERE contractionID = @ID", {["@ID"] = contractid}, function(result)
        if(result[1] ~= nil) then
            if(checkDate(json.decode(result[1].contractionData).date) == false) then
                return  exports.oxmysql:execute( "DELETE FROM contracts WHERE contractionID = @ID", { ['@ID'] = contractid} )
            end

            local senderId = GetUserIdByCid(signedBy)

            if not senderId then
                return TriggerClientEvent('QBCore:Notify', source, "The sender of the contract isn't available right now.", "error")
            end

            local amount = (json.decode(result[1].contractionData).awards)
            local signedPlayer = QBCore.Functions.GetPlayer(source)
            local senderPlayer = QBCore.Functions.GetPlayer(tonumber(senderId))

            if(tonumber(signedPlayer.PlayerData.money.bank) < tonumber(amount)) then
                return TriggerClientEvent('QBCore:Notify', source, "You dont have enough money.", "error")
            end

            senderPlayer.Functions.AddMoney('bank', tonumber(amount))
            signedPlayer.Functions.RemoveMoney('bank', tonumber(amount))

            TriggerClientEvent('QBCore:Notify', source, "successfully signed to "..json.decode(result[1].contractionData).title.."", "success")
            TriggerClientEvent('QBCore:Notify', tonumber(senderId), ""..signedPlayer.PlayerData.charinfo.firstname..' '..signedPlayer.PlayerData.charinfo.lastname.." successfully signed to "..json.decode(result[1].contractionData).title.."", "success")
            
            local signedByAlready = {}
            
            for k,v in pairs(json.decode(result[1].signedBy)) do
                if(v ~= signedBy) then
                    table.insert(signedByAlready , v)
                end
            end

            table.insert(signedByAlready , signedBy)          
            
            exports.oxmysql:execute("UPDATE contracts SET signedBy = @signedBy WHERE contractionID = @ID",
                {["@ID"] = contractid, ["@signedBy"] = {json.encode(signedByAlready)}},
                function(result)
                end
            )

            cb('ok')
        else
            return
        end
    end)
end)

QBCore.Functions.CreateCallback('declineContractServer' , function(source, cb, contractid)
    local Player = QBCore.Functions.GetPlayer(source)
    local citizenid = Player.PlayerData.citizenid

    exports["oxmysql"]:execute("SELECT * FROM contracts WHERE contractionID = @ID", {["@ID"] = contractid}, function(result)
        if not result[1] then 
            return TriggerClientEvent('QBCore:Notify', source, "Contract wasn't found.", "error")
        end

        local usersAlready = {}
        
        if not GetUserIdByCid(citizenid) then
            return TriggerClientEvent('QBCore:Notify', source, "The sender of the contract isn't available right now.", "error")
        end

        for _, v in pairs(json.decode(result[1].Users)) do
            if(v.Id == citizenid) then
                
            else
                table.insert(usersAlready, v)
            end
        end

        exports.oxmysql:execute("UPDATE contracts SET Users = @UsersData WHERE contractionID = @ID",
            {["@ID"] = contractid, ["@UsersData"] = {json.encode(usersAlready)}},
            function(result)
            end
        )

        cb('ok')
    end)
end)