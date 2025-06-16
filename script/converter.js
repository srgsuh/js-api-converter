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

    async convert({to, from, amount}) {
        const requestUrl = `${this._url}/convert?to=${to}&from=${from}&amount=${amount}`;

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: this._buildHeaders(),
        };
        const response = await fetch(requestUrl, requestOptions);

        if (!response.ok) {
            throw new Error(`Server respond status: ${response.status}`);
        }
        return response.json();
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

        return response.json();
    }
}