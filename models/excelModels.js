"use strict"
const excel = require('xlsx');
const file = excel.readFile('TABELA DE PUBLICIDADE.xlsx');
const priceSheet = file.Sheets["Price"];

/**
 * Função para retornar os tempos do excel.
 * @param {Function} callback Função de callback para ser chamada após obtermos o resultado do Excel
*/
function getTimes(callback) {
    const tempos = [];
    for (let col = 'B'; col <= 'M'; col = String.fromCharCode(col.charCodeAt(0) + 1)) {
        const cellKey = col + '1';
        tempos.push(priceSheet[cellKey].v);
    }
    if (!tempos || tempos.length == 0) {
        return callback({ error: 'Os tempos não estão a ser retornados' })
    }
    return callback({ tempos: tempos });
}

/**
 * Função para retornar as horas do excel.
 * @param {Function} callback Função de callback para ser chamada após obtermos o resultado do Excel
*/
function getHours(callback, firstLine, lastLine) {
    const horas = [];
    for (let row = firstLine; row <= lastLine; row++) {
        const cellKey = `A${row}`;
        horas.push(priceSheet[cellKey].v);
    }
    if (!horas || horas.length == 0) {
        return callback({ error: 'As horas não estão a ser retornados' })
    }
    return callback({ horas: horas });
}

function getResultsFromExcel(callback, info) {
    let totalPrice = 0;
    let finalPrice = 0;
    const taxConst = 0.23;
    const ipacaConst = 0.04;
    const comissao = priceSheet['A18'].v / 100;

    info.forEach(elem => {
        const unitPrice = priceSheet[elem.coordenada].v;
        totalPrice += unitPrice * elem.quantity;

    });
    totalPrice += totalPrice*comissao;
    const taxPrice = totalPrice * taxConst;
    const ipacaPrice = totalPrice * ipacaConst;
    finalPrice += totalPrice + taxPrice + ipacaPrice;
    return callback({
        info: {
            finalPrice: finalPrice,
            totalPrice: totalPrice,
            taxPrice: taxPrice,
            ipacaPrice: ipacaPrice
        }
    });
}


module.exports.getTimes = getTimes;
module.exports.getHours = getHours;
module.exports.getResultsFromExcel = getResultsFromExcel;