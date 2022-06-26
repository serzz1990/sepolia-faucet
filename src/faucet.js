import FormData from "form-data";
import fetch from "node-fetch";

export async function sendRequest (chain, address, captcha) {
  const data = new FormData();
  data.append('chain', chain);
  data.append('address', address);
  data.append('h-captcha-response', captcha);
  const response = await fetch("https://faucet.sepolia.dev/request", {
    "body": data,
    "method": "POST"
  }).then(r => r.text());
  const result = eval(`
        const Swal = {
            fire: (type, message, status) => ({ type, message, status })
        }
        ${response};
    `);
  if (result.status === 'success') {
    return Promise.resolve(result.message);
  } else {
    return Promise.reject(result.message);
  }
}
