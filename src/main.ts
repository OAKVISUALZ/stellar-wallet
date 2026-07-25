import "./style.css";
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";
import * as StellarSdk from "@stellar/stellar-sdk";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

let currentAddress = "";
let isWalletConnected = false;

const app = document.querySelector<HTMLDivElement>("#app")!;

function render() {
  app.innerHTML = `
    <div class="header">
      <h1>Stellar Wallet</h1>
      <p>Simple Payment dApp on Testnet</p>
      <span class="network-badge">Stellar Testnet</span>
    </div>

    <div class="card" id="wallet-card">
      <div class="card-title">Wallet</div>
      <div id="connect-section">
        <button class="btn btn-primary" id="connect-btn">
          Connect Freighter
        </button>
      </div>
      <div id="connected-section" class="hidden">
        <div class="address-display">
          <code id="address-text"></code>
          <button class="copy-btn" id="copy-btn" title="Copy address">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
          </button>
        </div>
        <button class="btn btn-danger" id="disconnect-btn" style="margin-top:0.75rem">
          Disconnect
        </button>
      </div>
    </div>

    <div class="card hidden" id="balance-card">
      <div class="card-title">Balance</div>
      <div class="balance-display">
        <span class="balance-amount" id="balance-amount">0</span>
        <span class="balance-currency">XLM</span>
      </div>
      <button class="faucet-btn" id="faucet-btn">Get Testnet XLM from Faucet</button>
    </div>

    <div class="card hidden" id="send-card">
      <div class="card-title">Send XLM</div>
      <div class="form-group">
        <label for="recipient">Recipient Address</label>
        <input type="text" id="recipient" placeholder="G..." />
      </div>
      <div class="form-group">
        <label for="amount">Amount (XLM)</label>
        <input type="number" id="amount" placeholder="0.00" min="0" step="0.01" />
      </div>
      <button class="btn btn-primary" id="send-btn">
        Send XLM
      </button>
      <div id="send-result"></div>
    </div>

    <div class="footer">
      Built for Stellar Journey to Mastery &middot;
      <a href="https://stellar.org" target="_blank">Learn Stellar</a>
    </div>
  `;

  bindEvents();
}

function bindEvents() {
  const connectBtn = document.getElementById("connect-btn")!;
  const disconnectBtn = document.getElementById("disconnect-btn")!;
  const copyBtn = document.getElementById("copy-btn")!;
  const sendBtn = document.getElementById("send-btn")!;
  const faucetBtn = document.getElementById("faucet-btn")!;

  connectBtn.addEventListener("click", handleConnect);
  disconnectBtn.addEventListener("click", handleDisconnect);
  copyBtn.addEventListener("click", handleCopy);
  sendBtn.addEventListener("click", handleSend);
  faucetBtn.addEventListener("click", handleFaucet);
}

async function handleConnect() {
  const btn = document.getElementById("connect-btn")!;
  btn.innerHTML = '<span class="spinner"></span> Connecting...';
  btn.setAttribute("disabled", "true");

  try {
    const conn = await isConnected();
    if (!conn.isConnected) {
      throw new Error("Please install and unlock Freighter wallet extension.");
    }

    const network = await getNetwork();
    if (network.error) {
      throw new Error(`Network error: ${network.error}`);
    }

    if (network.networkPassphrase !== NETWORK_PASSPHRASE) {
      throw new Error(
        "Please switch Freighter to Testnet network."
      );
    }

    const access = await requestAccess();
    if (access.error) {
      throw new Error(`Access error: ${access.error}`);
    }

    currentAddress = access.address;
    isWalletConnected = true;

    showConnectedState();
    await loadBalance();
  } catch (err: any) {
    btn.removeAttribute("disabled");
    btn.innerHTML = "Connect Freighter";
    alert(err.message || "Failed to connect wallet");
  }
}

function handleDisconnect() {
  currentAddress = "";
  isWalletConnected = false;

  document.getElementById("connect-section")!.classList.remove("hidden");
  document.getElementById("connected-section")!.classList.add("hidden");
  document.getElementById("balance-card")!.classList.add("hidden");
  document.getElementById("send-card")!.classList.add("hidden");

  const btn = document.getElementById("connect-btn")! as HTMLButtonElement;
  btn.removeAttribute("disabled");
  btn.innerHTML = "Connect Freighter";
}

function showConnectedState() {
  document.getElementById("connect-section")!.classList.add("hidden");
  document.getElementById("connected-section")!.classList.remove("hidden");
  document.getElementById("balance-card")!.classList.remove("hidden");
  document.getElementById("send-card")!.classList.remove("hidden");
  document.getElementById("address-text")!.textContent = currentAddress;
}

