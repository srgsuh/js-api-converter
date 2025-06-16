const ERROR_PROBABILITY = 0.5;
const MOCK_TIMEOUT = 1000;

class MockConverter {
    constructor(timeout = MOCK_TIMEOUT, errorProbability = ERROR_PROBABILITY) {
        this.errorProbability = errorProbability;
        this.serverTimeout = timeout;
    }

    isRandomErrorOccurred() {
        return (Math.random() < this.errorProbability);
    }

    mockError(errorMessage) {
        if (this.isRandomErrorOccurred()) {
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    async symbols() {
        await new Promise(resolve => setTimeout(resolve, this.serverTimeout));

        this.mockError('Mock server error occurred while requesting currency codes');

        return {
            USD: "American dollar",
            EUR: "Euro",
            NIS: "New Israel Shekel"
        }
    }

    async convert({toValue, fromValue, amount}) {
        await new Promise(resolve => setTimeout(resolve, this.serverTimeout));

        this.mockError('Mock server error occurred while requesting conversion');

        const rate = 3.95;
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