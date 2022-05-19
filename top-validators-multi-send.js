import fetch from 'node-fetch';
import { AccAddress, LCDClient, MnemonicKey, MsgMultiSend, SignDoc } from '@terra-money/terra.js';

const init = async () => {
    const LCD_URL = "https://api.terra.dev/validators";
    let response = await (await fetch(LCD_URL)).json();
    let inputAmount = 0;
    response = response
        .sort((a, b) => (a.tokens > b.tokens) ? 1 : -1)
        .slice(0,130);
    async function main() {
        const client = new LCDClient({
            URL: "https://lcd.terra.dev/",
            chainID: "columbus-5"
        });
        const key = new MnemonicKey({
            mnemonic: "",
        });
        const output = response.map(validator => {
            inputAmount = inputAmount + 1000000;
            return new MsgMultiSend.Output(
                AccAddress.fromValAddress(validator.operator_address),
                { uusd: "1000000" }
            );
        });
        const input = [
            new MsgMultiSend.Input(key.accAddress, { uusd: inputAmount, })
        ];
        const accInfo = await client.auth.accountInfo(key.accAddress);
        const tx = await client.tx.create(
            [
                { address: key.accAddress, sequenceNumber: accInfo.getSequenceNumber() }
            ],
            {
                msgs: [new MsgMultiSend(input, output)]
            }
        );

        const sig1 = await key.createSignatureAmino(
            new SignDoc(
                client.config.chainID,
                accInfo.getAccountNumber(),
                accInfo.getSequenceNumber(),
                tx.auth_info,
                tx.body
            )
        );

        tx.appendSignatures([sig1]);
        console.log(JSON.stringify(tx.toData()));
        client.tx.broadcast(tx).then(console.log);
    }

    main().catch(console.error);
}
init()