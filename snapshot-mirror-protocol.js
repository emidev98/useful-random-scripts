import { LCDClient } from '@terra-money/terra.js';
import * as fs from 'fs';
import * as path from 'path';

const main = () => {
    const MIRROR_MINTER_ADDRESS = 'terra1wfz7h3aqf4cjmjcvc6s8lxdhh7k30nkczyf0mj';
    const height = 7544510;
    const DATA_DIR = 'data';
    const LCD = new LCDClient({
        URL: "http://localhost:1317/", // or https://lcd.terra.dev
        chainID: "columbus-5",
    });
    const DEPOSITS = [];

    const init = async () => {
        const AUST_EXCHANGE_RATIO = await getAnchorUstExchangeRatio();
        let isFullyCompleted = false;
        let start_after = undefined;

        while (!isFullyCompleted) {
            const response = await LCD.wasm.contractQuery(
                MIRROR_MINTER_ADDRESS,
                {
                    positions: {
                        start_after,
                        limit: 30
                    }
                },
                { height }
            );
            createDepositsList(response, AUST_EXCHANGE_RATIO);
            if (response.positions[response.positions.length - 1]) {
                start_after = response.positions[response.positions.length - 1].idx;
            }
            else {
                isFullyCompleted = true;
            }
            console.log(start_after);
        }
        buildFile();
    };

    const getAnchorUstExchangeRatio = async () => {
        const ANCHOR_MARKET_ADDRESS = 'terra1sepfj7s0aeg5967uxnfk4thzlerrsktkpelm5s';
        const res = await LCD.wasm.contractQuery(
            ANCHOR_MARKET_ADDRESS,
            { epoch_state: {} },
            { height }
        );
        return Number(res.exchange_rate);
    };

    const createDepositsList = (response, AUST_EXCHANGE_RATIO) => {
        const AUST_ADDRESS = 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu';

        response.positions.forEach(res => {
            const { owner, collateral } = res;
            if (collateral.info.native_token) {
                DEPOSITS.push({
                    denom: collateral.info.native_token.denom,
                    amount: collateral.amount,
                    owner: owner
                });
            }
            else if (collateral.info?.token?.contract_addr === AUST_ADDRESS) {
                DEPOSITS.push({
                    denom: "uusd",
                    amount: (Number(collateral.amount) * AUST_EXCHANGE_RATIO).toFixed(),
                    owner: owner
                });
            }
        })
    }

    const buildFile = () => {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR);
        }
        fs.writeFileSync(path.join(DATA_DIR, MIRROR_MINTER_ADDRESS + ".json"), JSON.stringify(DEPOSITS));
    }
    init();
}

main();