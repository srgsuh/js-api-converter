
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
        this.converter.symbols().then(symbols => {
            this._fillCurrencyOptions(this.selectFrom, symbols);
            this._fillCurrencyOptions(this.selectTo, symbols);
        })
    }

    _fillCurrencyOptions(selectElement, symbols) {
        Object.entries(symbols).forEach(([code, name]) => {
            selectElement.add(new Option(`${name}`, code));
        });
    }

    getInputData() {
        const {value: fromValue, text: fromText} = this.selectFrom.item(this.selectFrom.selectedIndex);
        const {value: toValue, text: toText} = this.selectTo.item(this.selectTo.selectedIndex);
        const amount = this.inputAmount.value;
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
            errors.push('From currency is required');
        }
        if (!toValue) {
            errors.push('To currency is required');
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
        this.hideErrors();
        const inputData = this.getInputData();
        const errors = this._validate(inputData);
        errors.length > 0? this.showErrors(errors): this.convert(inputData);
    }

    hideErrors() {
        this.errorOutput.innerHTML = '';
    }

    showErrors(errors) {
        console.log(errors);
        const p = document.createElement('p');
        p.textContent = errors.join(', ');
        this.errorOutput.append(p);
        this.enableButton();
    }

    convert(inputData) {
        this.converter.convert(inputData)
            .then(obj => {
                this.showConvertResult(obj.success, obj.result, obj.query);
            })
    }

    showConvertResult(success, result, query) {
        console.log(success, result, query);
        const p = document.createElement('p');
        p.textContent = `You give ${query.amount} of ${query.from} and receive ${result} of ${query.to}`;
        this.resultContainer.append(p);
        this.enableButton();
    }
}

// const form = new Form(new Converter(mainConfig.apiKey, mainConfig.url));
const form = new Form(new MockConverter(mainConfig.apiKey, mainConfig.url));



//converter.convert({to:'EUR',from:'GEL', amount: 100}, console.log);
//converter.symbols(fillForm);