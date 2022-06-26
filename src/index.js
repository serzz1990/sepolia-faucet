import './env.js';
import { promisify } from "util";
import { sendMessage, sendWarning, sendError } from "./telegram/index.js";
import { createTask, getTaskResult, getBalance } from './capmonster/index.js';
import { sendRequest } from './faucet.js';
import { wallets } from './wallets.js';

const sleep = promisify(setTimeout);
const chain = 11155111;
const websiteURL = 'https://faucet.sepolia.dev';
const websiteKey = 'f0da04d3-528f-4539-bf05-a0fa4a098ab9';

(async function () {
  for (const [index, wallet] of wallets.entries()) {
    console.log('wallet', wallet)
    await requestFunds(wallet);
    await sleep(10000);
  }
})();

async function requestFunds(wallet) {
  try {
    const balance = getBalance();
    if (balance < 0.1) {
      await sendError(`STOPPED! Low balance: ${balance}`);
      return;
    } else if (balance < 1) {
      await sendWarning(`Low balance: ${balance}`);
    }

    const { taskId } = await createTask({ websiteURL, websiteKey });
    const solution = await getTaskResult(taskId);
    const result = await sendRequest(chain, wallet, solution);
    await sendMessage(`✅ ${wallet}: ${result}`);
  } catch (e) {
    await sendError(`${wallet}: ${e}`);
  } finally {
    setTimeout(async () => {
      await sleep(65 * 60000);
      setTimeout(() => requestFunds(wallet));
    }, 0);
  }
}
