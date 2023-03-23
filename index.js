const express = require('express');
const axios = require('axios');

const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

app.use(express.json());

// Configurar body-parser para poder leer el body de las peticiones
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para la generación de texto
app.get('/generate', async (req, res) => {
  const { prompt } = req.query;

  // Configuración de Axios para la solicitud HTTP
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}` // Usa tu propia clave de API de OpenAI aquí
    }
  };

  try {
    // Solicitud HTTP a la API de OpenAI para generar texto
    console.log(prompt);
    const response = await axios.post(
      'https://api.openai.com/v1/completions', // Endpoint de la API de OpenAI
      {
        prompt: prompt,
        max_tokens: 100,
        model: 'text-davinci-003'
      },
      axiosConfig
    );

    // Devuelve la respuesta generada por la API de OpenAI
    res.send(response.data.choices[0].text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ha ocurrido un error');
  }
});

// Servir el HTML con el input y el botón
app.get('/', (req, res) => {
  const html = `
    <form action="/submit" method="post">
      <label for="text-input">Ingresa un texto:</label>
      <input type="text" id="text-input" name="text-input">
      <button type="submit">Enviar</button>
    </form>
  `;
  res.send(html);
});

// Manejar el endpoint de submit
app.post('/submit', async (req, res) => {
  const textInput = req.body['text-input'];
  // Configuración de Axios para la solicitud HTTP
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}` // Usa tu propia clave de API de OpenAI aquí
    }
  };

  try {
    // Solicitud HTTP a la API de OpenAI para generar texto
    //console.log(textInput);
    const response = await axios.post(
      'https://api.openai.com/v1/completions', // Endpoint de la API de OpenAI
      {
        prompt: textInput,
        max_tokens: 100,
        model: 'text-davinci-003'
      },
      axiosConfig
    );

    // Devuelve la respuesta generada por la API de OpenAI
    res.send(response.data.choices[0].text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Ha ocurrido un error');
  }

  //res.send(`El texto ingresado fue: ${textInput}`);
});


// Inicia la aplicación web en el puerto 3000
app.listen(3000, () => {
  console.log('La aplicación está escuchando en el puerto 3000');
});
