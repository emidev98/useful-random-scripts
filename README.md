# Useful (most of the times) random scripts

Is a collection of scripts that automatize random things which I was lazy to do manually:

- supply-at-height: search for a specific supply at a specific height using Cosmos API iterating block by block.
- top-validators-multi-send: get the 130 top validators and transfer 1UST to each.
- snapshot-mirror-protocol.js: retrieve the native collateral owners with the amount and store the data inside ./data/[address].json,
- update-admin: uses terra.js to update a contract admin,
- init-cosmos-chain: initialize the Terra 2 cosmos chain but it can be used with different chains just changing the daemon,
-  connect-ws: snipped to connect to terra's ws with terra.js,
- contracts-genesis-parse: read the wasm code and prepares teh store_code object for each one of them