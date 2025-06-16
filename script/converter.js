class Converter {
    _apiKey;
    _url;

    constructor(apiKey, url) {
        this._apiKey = apiKey;
        this._url = url;
    }

    _buildHeaders() {
        const headers = new Headers();
        headers.append("apikey", this._apiKey);
        return headers;
    }

    async convert({toValue, fromValue, amount}) {
        const requestUrl = `${this._url}/convert?to=${toValue}&from=${fromValue}&amount=${amount}`;

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: this._buildHeaders(),
        };
        const response = await fetch(requestUrl, requestOptions);

        if (!response.ok) {
            throw new Error(`Server respond status: ${response.status}`);
        }
        const obj = await response.json();
        console.log("Convert receive: ", obj);
        return obj;
    }

    async symbols() {
        const requestUrl = `${this._url}/symbols`;
        const requestOptions = {
            method: 'GET',
            headers: this._buildHeaders(),
        };
        const response = await fetch(requestUrl, requestOptions);

        if (!response.ok) {
            throw new Error(`Server respond status: ${response.status}`);
        }

        const obj = await response.json();
        return obj.symbols;
    }
}