async function loadBalance() {
  try {
    const account = await server.loadAccount(currentAddress);
    const xlmBalance = account.balances.find(
      (b) => b.asset_type === "native"
    );
    const balance = xlmBalance ? xlmBalance.balance : "0";
    document.getElementById("balance-amount")!.textContent =
      Number(balance).toFixed(4);
  } catch {
    document.getElementById("balance-amount")!.textContent = "0.0000";
  }
}

function handleCopy() {
  navigator.clipboard.writeText(currentAddress);
  const btn = document.getElementById("copy-btn")!;
  btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="var(--success)" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>';
  setTimeout(() => {
    btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
  }, 2000);
}

async function handleSend() {
  const recipientEl = document.getElementById("recipient") as HTMLInputElement;
  const amountEl = document.getElementById("amount") as HTMLInputElement;
  const resultDiv = document.getElementById("send-result")!;
  const btn = document.getElementById("send-btn")!;

  const recipient = recipientEl.value.trim();
  const amount = amountEl.value.trim();

  if (!recipient) {
    showResult("error", "Please enter a recipient address.");
    return;
  }

  if (!recipient.startsWith("G") || recipient.length !== 56) {
    showResult("error", "Invalid Stellar address. Must start with G and be 56 characters.");
    return;
  }

  if (!amount || Number(amount) <= 0) {
    showResult("error", "Please enter a valid amount.");
    return;
  }

  btn.innerHTML = '<span class="spinner"></span> Building transaction...';
  btn.setAttribute("disabled", "true");
  resultDiv.innerHTML = "";

  try {
    const account = await server.loadAccount(currentAddress);

    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: recipient,
          asset: StellarSdk.Asset.native(),
          amount: Number(amount).toFixed(7),
        })
      )
      .setTimeout(180)
      .build();

    const txXdr = transaction.toXDR();

    btn.innerHTML = '<span class="spinner"></span> Waiting for Freighter...';

    const signedResult = await signTransaction(txXdr, {
      networkPassphrase: NETWORK_PASSPHRASE,
      address: currentAddress,
    });

    if (signedResult.error) {
      throw new Error(`Signing failed: ${signedResult.error}`);
    }

    btn.innerHTML = '<span class="spinner"></span> Submitting...';

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedResult.signedTxXdr,
      NETWORK_PASSPHRASE
    );

    const result = await server.submitTransaction(signedTx);

    if (result.successful) {
      showResult(
        "success",
        `Transaction submitted successfully!`,
        result.hash
      );
      recipientEl.value = "";
      amountEl.value = "";
      await loadBalance();
    } else {
      throw new Error(
        `Transaction failed: ${result.result_xdr}`
      );
    }
  } catch (err: any) {
    showResult("error", err.message || "Transaction failed");
  } finally {
    btn.removeAttribute("disabled");
    btn.innerHTML = "Send XLM";
  }
}

function showResult(type: "success" | "error", message: string, hash?: string) {
  const resultDiv = document.getElementById("send-result")!;
  const explorerLink = hash
    ? `https://stellar.expert/explorer/testnet/tx/${hash}`
    : "";

  resultDiv.innerHTML = `
    <div class="result-box result-${type}">
      <div>${type === "success" ? "✓" : "✕"} ${message}</div>
      ${
        hash
          ? `
          <span class="tx-hash">${hash}</span>
          <a class="tx-link" href="${explorerLink}" target="_blank">
            View on Stellar Explorer →
          </a>
        `
          : ""
      }
    </div>
  `;
}

async function handleFaucet() {
  const btn = document.getElementById("faucet-btn")!;
  btn.textContent = "Requesting...";
  btn.setAttribute("disabled", "true");

  try {
    const response = await fetch(
      `https://friendbot.stellar.org?addr=${encodeURIComponent(currentAddress)}`
    );
    const data = await response.json();

    if (data.successful) {
      btn.textContent = "XLM Received! Refreshing balance...";
      await loadBalance();
      setTimeout(() => {
        btn.textContent = "Get Testnet XLM from Faucet";
        btn.removeAttribute("disabled");
      }, 2000);
    } else {
      throw new Error("Faucet request failed");
    }
  } catch (err: any) {
    btn.textContent = "Get Testnet XLM from Faucet";
    btn.removeAttribute("disabled");
    alert(err.message || "Failed to request testnet XLM");
  }
}

render();
