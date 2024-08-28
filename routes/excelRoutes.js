"use strict"
const excelModel = require("../models/excelModels.js");

/**
 * Função para retornar a lista de tempos do Excel e passar a informação
 * para a plataforma que fez o pedido (neste caso o browser).
 * @param {*} req 
 * @param {*} res 
*/
function getTempos(req, res){
    let tempos = excelModel.getTimes(function (resultObject) {
        if (resultObject.error) {
            res.json({"message": "error", "error": resultObject.error });
        } else {
            res.json({"message": "success", "tempos": resultObject.tempos });
		}
    });
}

/**
 * Função para retornar a lista de tempos do Excel e passar a informação
 * para a plataforma que fez o pedido (neste caso o browser).
 * @param {*} req 
 * @param {*} res 
*/
function getWeekHours(req, res){
    let tempos = excelModel.getHours(function (resultObject) {
        if (resultObject.error) {
            res.json({"message": "error", "error": resultObject.error });
        } else {
            res.json({"message": "success", "horas": resultObject.horas });
		}
    }, 2, 7);
}

/**
 * Função para retornar a lista de tempos do Excel e passar a informação
 * para a plataforma que fez o pedido (neste caso o browser).
 * @param {*} req 
 * @param {*} res 
*/
function getWeekendHours(req, res){
    let tempos = excelModel.getHours(function (resultObject) {
        if (resultObject.error) {
            res.json({"message": "error", "error": resultObject.error });
        } else {
            res.json({"message": "success", "horas": resultObject.horas });
		}
    }, 10, 15);
}

/**
 * Função para retornar a lista de pessoas da BD e passar a informação
 * para a plataforma que fez o pedido (neste caso o browser).
 * @param {*} req 
 * @param {*} res 
 */
function getResults(req, res){
    let getResult = excelModel.getResultsFromExcel(function (resultObject) {
        if (resultObject.error) {
            res.json({"message": "error", "error": resultObject.error });
        } else {
			res.json({"message": "success", "info": resultObject.info });
		}
    }, req.body.info );
}


module.exports.getTempos = getTempos;
module.exports.getWeekHours = getWeekHours;
module.exports.getWeekendHours = getWeekendHours;
module.exports.getResults = getResults;