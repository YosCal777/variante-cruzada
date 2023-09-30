import express from "express";
import { result } from './send-results.js';
import cors from 'cors';

const app = express();

const processData = async (type) => {
    let resultData = await result();
    let dataYestLA = resultData.ayer[type].map(val => (val === "0") ? 37 : (val === "00") ? 38 : Number(val));
    let dataTodayLA = resultData.hoy[type + '_hoy'].map(val => (val === "0") ? 37 : (val === "00") ? 38 : Number(val));
    return dataYestLA.concat(dataTodayLA);
}

const getVarianteCruzada = async (type) => {
    try {
        let matrizResults = await processData(type);

        let num1 = matrizResults[matrizResults.length - 1];
        let filaNum1 = Math.floor((num1 - 1) / 3);
        let colNum1 = (num1 - 1) % 3;
        let num2;
        let filaNum2;
        let colNum2;
        let index = matrizResults.length - 2;
        while (index >= 0) {
            num2 = matrizResults[index];
            filaNum2 = Math.floor((num2 - 1) / 3);
            colNum2 = (num2 - 1) % 3;
            if (num1 >= 1 && num1 <= 36 && num2 >= 1 && num2 <= 36 && filaNum1 !== filaNum2 && colNum1 !== colNum2 && Math.floor(filaNum1 / 4) !== Math.floor(filaNum2 / 4)) {
                break;
            }
            
            index--;
            if (index >= 0) {
                num1 = num2;
                filaNum1 = filaNum2;
                colNum1 = colNum2;
            }
        }

        let matriz = [];
        let contador = 1;
        for (let i = 0; i < 12; i++) {
            let fila = [];
            for (let j = 0; j < 3; j++) {
                fila.push(contador);
                contador++;
            }
            matriz.push(fila);
        }
        
        let grupoNum1 = Math.floor(filaNum1 / 4);
        let grupoNum2 = Math.floor(filaNum2 / 4);
        let varianteCruzada1 = [];
        for (let i = grupoNum2 * 4; i < (grupoNum2 + 1) * 4; i++) {
            varianteCruzada1.push(matriz[i][colNum1]);
        }
        
        let varianteCruzada2 = [];
        for (let i = grupoNum1 * 4; i < (grupoNum1 + 1) * 4; i++) {
            varianteCruzada2.push(matriz[i][colNum2]);
        }
        
        return varianteCruzada1.concat(varianteCruzada2);

        

    } catch (error) {
        return { error };
    }
}

app.get("/", cors(), (req, res) => {
    res.send("Bienvenido a mi aplicación!");
});

app.get("/lotto-activo", cors(), async(req, res) => {
    res.json(await getVarianteCruzada('lottoActivo'));
});

app.get("/la-granjita", cors(), async(req, res) => {
    res.json(await getVarianteCruzada('laGranjita'));
});

app.get("/selva-plus", cors(), async(req, res) => {
    res.json(await getVarianteCruzada('selvaPlus'));
});

app.get("/lotto-rey", cors(), async(req, res) => {
    res.json(await getVarianteCruzada('lottoRey'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server funcionando desde:" + PORT));
