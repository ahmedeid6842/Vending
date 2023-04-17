module.exports.paymentChange = (remainingChange) => {
    const coins = [100, 50, 20, 10, 5];
    const changeCoins = {};
    coins.forEach((coin) => {
        if (remainingChange >= coin) {
            const count = Math.floor(remainingChange / coin);
            changeCoins[coin] = count;
            remainingChange -= count * coin;
        }
    });
    return changeCoins;
}