async function main() {
  const [deployer, fakempc] = await ethers.getSigners();
  console.log()
  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const mpc = fakempc;
  // 23294 - 0x240630342a15CF382c81B5d914C7B90Ded4499A0
  // 23295 - 0xc510a45d4292Df914B39f8540c31b18F3d90C096
  console.log(
    "Use this mpc account:",
    mpc.address
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  console.log("\n##### Step 1: deploy AnycallExecutorProxy");

  const AnycallExecutorUpgradeable = await ethers.getContractFactory("AnycallExecutorUpgradeable");
  const anycallExecutorUpgradeable = await AnycallExecutorUpgradeable.deploy();
  console.log("AnycallExecutorUpgradeable deployed at:", anycallExecutorUpgradeable.address);

  const ProxyAdmin = await ethers.getContractFactory("ProxyAdmin");
  const proxyAdmin = await ProxyAdmin.deploy();
  console.log("ProxyAdmin deployed at:", proxyAdmin.address);

  const executorInitData = ethers.utils.hexConcat([
    "0x485cc955",
    ethers.utils.defaultAbiCoder.encode(
      ["address", "address"],
      [deployer.address, mpc.address])
  ]);

  console.log(
    "AnycallExecutorProxy constructor paramters:",
    anycallExecutorUpgradeable.address, proxyAdmin.address, executorInitData);

  const AnycallExecutorProxy = await ethers.getContractFactory("AnycallExecutorProxy");
  const anycallExecutorProxy = await AnycallExecutorProxy.deploy(
    anycallExecutorUpgradeable.address, proxyAdmin.address, executorInitData);
  console.log("AnycallExecutorProxy deployed at:", anycallExecutorProxy.address);

  console.log("\n##### Step 2: deploy AnycallV7Config");

  // PERMISSIONLESS_MODE = 1; FREE_MODE = 2;
  const mode = 3;
  const premium = 0;
  console.log(
    "AnycallV7Config constructor paramters:",
    deployer.address, mpc.address, premium, mode);

  const AnycallV7Config = await ethers.getContractFactory("AnycallV7Config");
  const anycallV7Config = await AnycallV7Config.deploy(deployer.address, mpc.address, premium, mode);
  console.log("AnycallV7Config deployed at:", anycallV7Config.address);

  console.log("\n##### Step 3: deploy AnycallV7Proxy");

  const AnyCallV7Upgradeable = await ethers.getContractFactory("AnyCallV7Upgradeable");
  const anyCallV7Upgradeable = await AnyCallV7Upgradeable.deploy();
  console.log("AnyCallV7Upgradeable deployed at:", anyCallV7Upgradeable.address);

  const anycallProxyInitData = ethers.utils.hexConcat([
    "0xf8c8765e",
    ethers.utils.defaultAbiCoder.encode(
      ["address", "address", "address", "address"],
      [deployer.address, mpc.address, anycallExecutorProxy.address, anycallV7Config.address])
  ]);

  console.log(
    "AnycallV7Proxy constructor paramters:",
    anyCallV7Upgradeable.address, proxyAdmin.address, anycallProxyInitData);

  const AnycallV7Proxy = await ethers.getContractFactory("AnycallV7Proxy");
  const anycallV7Proxy = await AnycallV7Proxy.deploy(anyCallV7Upgradeable.address, proxyAdmin.address, anycallProxyInitData);
  console.log("AnycallV7Proxy deployed at:", anycallV7Proxy.address);

  /*console.log("\n##### Step 4: set associations");

  const anycallV7Config = await ethers.getContractAt("AnycallV7Config", "0x3028b4395F98777123C7da327010c40f3c7Cc4Ef");
  const anycallV7Proxy = await ethers.getContractAt("AnycallV7Proxy", "0x4792C1EcB969B036eb51330c63bD27899A13D84e");
  const anycallExecutorProxy = await ethers.getContractAt("AnycallExecutorProxy", "0xF480f38C366dAaC4305dC484b2Ad7a496FF00CeA");

  // call `AnycallV7Config::initAnycallContract`
  await anycallV7Config.initAnycallContract(anycallV7Proxy.address);
  console.log("call AnycallV7Config::initAnycallContract with:", await anycallV7Config.anycallContract());

  // call `AnycallExecutorProxy::addSupportedCaller`
  const inputData = ethers.utils.hexConcat([
    "0x580e70d5",
    ethers.utils.defaultAbiCoder.encode(
      ["address"], [anycallV7Proxy.address])
  ]);
  const addSupportedCallerTx = await deployer.sendTransaction({
    to: anycallExecutorProxy.address,
    data: inputData
  });
  await addSupportedCallerTx.wait();
  console.log("call AnycallExecutorProxy::addSupportedCaller:",
    ethers.utils.defaultAbiCoder.decode(["address[]"],
      await ethers.provider.call({
        to: anycallExecutorProxy.address,
        data: "0xd726d061"
      })
    ));*/
  /*
    console.log("\n##### Step 5: deploy AppDemo");
  
    console.log(
      "AppDemo constructor paramters:",
      deployer.address, anycallV7Proxy.address);
  
    const AppDemo = await ethers.getContractFactory("AppDemo");
    const appDemo = await AppDemo.deploy(deployer.address, anycallV7Proxy.address);
    console.log("AppDemo deployed at:", appDemo.address);
  
    await appDemo.setClientPeers(
      [11111, 22222],
      [appDemo.address, appDemo.address]);
    console.log("call AppDemo::setClientPeers",
      [11111, 22222],
      [appDemo.address, appDemo.address]
    );
  
    {
      // normal case
      console.log("call AppDemo::callout",
        "hello",
        "0x1111111111111111111111111111111111111111",
        22222,
        4
      );
      const calloutTx = await appDemo.callout(
        "hello",
        "0x1111111111111111111111111111111111111111",
        22222,
        4
      );
      const calloutTxReceipt = await calloutTx.wait();
      console.log("callout tx (normal) logs are:", calloutTxReceipt.logs);
  
      const calloutTxHash = calloutTxReceipt.logs[1].transactionHash;
  
      const callData = calloutTxReceipt.logs[1].data;
      console.log("call data is:", callData);
  
      const anyExecuteInputData = ethers.utils.hexConcat([
        "0xd7328bad",
        ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "string", "bytes32", "address", "uint256", "uint256", "uint256", "bytes"],
          [
            appDemo.address,
            callData,
            "",
            calloutTxHash,
            appDemo.address,
            11111,
            1,
            4,
            "0x"
          ])
      ]);
  
      console.log("call anyExecute with input data:", anyExecuteInputData);
  
      const anyExecuteTx = await mpc.sendTransaction({
        to: anycallV7Proxy.address,
        data: anyExecuteInputData
      });
  
      const anyExecuteTxReceipt = await anyExecuteTx.wait();
      console.log("anyExecute tx (normal) logs are:", anyExecuteTxReceipt.logs);
    }
  
    {
      // fallback case
      console.log("call AppDemo::callout",
        "hello world",
        "0x1111111111111111111111111111111111111111",
        22222,
        4
      );
      const calloutTx = await appDemo.callout(
        "hello world",
        "0x1111111111111111111111111111111111111111",
        22222,
        4
      );
      const calloutTxReceipt = await calloutTx.wait();
      console.log("callout tx (fallback) logs are:", calloutTxReceipt.logs);
  
      const calloutTxHash = calloutTxReceipt.logs[1].transactionHash;
  
      const callData = calloutTxReceipt.logs[1].data;
      console.log("call data is:", callData);
  
      const anyExecuteInputData = ethers.utils.hexConcat([
        "0xd7328bad",
        ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "string", "bytes32", "address", "uint256", "uint256", "uint256", "bytes"],
          [
            appDemo.address,
            callData,
            "",
            calloutTxHash,
            appDemo.address,
            11111,
            1,
            4,
            "0x"
          ])
      ]);
  
      console.log("call anyExecute with input data:", anyExecuteInputData);
  
      const anyExecuteTx = await mpc.sendTransaction({
        to: anycallV7Proxy.address,
        data: anyExecuteInputData
      });
  
      const anyExecuteTxReceipt = await anyExecuteTx.wait();
      console.log("anyExecute tx (fallback) logs are:", anyExecuteTxReceipt.logs);
  
      console.log("exec fallback with budget")
      const depositFeeTx = await appDemo.depositFee({
        value: ethers.utils.parseEther("1.0")
      });
      await depositFeeTx.wait();
      console.log("budget is", await appDemo.executionBudget());
  
      const execTxHash = anyExecuteTxReceipt.logs[1].transactionHash;
  
      const execLogData = anyExecuteTxReceipt.logs[1].data;
  
      const decodedData = ethers.utils.defaultAbiCoder.decode(
        ["address", "bytes", "uint256", "uint256", "string", "uint256", "bytes"],
        execLogData
      );
  
      const fallbackCallData = decodedData[1];
      const fallbackExtData = decodedData[6];
      console.log("exec fallback call data is:", fallbackCallData);
      console.log("exec fallback call ext data is:", fallbackExtData);
  
      const execFallbackInputData = ethers.utils.hexConcat([
        "0xd7328bad",
        ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "string", "bytes32", "address", "uint256", "uint256", "uint256", "bytes"],
          [
            appDemo.address,
            fallbackCallData,
            "",
            execTxHash,
            appDemo.address,
            22222,
            1,
            2,
            fallbackExtData
          ])
      ]);
  
      console.log("exec fallback call anyExecute with input data:", execFallbackInputData);
  
      const execFallbackTx = await mpc.sendTransaction({
        to: anycallV7Proxy.address,
        data: execFallbackInputData
      });
  
      const execFallbackTxReceipt = await execFallbackTx.wait();
      console.log("anyExecute tx (exec fallback) logs are:", execFallbackTxReceipt.logs);
    }
  
    {
      // callback case
      const calloutTx = await appDemo.callout(
        "h",
        "0x1111111111111111111111111111111111111111",
        22222,
        4
      );
      const calloutTxReceipt = await calloutTx.wait();
      console.log("callout tx (callback) logs are:", calloutTxReceipt.logs);
  
      const prepareGasFeeTx = await deployer.sendTransaction({
        to: appDemo.address,
        value: ethers.utils.parseEther("0.5")
      });
      await prepareGasFeeTx.wait();
  
      const calloutTxHash = calloutTxReceipt.logs[1].transactionHash;
  
      const callData = calloutTxReceipt.logs[1].data;
      console.log("call data is:", callData);
  
      const anyExecuteInputData = ethers.utils.hexConcat([
        "0xd7328bad",
        ethers.utils.defaultAbiCoder.encode(
          ["address", "bytes", "string", "bytes32", "address", "uint256", "uint256", "uint256", "bytes"],
          [
            appDemo.address,
            callData,
            "",
            calloutTxHash,
            appDemo.address,
            11111,
            1,
            4,
            "0x"
          ])
      ]);
  
      console.log("call anyExecute with input data:", anyExecuteInputData);
  
      const anyExecuteTx = await mpc.sendTransaction({
        to: anycallV7Proxy.address,
        data: anyExecuteInputData
      });
  
      const anyExecuteTxReceipt = await anyExecuteTx.wait();
      console.log("anyExecute tx (callback) logs are:", anyExecuteTxReceipt.logs);
    }
    */
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });