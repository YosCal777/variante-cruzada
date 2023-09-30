//Exportando consulta API
import fetch from 'node-fetch';

export async function result() {
    try {
      const response = await fetch("https://result-roulett.onrender.com");
      const data = await response.json();
      return data; // Devuelve los datos
    } catch (err) {
      console.log('Fetch Error :-S', err);
    }
}
