require('dotenv').config()

const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(process.env.TRON_API);
const solidityNode = new HttpProvider(process.env.TRON_API);
const eventServer = new HttpProvider(process.env.TRON_API);
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer);
const sendEmail = require('./mail');
const storage = require('./storage')
tronWeb.setHeader({"TRON-PRO-API-KEY": process.env.TRON_API_KEY});

const CONTRACT = process.env.CONTRACT;
const LIMIT = Number(process.env.LIMIT);

const ACCOUNT = process.env.ACCOUNT;

function toUSDT(val){
  return val / 1000000;
}

async function balanceChecker(contract){
  let lastBalance = storage.hasSavedBalance() ? tronWeb.BigNumber(storage.loadBalance()) : await contract.methods.balanceOf(ACCOUNT).call();
  storage.saveBalance(lastBalance.toString());

  return async ()=>{
    const balance = await contract.methods.balanceOf(ACCOUNT).call();
    if(balance.toString() !== lastBalance.toString()) {
      storage.saveBalance(balance.toString());

      const diff = balance - lastBalance;

      if(LIMIT === -1 || toUSDT(Math.abs(diff)) >= LIMIT) {
        sendEmail({
          amount: toUSDT(diff),
          balance: toUSDT(balance)
        });
      }

    }

    lastBalance = balance;
  }
}

async function main() {
  tronWeb.setAddress(ACCOUNT);
  const {
      abi
  } = await tronWeb.trx.getContract(CONTRACT);

  const contract = tronWeb.contract(abi.entrys, CONTRACT);

  const checkBalance = await balanceChecker(contract);
  
  await checkBalance();

  setInterval(async ()=> {
    await checkBalance();
  }, 10000);
}

main().then(() => {
        console.log("ok");
    })
    .catch((err) => {
        console.log("error:", err);
    });