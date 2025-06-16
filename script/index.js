
class Form{
    selectFrom;
    selectTo;
    inputAmount;
    btnConvert;
    errorOutput;
    resultContainer;

    converter;

    constructor(converter){
        this.selectFrom = document.getElementById('select-from');
        this.selectTo = document.getElementById('select-to');
        this.inputAmount = document.getElementById('input-amount');
        this.btnConvert = document.getElementById('convert-button');
        this.errorOutput = document.getElementById('error-output');
        this.resultContainer = document.getElementById('results-container');

        this.converter = converter;

        this.btnConvert.addEventListener('click', () => this.convertClick());

        this._init();
    }
    _init() {
        this.converter.symbols()
            .then(symbols => {
                this._fillCurrencyOptions(this.selectFrom, symbols);
                this._fillCurrencyOptions(this.selectTo, symbols);
            })
            .catch((err) => {this.showErrors(['Network error: ' + err.message]);});
    }

    _fillCurrencyOptions(selectElement, symbols) {
        Object.entries(symbols).forEach(([code, name]) => {
            selectElement.add(new Option(`${name} (${code})`, code));
        });
    }

    getInputData() {
        const {value: fromValue, text: fromText} = this.selectFrom.item(this.selectFrom.selectedIndex);
        const {value: toValue, text: toText} = this.selectTo.item(this.selectTo.selectedIndex);
        const amount = +this.inputAmount.value;
        return {
            fromValue,
            fromText,
            toValue,
            toText,
            amount,
        }
    }

    _validate({fromValue, fromText, toValue, toText, amount}) {
        const errors = [];
        if (!fromValue) {
            errors.push('Currency to convert is required');
        }
        if (!toValue) {
            errors.push('Currency to receive is required');
        }
        if (fromValue && toValue && fromValue === toValue) {
            errors.push(`You cannot convert ${fromText} to a ${toText}`);
        }
        if (!amount) {
            errors.push('Amount is required');
        }
        else if (!isFinite(amount) || amount < 0) {
            errors.push('Enter valid amount');
        }
        return errors;
    }

    disableButton() {
        this.btnConvert.disabled = true;
    }

    enableButton() {
        this.btnConvert.disabled = false;
    }

    convertClick() {
        this.disableButton();
        this.clearOutputs();
        const inputData = this.getInputData();
        const errors = this._validate(inputData);
        if (errors.length > 0) {
            this.showErrors(errors);
            return;
        }
        this.convert(inputData);
    }

    clearOutputs() {
        this.errorOutput.innerHTML = '';
        this.resultContainer.innerHTML = '';
    }

    convert(inputData) {
        this.converter.convert(inputData)
            .then(conversion => {
                this.showConvertResult(conversion);
            })
            .catch(err => {
                this.showErrors(["Ошибка при выполнении запроса: " + err.message]);
            })
    }

    pFromText(text) {
        const p = document.createElement('p');
        p.textContent = text;
        return p;
    }

    showConvertResult(conversion) {
        console.log('showConvertResult', conversion);
        const {currencyToGive, currencyToGet, amountToGive, amountToGet, exchangeRate} = conversion;

        this.clearOutputs();

        this.resultContainer.append(
            this.pFromText(
                `You can convert ${amountToGive} ${currencyToGive} to ${amountToGet} ${currencyToGet}`
            ),
            this.pFromText(
                `An exchange rate is: ${exchangeRate}`
            )
        );

        this.enableButton();
    }

    showErrors(errors) {
        console.error(errors);

        this.clearOutputs();

        const p = document.createElement('p');
        p.textContent = errors.join(', ');
        this.errorOutput.append(p);

        this.enableButton();
    }
}


const mockConverter = new MockConverter();
const realConverter = new Converter(mainConfig.apiKey, mainConfig.url);

//const form = new Form(mockConverter);
const form = new Form(realConverter);