import { LCDClient } from '@terra-money/terra.js';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

const main = async () => {
    const DATA_DIR = 'data';
    const AUST_ADDRESS = 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu';
    const MINTER_ADDRESS = 'terra1wfz7h3aqf4cjmjcvc6s8lxdhh7k30nkczyf0mj';
    const LCD = new LCDClient({
        URL: "https://lcd.terra.dev", // use localhost if you want to speedup the data collection process
        chainID: "columbus-5",
    });
    const DEPOSITS = [];

    const init = async () => {
        let isFullyCompleted = false;
        let start_after = undefined;

        do {
            const response = await LCD.wasm.contractQuery(
                MINTER_ADDRESS,
                {
                    positions: {
                        start_after,
                        limit: 30
                    }
                },
                {height: 7544510}
            );
            createDepositsList(response);
            if(response.positions[response.positions.length-1]){
                start_after = response.positions[response.positions.length-1].idx;
            }
            else{
                isFullyCompleted = true;
            }
            console.log(start_after);
        }
        while (!isFullyCompleted);
        buildFile();
    };

    const createDepositsList = (response) => {
        response.positions.forEach(res => {
            const {owner, collateral} = res;
            if(collateral.info.native_token){
                DEPOSITS.push({
                    denom: collateral.info.native_token.denom,
                    amount: collateral.amount,
                    owner: owner
                });
            }
            else if (collateral.info.token.contract_address === AUST_ADDRESS) {
                console.log("AUST_ADDRESS")
            }
        })
    }

    const buildFile = () => {
        if(!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR);
        }
        fs.writeFileSync(path.join(DATA_DIR, MINTER_ADDRESS + ".json"), JSON.stringify(DEPOSITS));
    }
    init();
}

main();