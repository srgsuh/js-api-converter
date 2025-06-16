class MockConverter {
    constructor(apikey, url) {}

    async symbols() {
        return {
            USD: "American dollar",
            EUR: "Euro",
            NIS: "New Israel Shekel"
        }
    }

    async convert({toValue, fromValue, amount}) {
        const rate = 2.0;
        return {
            date: "2025-06-15",
            historical: "",
            info: {
                rate,
                timestamp: 1519328414
            },
            query: {
                amount: amount,
                from: fromValue,
                to: toValue
            },
            result: rate * amount,
            success: true
        }
    }
}