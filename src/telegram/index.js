import Telegram from 'node-telegram-bot-api'
import axios from "axios";
import {nl} from "./templates.js";

export const bot = new Telegram(process.env.TELEGRAM_TOKEN, {polling: false});

export function createPollingBot() {
  return new Telegram(process.env.TELEGRAM_TOKEN, {polling: true});
}

export async function getLastMessage() {
  try {
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getupdates?limit=1&offset=-1`;
    const {data} = await axios.get(url);
    if (data.result.length) {
      return data.result[0].message;
    }
  } catch (e) {
  }
  return null;
}

export async function sendError(message) {
  const messages = Array.isArray(message) ? message : [message];
  await sendMessage(`❗️<b>ERROR</b>:${nl}${messages.join(nl)}`);
}

export async function sendWarning(message) {
  const messages = Array.isArray(message) ? message : [message];
  await sendMessage(`⚠️ ${messages.join(nl)}`);
}

export async function sendMessage(text) {
  if (!process.env.TELEGRAM_TOKEN || !process.env.TELEGRAM_CHAT_ID) return;
  try {
    await bot.sendMessage(process.env.TELEGRAM_CHAT_ID, text, {parse_mode: 'HTML'});
  } catch (e) {
  }
}
