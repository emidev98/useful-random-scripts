import fetch from 'node-fetch';
import * as fs from 'fs';

const init = async () => {
    let withBalance = 0;
    let withoutBalance = 0;
    let LCD_URL = "https://fcd.terra.dev/bank/balances/ADDRESS?height=7790001&chainId=columbus-5";
    let file = fs.readFileSync("./data/addr.json");
    file = JSON.parse(file);
    const dataList = file.data.map(async (address) => {
        let res = await fetch(LCD_URL.replace("ADDRESS", address));
        if (res.ok) {
            return {
                response: await (res).json(),
                address
            }
        }
        else return null;
    });

    const parsedData = (await Promise.all(dataList)).map(data => {
        if (data != null) {
            if(data.response.result.length){
                withBalance++;
                return data.address + "| BALANCE"
            }
            else {
                withoutBalance++;
                return data.address + "| NO BALANCE";
            }
        } else return null;
    })
    console.log("withBalance -> " + withBalance)
    console.log("withoutBalance -> " + withoutBalance)
    fs.writeFileSync("data/res.json", JSON.stringify(parsedData));
}
init()