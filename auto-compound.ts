import { Coin, Coins, Delegation, LCDClient, MnemonicKey, MsgDelegate, MsgWithdrawDelegatorReward } from '@terra-money/terra.js';

// Create a key out of a mnemonic
const mk = new MnemonicKey({ mnemonic: '' });

// Connect to testnet
const lcd = new LCDClient({ URL: 'https://pisco-lcd.terra.dev', chainID: 'pisco-1' });

// Create the wallet
const wallet = lcd.wallet(mk);

const init = async () => {
  while (true) {
    try {
      const delegationRes = await parseDelegations();
      const delegateRws = await delegateCoins(delegationRes);

      console.log(`[${delegateRws.height}][${delegateRws.timestamp}] Delegate => ${delegateRws.txhash}`);
    }
    catch (e) { console.log(e) }

    await setTimeout(() => { }, 1000 * 20);
  }
};

const parseDelegations = async () => {
  const [delegationRes] = await lcd.staking.delegations(wallet.key.accAddress);

  return delegationRes.filter(delegation => {
    return delegation.balance.amount.gt(0);
  });
};

// When a delegation is executed it also collects the rewards
const delegateCoins = async (delegations: Delegation[]) => {
  const [balance] = await lcd.bank.balance(wallet.key.accAddress);
  const amountToDelegate = calculateAmountToDelegate(balance, delegations.length);
  const msgs: MsgDelegate[] = [];

  delegations.forEach(delegation => {
    const msg = new MsgDelegate(
      wallet.key.accAddress,
      delegation.validator_address,
      amountToDelegate
    );

    msgs.push(msg);
  });

  const txSign = await wallet.createAndSignTx({ msgs, memo: 'by. https://github.com/emidev98' });
  return lcd.tx.broadcast(txSign);
};

const calculateAmountToDelegate = (coins: Coins, totalDelegations: number) => {
  return (coins.get('uluna') as Coin)
    .sub((10 ** 6)) // Keep 1 luna in wallet
    .div(totalDelegations) as Coin;
};

// Unused function buuuuut ...
// ... is already coded and looks pretty cool so it stays here
const withdrawReward = async (delegations: Delegation[]) => {
  const msgs: MsgWithdrawDelegatorReward[] = [];

  delegations.forEach(delegation => {
    const msg = new MsgWithdrawDelegatorReward(
      wallet.key.accAddress,
      delegation.validator_address
    );

    msgs.push(msg);
  });

  const txSign = await wallet.createAndSignTx({ msgs, memo: 'by. https://github.com/emidev98' });
  return lcd.tx.broadcast(txSign);
}

init();