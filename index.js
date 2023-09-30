import express from "express";
import { getResults } from "./send-results.js";

const app = express();

// Constantes
const ROWS = 12;
const COLUMNS = 3;
const GROUPS = 4;

// Funciones
const getResults = async () => {
    const resultData = await getResults();
    return resultData.hoy.lottoActivo_hoy.map(val => (val === "0") ? 37 : (val === "00") ? 38 : Number(val));
};

const findMatchingNumbers = (results) => {
    let num1 = results[results.length - 1];
    let filaNum1 = Math.floor((num1 - 1) / COLUMNS);
    let colNum1 = (num1 - 1) % COLUMNS;
    let num2;
    let filaNum2;
    let colNum2;
    let index = results.length - 2;
    while (index >= 0) {
        num2 = results[index];
        filaNum2 = Math.floor((num2 - 1) / COLUMNS);
        colNum2 = (num2 - 1) % COLUMNS;
        if (num1 >= 1 && num1 <= 36 && num2 >= 1 && num2 <= 36 && filaNum1 !== filaNum2 && colNum1 !== colNum2 && Math.floor(filaNum1 / GROUPS) !== Math.floor(filaNum2 / GROUPS)) {
            break;
        }

        index--;
        if (index >= 0) {
            num1 = num2;
            filaNum1 = filaNum2;
            colNum1 = colNum2;
        }
    }

    return { num1, num2 };
};

const generateCrossoverVariant = (num1, num2) => {
    const grupoNum1 = Math.floor(num1 / GROUPS);
    const grupoNum2 = Math.floor(num2 / GROUPS);
    const varianteCruzada1 = [];
    for (let i = grupoNum2 * GROUPS; i < (grupoNum2 + 1) * GROUPS; i++) {
        varianteCruzada1.push(num1);
    }
    const varianteCruzada2 = [];
    for (let i = grupoNum1 * GROUPS; i < (grupoNum1 + 1) * GROUPS; i++) {
        varianteCruzada2.push(num2);
    }

    return varianteCruzada1.concat(varianteCruzada2);
};

// Ruta
app.get("/", async(req, res) => {
    try {
        const results = await getResults();
        const matchingNumbers = findMatchingNumbers(results);
        const crossoverVariant = generateCrossoverVariant(matchingNumbers.num1, matchingNumbers.num2);

        res.json(crossoverVariant);
    } catch (error) {
        res.json({ error });
    }
});

// Puerto
const PORT = process.env.PORT || 5000;

// Servidor
app.listen(PORT, () => console.log("Server funcionando desde:" + PORT));

