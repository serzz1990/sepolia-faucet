// https://zennolab.atlassian.net/wiki/spaces/APIS/pages/622595/API
// userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'

import axios from "axios";
import { promisify } from "util";

const sleep = promisify(setTimeout);
const clientKey = process.env.CAPMONSTER_CLIENT_KEY;

export async function getBalance () {
  const { data } = await axios.post('https://api.capmonster.cloud/getBalance', { clientKey });
  if (data.errorId) {
    return Promise.reject(data);
  } else {
    return data.balance;
  }
}

export async function getTaskResult (taskId, tryCount = 30) {
  console.log('getTaskResult...')
  while(tryCount) {
    await sleep(10000);
    const { data } = await axios.post('https://api.capmonster.cloud/getTaskResult', { clientKey, taskId });
    console.log('status', data.status);
    if (data.errorId) {
      return Promise.reject(data);
    }
    if (data.status === 'ready') {
      return data.solution.gRecaptchaResponse;
    }
    tryCount--;
  }
}

export function createTask ({ websiteURL, websiteKey }) {
  return axios.post('https://api.capmonster.cloud/createTask', {
    clientKey,
    task: {
      type: 'HCaptchaTaskProxyless',
      websiteURL,
      websiteKey
    }
  }).then(r => r.data);
}
