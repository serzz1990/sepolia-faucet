import path from 'path';
import fs from 'fs';

const walletsPath = path.resolve(process.cwd(), process.env.WALLETS_PATH);
const rawdata = fs.readFileSync(walletsPath);

export const wallets = JSON.parse(rawdata);
