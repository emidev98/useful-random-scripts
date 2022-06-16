#!/bin/bash
set -eu
PATH=build:$PATH

MONIKER=kernel_panic
VALIDATOR=kernel_panic_validator
CHAIN=kernel_panic_chain

# Init the validator with the chain id
terrad init $MONIKER --chain-id $CHAIN

# Create the validator keys
terrad keys add $VALIDATOR --keyring-backend test

# Store validator address on a var
MY_VALIDATOR_ADDRESS=$(terrad keys show $VALIDATOR -a --keyring-backend test)

# Create genesis account with the validator address
terrad add-genesis-account $MY_VALIDATOR_ADDRESS 100000000uluna

# Create genesis transaction
terrad gentx $$VALIDATOR 100000000uluna --chain-id $CHAIN --keyring-backend test

# Create collect genesis transaction
terrad collect-gentxs

# start with: terrad start