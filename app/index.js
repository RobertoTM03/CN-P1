const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });
const express = require('express');
const app = express();

// Importa tus rutas de API
const tasksRoutes = require(path.resolve(__dirname, './src/interfaces/http/routes/tasksRoutes'));
const taskRoutes = require(path.resolve(__dirname, './src/interfaces/http/routes/taskRoutes'));
 
app.use(express.json());

const cors = require('cors');

// Configuración de CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key']
};

app.use(cors(corsOptions));

// Rutas de la API
app.use('/tasks', tasksRoutes); // GET /tasks
app.use('/task', taskRoutes);   // POST /task, GET /task/{id}, PUT /task/{id}, DELETE /task/{id}
app.get('/', (req, res) => res.send('API Acoplada (ECS) funcionando.'));

// Arranque del Servidor
const PORT = process.env.PORT || 8080; 
app.listen(PORT, () => {
    console.log(`Servidor "Acoplado" corriendo en puerto ${PORT}`);
});