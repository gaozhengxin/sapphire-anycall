async function main() {
    const [_, mpc] = await ethers.getSigners();

    /*const anycallV7Proxy = await ethers.getContractAt("AnyCallV7Upgradeable", "0x4792C1EcB969B036eb51330c63bD27899A13D84e");
    console.log(`admin : ${await anycallV7Proxy.admin()}`);
    let tx = await anycallV7Proxy.anyExec(
        "0xb2c22A9fb4FC02eb9D1d337655Ce079a04a526C7",
        "111",
        "",
        (
            "0x0c3d20f643031de4158a341e52a54ce2eb53f1ec8db92b16cf9f351529dbd339",
            "0xfA9dA51631268A30Ec3DDd1CcBf46c65FAD99251",
            5,
            75,
            0
        ),
        "01"
    );
    */

    const anyExecuteInputData = ethers.utils.hexConcat([
        "0xd7328bad",
        ethers.utils.defaultAbiCoder.encode(
            ["address", "bytes", "string", "bytes32", "address", "uint256", "uint256", "uint256", "bytes"],
            [
                "0xb2c22A9fb4FC02eb9D1d337655Ce079a04a526C7",
                111,
                "",
                "0x0c3d20f643031de4158a341e52a54ce2eb53f1ec8db92b16cf9f351529dbd339",
                "0xfA9dA51631268A30Ec3DDd1CcBf46c65FAD99251",
                5,
                75,
                0,
                111
            ])
    ]);

    console.log("call anyExecute with input data:", anyExecuteInputData);

    const tx = await mpc.sendTransaction({
        to: "0x4792C1EcB969B036eb51330c63bD27899A13D84e",
        data: anyExecuteInputData
    });

    console.log(`tx : ${JSON.stringify(await tx.wait())}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });