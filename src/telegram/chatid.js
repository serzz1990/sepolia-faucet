import '../env.js';
import { getLastMessage } from './index.js';

getLastMessage().then((message) => {
  if (message) {
    console.log(`Last message from ${message.chat.first_name}, chat id: ${message.chat.id}`);
  } else {
    console.log(`No messages. Pls write message to your bot.`);
  }
})
