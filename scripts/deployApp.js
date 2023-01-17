async function main() {
    const AnyCallReceiver = await ethers.getContractFactory("AnyCallReceiver");
    const anyCallReceiver = await AnyCallReceiver.deploy();
    console.log("AnyCallReceiver deployed at:", anyCallReceiver.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });