import { WebSocketClient } from '@terra-money/terra.js';

const client = new WebSocketClient('ws://localhost:26657/websocket');

client.subscribe('Tx', {}, (_data) => {
    const data = JSON.parse(_data.value.TxResult.result.log);
    console.log(JSON.stringify(data, null, 4));
});

client.start();