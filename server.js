const express = require('express');
const path = require('path');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuration de la connexion à la base de données PostgreSQL
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: 'fanomezana',
  port: 5432,
});




// Middleware pour gérer les données POST
app.use(bodyParser.json());

// Connexion à la base de données PostgreSQL
client.connect()
  .then(() => {
    console.log('Connecté à la base de données!');
  })
  .catch((err) => {
    console.error('Erreur de connexion à la base de données:', err);
  });

// Définir le dossier des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route pour récupérer toutes les données de la table province_available en GET
app.get('/provinces', (_req, res) => {
  const selectSQL = 'SELECT * FROM province_available';
  client.query(selectSQL)
    .then((result) => {
      const provinces = result.rows;
      res.json(provinces);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

// Route pour ajouter une nouvelle entrée dans la table province_available en POST
app.post('/provinces', (req, res) => {
  const { id_province, province_name, code_province } = req.body;
  const insertSQL = 'INSERT INTO province_available (id_province, province_name, code_province) VALUES ($1, $2, $3)';
  const values = [530, "Isotry", "352"];
  client.query(insertSQL, values)
    .then(() => {
      console.log('Nouvelle entrée insérée avec succès!');
      res.status(201).send('Nouvelle entrée insérée avec succès!');
    })
    .catch((err) => {
      console.error('Erreur lors de l\'insertion d\'une nouvelle entrée:', err);
      res.status(500).send('Erreur lors de l\'insertion d\'une nouvelle entrée');
    });
});

// Démarrez le serveur
app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur http://localhost:${port}`);
});
