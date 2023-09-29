# FiveM Contract Creator 📝

🚧 WARNING: The code is being re-written. This is a work in progress. 🚧

## Description 📚

This is a script for creating contracts between players in FiveM. To create a contract, players can either use an item or use the command `/contract`. This will open "Frame 8" on Figma. Players can define the contract's title, details, conditions, the amount the involved parties will pay, and the contract duration. 📋

## Features 🌟

- **Create Contracts**: Use `/contract` to create a new contract.
- **Customizable**: Define title, details, conditions, payment amount, and duration.
- **Notifications**: Involved parties will receive notifications. 🛎️
- **Contract List**: Use `/contracts` to display a list of contracts.
- **Interactive UI**: Click on a contract to view its details ("Frame 7").

## How it Works 🛠️

### Creating a Contract 📝

1. Use the command `/contract` or a specific item.
2. This opens "Frame 8" on Figma where you can fill in the contract details.

### Notifications 🛎️

- Once the contract is created, it will notify the chosen individuals if they are currently connected.
- If they are not connected, they will receive the notification upon reconnection.

### Viewing Contracts 📋

- Use the command `/contracts` to display a list of contracts.
- Click on a contract to view its details ("Frame 7").
- If you've already signed the contract, the "Sign" button will not appear.

### Accepting a Contract ✅

- Players can either accept or refuse the contract directly.
- Clicking on the contract to view details and signing it is equivalent to accepting it.

### Transaction 💰

- Upon accepting, the specified amount is deducted from the player's account and transferred to the contract creator.
- Both parties must be online for the transaction to occur.

## Limitations ⚠️

- If the contract owner is not connected, the accepting player cannot proceed with accepting the contract.
