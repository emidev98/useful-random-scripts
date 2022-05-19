import fetch from 'node-fetch';

const init = async () => {
    const LCD_URL = "https://lcd.terra.dev/cosmos/bank/v1beta1/supply?height=";
    let currentBlockHeight = 7589630;
    let expectedDenom = "uluna";
    let expectedValue = 1_000_000_000_000_000; // 1B uluna
    let foundExpectedValue = false;

    while(!foundExpectedValue) {
        const response = await (await fetch(LCD_URL + currentBlockHeight)).json();
        const ulunaSupply = response.supply.find(supply => supply.denom === expectedDenom);
        console.log("SUPPLY :> ", JSON.stringify(ulunaSupply));

        if( Number(ulunaSupply.amount) >= expectedValue){
            console.log("BLOCK HEIGHT :>", currentBlockHeight);
            foundExpectedValue = true;
        }

        currentBlockHeight++;
    }

}
init()