// ==UserScript==
// @name         NP Input Formatter
// @namespace    https://github.com/Zahjar2/
// @version      2024-04-26
// @description  try to take over the world!
// @author       Zahjar2
// @match        https://www.neopets.com/market.phtml*
// @match        https://www.neopets.com/bank.phtml*
// @match        https://www.neopets.com/auctions.phtml*
// @match        https://www.neopets.com/inventory.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @run-at       document-end
// @grant        none
// @updateURL    https://github.com/Zahjar2/NP-Input-Formatter/blob/main/NP-Input-Formatter.user.js
// @downloadURL  https://github.com/Zahjar2/NP-Input-Formatter/blob/main/NP-Input-Formatter.user.js
// ==/UserScript==

/*
*
* // @match        https://www.neopets.com/market.phtml*
*  For inputing your shop prices
*
* // @match        https://www.neopets.com/bank.phtml*
*  For inputing your deposit/withdraw amount
*
* // @match        https://www.neopets.com/auctions.phtml*
*  For inputing your bid
*
* // @match        https://www.neopets.com/inventory.phtml*
*  For inputing your initial price and increment when auctioning an item
*
*/

var valid_inputs = [];
const reNumsSign = '';
const moneySourceData = document.querySelector("#npanchor").innerText.replace(/,/g, '');
const rules = {
    digit: function (value) {
        var re = new RegExp('^(' + reNumsSign + '[1-9]\\d*)$', 'i');
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch) ? inputMatch[1] : null;
    },
    float: function (value) {
        var re = new RegExp('^(' + reNumsSign + '[1-9]\\d*(?:[,]\\d{3})*)(?:[.]\\d{10})?$', 'i');
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch) ? inputMatch[1] : null;
    },
    all: function (value) {
        var re = /^(all|max){1}$/i;
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch && moneySourceData) ? moneySourceData : null;
    },
    thousand: function (value) {
        var re = new RegExp('^(' + reNumsSign + '\\d+[.]?(\\d{1,3})?)k$', 'i');
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch) ? Math.round(inputMatch[1] * 1000) : null;
    },
    million: function (value) {
        var re = new RegExp('^(' + reNumsSign + '\\d+[.]?(\\d{1,6})?)m$', 'i');
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch) ? Math.round(inputMatch[1] * 1000000) : null;
    },
    billion: function (value) {
        var re = new RegExp('^(' + reNumsSign + '\\d+[.]?(\\d{1,9})?)b$', 'i');
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch) ? Math.round(inputMatch[1] * 1000000000) : null;
    },
    quarter: function (value) {
        var re = /^(1\/4|quarter){1}$/i;
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch && moneySourceData) ? Math.round(parseInt(moneySourceData) / 4) : null;
    },
    third: function (value) {
        var re = /^(1\/3){1}$/i;
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch && moneySourceData) ? Math.round(parseInt(moneySourceData) / 3) : null;
    },
    half: function (value) {
        var re = /^(1\/2|half){1}$/i;
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch && moneySourceData) ? Math.round(parseInt(moneySourceData) / 2) : null;
    },
    percent: function (value) {
        var re = /^([1-9][0-9]?|100)%$/i;
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch && moneySourceData) ? Math.round(parseInt(moneySourceData) * inputMatch[1] / 100) : null;
    },
    firstZero: function (value) {
        var re = /^([0])/i;
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch) ? inputMatch[1] : null;
    },
    zero: function (value) {
        var re = /^([0])$/i;
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch && !options.strictMode) ? inputMatch[1] : null;
    },
    fraction: function (value) {
        var re = /^(([1-9])\/([2-9]|10))$/i;
        var inputValue = value;
        var inputMatch = re.exec(inputValue);
        return (inputMatch && moneySourceData && (parseInt(inputMatch[2]) < parseInt(inputMatch[3]))) ? Math.round(parseInt(moneySourceData) * inputMatch[2] / inputMatch[3]) : null;
    }
};

function formatter() {
    let input_element = this;
    var result;
    var inputValue = input_element.value = input_element.value.replace(/,/g, '');
    for (var ruleName in rules) {
        if (rules.hasOwnProperty(ruleName)) {
            var method = rules[ruleName];
            inputValue = inputValue.trim();
            result = method(inputValue);
            if (result || result == 0) {
                var intValue = parseInt(result.toString().replace(/,/g, ''));
                inputValue = intValue.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,');
                input_element.value = intValue;
                return false;
            }
        }
    }
}


(function () {
    'use strict';
    valid_inputs.push(...document.querySelectorAll("input[type='text'][name^='cost_']"));
    valid_inputs.push(...document.querySelectorAll("input[type='text'][name='amount']"));
    valid_inputs.push(...document.querySelectorAll("input[type='text'][name='start_price']"));
    valid_inputs.push(...document.querySelectorAll("input[type='text'][name='min_increment']"));
    valid_inputs.push(...document.querySelectorAll("input[type='text'][name='neopoints']"));
    console.log(valid_inputs)
    valid_inputs.forEach((element) => {
        console.log(element)
        element.addEventListener('keyup', formatter);
    })
})();
