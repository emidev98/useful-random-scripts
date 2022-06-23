const fs = require('fs');

let contractsList = [];

fs.readdirSync('.', (err, files) => {
    console.log(files);

    files.forEach(file => {
        if (file.includes('.wasm')) {
            const wasmByteCodeBase64 = fs.readFileSync(file)
                .toString('base64');

            contractsList.push(
                {
                    store_code: {
                        title: file.replace('.wasm', '').toUpperCase(),
                        sender: "",
                        wasm_byte_code: wasmByteCodeBase64,
                        instantiate_permission: {
                            permission: "Everybody",
                            address: ""
                        }
                    }
                });
            fs.writeFileSync("contracts.json", JSON.stringify(contractsList));
        }
    });
})