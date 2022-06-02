import { LCDClient, MnemonicKey, MsgUpdateContractAdmin } from "@terra-money/terra.js";

const terra = new LCDClient({
  URL: "https://pisco-lcd.terra.dev",
  chainId: "phoenix-1",
});

const mk = new MnemonicKey({
    mnemonic: "..." 
});
const wallet = terra.wallet(mk);
const contractAddress = "terra1nrj702lu28g7yz9655jvhh0nnuy6ugaawualk5atxtegnxqga4lslxj2w5";
const newAdmin = "terra1m9zsx5hku0lu843tm02f4d9akhs3tu2wnduelm";

const updateAdmin = async () => {
    console.log(`Moving admin of ${contractAddress} to ${newAdmin} current acc ${wallet.key.accAddress}`);

    const updateAdmin = new MsgUpdateContractAdmin(
        wallet.key.accAddress,
        newAdmin,
        contractAddress
    );

    const updateAdminTx = await wallet.createTx({
        msgs: [updateAdmin],
    });

    console.log(updateAdminTx)
    const updateAdminTxResult = await client.tx.broadcastBlock(updateAdminTx);

    if (isTxError(updateAdminTxResult)) {
        throw new Error("admin update failed");
    }
};

updateAdmin()
    .then(console.log)
    .catch((e)=> console.error(e));