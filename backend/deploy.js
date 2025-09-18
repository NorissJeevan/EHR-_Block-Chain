const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

// Connect to Ganache
const web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:8000"));

const deploy = async () => {
  try {
    // 1. Read the Solidity source code
    const sourceCode = fs.readFileSync('./contracts/Cruds.sol', 'utf8');

    // 2. Define the input for the Solidity compiler
    const input = {
      language: 'Solidity',
      sources: {
        'Cruds.sol': {
          content: sourceCode,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*'],
          },
        },
      },
    };

    // 3. Compile the code using a specific compiler version
    console.log('Compiling contract...');
    // The 'solc.compile' function can take a JSON-formatted input
    const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));

    // Handle potential compilation errors
    if (compiledCode.errors) {
        compiledCode.errors.forEach(err => {
            console.error(err.formattedMessage);
        });
        throw new Error("Solidity compilation failed.");
    }
    
    const contractFile = compiledCode.contracts['Cruds.sol']['Cruds'];
    const abi = contractFile.abi;
    const bytecode = contractFile.evm.bytecode.object;

    // 4. Get a list of all accounts from Ganache
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("Couldn't get any accounts! Make sure Ganache is running.");
    }

    console.log('Attempting to deploy from account:', accounts[0]);

    // 5. Create a new contract instance and deploy it
    const contract = new web3.eth.Contract(abi);
    const deployedContract = await contract.deploy({
      data: '0x' + bytecode,
    }).send({
      from: accounts[0],
      gas: 1500000,
    });

    console.log('Contract deployed successfully to:', deployedContract.options.address);

  } catch (error) {
    console.error("Deployment failed:", error);
  }
};

deploy();