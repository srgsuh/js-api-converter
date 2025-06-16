class ConvertResult {
    constructor(currencyToGive, currencyToGet, amountToGive, amountToGet, exchangeRate) {
        return {
            currencyToGive,
            currencyToGet,
            amountToGive,
            amountToGet,
            exchangeRate,
        }
    }
}