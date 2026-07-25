# Stellar Wallet - Simple Payment dApp

A simple Stellar testnet wallet dApp that allows users to connect their Freighter wallet, view their XLM balance, and send XLM transactions on the Stellar testnet. Built as part of the **Stellar Journey to Mastery** Level 1 - White Belt challenge.

## Features

- **Wallet Connection** - Connect and disconnect Freighter wallet
- **Balance Display** - View your XLM balance in real-time
- **Send XLM** - Send XLM to any Stellar address on testnet
- **Testnet Faucet** - Request free testnet XLM with one click
- **Transaction Feedback** - See success/failure status with transaction hash and Explorer link

## Screenshots

### Wallet Connected State
![Wallet Connected](screenshots/wallet-connected.png)
<img width="1366" height="693" alt="Screenshot 2026-07-25 052507" src="https://github.com/user-attachments/assets/0a937d7b-da7a-46d8-b1c8-8953be0e4d59" />


### Balance Displayed
![Balance Displayed](screenshots/balance-displayed.png)
<img width="1366" height="679" alt="Screenshot 2026-07-25 053632" src="https://github.com/user-attachments/assets/a936ae21-b468-4f18-a9c9-79b17e907420" />


### Successful Testnet Transaction
![Transaction Success](screenshots/transaction-success.png)
<img width="1366" height="583" alt="Screenshot 2026-07-25 053509" src="https://github.com/user-attachments/assets/03d14899-8100-44b3-9f4c-83de7491fbd3" />

<img width="1366" height="679" alt="Screenshot 2026-07-25 053632" src="https://github.com/user-attachments/assets/4e2b0dce-b235-4760-8a7a-ee1ac6fb761e" />


## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Freighter Browser Extension](https://freighter.app/) (Chrome/Firefox/Brave)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/stellar-wallet.git
   cd stellar-wallet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

5. Make sure Freighter is installed and set to **Testnet**.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## How to Use

1. **Connect Wallet** - Click "Connect Freighter" and approve in the extension
2. **Get Testnet XLM** - Click "Get Testnet XLM from Faucet" if your balance is zero
3. **Send XLM** - Enter a recipient address and amount, then click "Send XLM"
4. **Disconnect** - Click "Disconnect" to disconnect your wallet

## Tech Stack

- [Vite](https://vite.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [@stellar/stellar-sdk](https://www.npmjs.com/package/@stellar/stellar-sdk) - Stellar JavaScript SDK
- [@stellar/freighter-api](https://www.npmjs.com/package/@stellar/freighter-api) - Freighter wallet integration

## License

MIT
