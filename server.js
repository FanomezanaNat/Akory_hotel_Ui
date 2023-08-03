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
  database: 'backend',
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

// Route pour récupérer toutes les données de la table hotel en GET

app.get('/hotels', (_req, res) => {
  const selectSQL = 'SELECT * FROM hotel';
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

//-- 1--Afficher la liste des receptionnistes, avec l''hotel auquel ils sont rattachés 
app.get('/select_easy_1', (_req, res) => {
  const selectSQL = 'SELECT r.first_name, r.last_name, h.hotel_name FROM receptionist r JOIN hotel h ON r.id_receptionist = h.id_hotel;'
  client.query(selectSQL)
    .then((result) => {
      const select_easy_1 = result.rows;
      res.json(select_easy_1);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//-- 2-- Afficher la liste des réservations en commençant par la plus récente, pour un hotel donné 
app.get('/select_easy_2', (_req, res) => {
  const selectSQL = 'SELECT r.id_reservation, r.date_arrived, r.leaving_date, r.number_of_person FROM reservation r INNER JOIN room ro ON r.id_room = ro.id_room INNER JOIN hotel h ON ro.id_hotel = h.id_hotel WHERE h.id_hotel = 2 ORDER BY r.date_arrived DESC;';
  client.query(selectSQL)
    .then((result) => {
      const select_easy_2 = result.rows;
      res.json(select_easy_2);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//	-- 3-- Afficher une liste des rooms d''un type donné (chambre simple, twin, vip...), dans un hotel donné
app.get('/select_easy_3', (_req, res) => {
  const selectSQL = 'SELECT r.id_room, r.number, r.room_type	FROM room r	JOIN hotel h ON r.id_hotel = h.id_hotel;  ';
  client.query(selectSQL)
    .then((result) => {
      const select_easy_3 = result.rows;
      res.json(select_easy_3);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

app.get('/select_easy_16', (_req, res) => {
  const selectSQL = 'SELECT h.hotel_name, COUNT(r.id_reservation) AS reservation_count FROM hotel h LEFT JOIN room ro ON h.id_hotel = ro.id_hotel LEFT JOIN reservation r ON ro.id_room = r.id_room GROUP BY h.hotel_name ORDER BY reservation_count asc LIMIT 1';
  client.query(selectSQL)
    .then((result) => {
      const select_easy_16 = result.rows;
      res.json(select_easy_16);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

// Route pour récupérer toutes les données de la table receptionnist en GET

/*app.get('/receptionists', (_req, res) => {
  const selectSQL = 'SELECT * FROM receptionist';
  client.query(selectSQL)
    .then((result) => {
      const receptionists = result.rows;
      res.json(receptionists);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});
*/

// Route pour récupérer toutes les données de la table client en GET

/*app.get('/clients', (_req, res) => {
  const selectSQL = 'SELECT * FROM client';
  client.query(selectSQL)
    .then((result) => {
      const clients = result.rows;
      res.json(clients);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});*/

// Route pour récupérer toutes les données de la table feedback en GET

/*app.get('/feedbacks', (_req, res) => {
  const selectSQL = 'SELECT * FROM feedback';
  client.query(selectSQL)
    .then((result) => {
      const feedbacks = result.rows;
      res.json(feedbacks);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});*/

// Route pour récupérer toutes les données de la promotion en GET

app.get('/promotions', (_req, res) => {
  const selectSQL = 'SELECT * FROM promotion';
  client.query(selectSQL)
    .then((result) => {
      const promotions = result.rows;
      res.json(promotions);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

// Route pour récupérer toutes les données de la table room_feature en GET

app.get('/room_features', (_req, res) => {
  const selectSQL = 'SELECT * FROM room_features';
  client.query(selectSQL)
    .then((result) => {
      const room_features = result.rows;
      res.json(room_features);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

// Route pour récupérer toutes les données de la table room en GET

app.get('/rooms', (_req, res) => {
  const selectSQL = 'SELECT * FROM room';
  client.query(selectSQL)
    .then((result) => {
      const rooms = result.rows;
      res.json(rooms);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

// Route pour récupérer toutes les données de la table reservation en GET

/*app.get('/reservations', (_req, res) => {
  const selectSQL = 'SELECT * FROM reservation';
  client.query(selectSQL)
    .then((result) => {
      const reservations = result.rows;
      res.json(reservations);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});
*/

// Route pour récupérer toutes les données de la table status_client en GET

/*app.get('/status_clients', (_req, res) => {
  const selectSQL = 'SELECT * FROM status_client';
  client.query(selectSQL)
    .then((result) => {
      const status_clients = result.rows;
      res.json(status_clients);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});
*/

// Route pour récupérer toutes les données de la table season en GET

/*app.get('/seasons', (_req, res) => {
  const selectSQL = 'SELECT * FROM season';
  client.query(selectSQL)
    .then((result) => {
      const seasons = result.rows;
      res.json(seasons);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});/*

// Route pour récupérer toutes les données de la table service en GET

app.get('/services', (_req, res) => {
  const selectSQL = 'SELECT * FROM service';
  client.query(selectSQL)
    .then((result) => {
      const services = result.rows;
      res.json(services);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

// Route pour récupérer toutes les données de la table payment_method en GET

app.get('/payment_methods', (_req, res) => {
  const selectSQL = 'SELECT * FROM payment_method';
  client.query(selectSQL)
    .then((result) => {
      const payment_methods = result.rows;
      res.json(payment_methods);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

// Route pour récupérer toutes les données de la table payment en GET

/*app.get('/payments', (_req, res) => {
  const selectSQL = 'SELECT * FROM payment';
  client.query(selectSQL)
    .then((result) => {
      const payments = result.rows;
      res.json(payments);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});
*/
// Route pour récupérer toutes les données de la table prices en GET

app.get('/prices', (_req, res) => {
  const selectSQL = 'SELECT * FROM price';
  client.query(selectSQL)
    .then((result) => {
      const prices = result.rows;
      res.json(prices);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

/*app.get('/buys', (_req, res) => {
  const selectSQL = 'SELECT * FROM buy';
  client.query(selectSQL)
    .then((result) => {
      const buys = result.rows;
      res.json(buys);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});
*/


/*app.get('/haves', (_req, res) => {
  const selectSQL = 'SELECT * FROM have';
  client.query(selectSQL)
    .then((result) => {
      const haves = result.rows;
      res.json(haves);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});
*/
app.get('/promotions', (_req, res) => {
  const selectSQL = 'SELECT * FROM promotion';
  client.query(selectSQL)
    .then((result) => {
      const promotions = result.rows;
      res.json(promotions);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});
// Route pour ajouter une nouvelle entrée dans la table province_available en POST
app.post('/provinces', (_req, res) => {
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
