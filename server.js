const express = require('express');
const path = require('path');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const password = process.env.PGPASSWORD || 'fanomezana';


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

//affichage de tous les reservation
app.get('/reservation', (_req, res) => {
  const selectSQL = 'SELECT * FROM reservation';
  client.query(selectSQL)
    .then((result) => {
      const reservation = result.rows;
      res.json(reservation);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});


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

//- 4--Afficher les promotions en fonction de la saison (période), tout hotel confondu 

app.get('/select_easy_4', (_req, res) => {
  const selectSQL = 'SELECT promotion.name, promotion.begin_date, promotion.end_date FROM promotion JOIN season ON promotion.begin_date >= season.start_date AND promotion.end_date <= season.end_date;  ';
  client.query(selectSQL)
    .then((result) => {
      const select_easy_4 = result.rows;
      res.json(select_easy_4);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//-- 	5-Afficher la liste des réservations d''un client donné 
//--(remplacer le client_id par l'id du client qui existe dans la base de donnée)

app.get('/select_easy_5', (_req, res) => {
  const selectSQL = 'SELECT r.id_reservation, r.date_arrived, r.leaving_date, r.number_of_person FROM reservation r JOIN client c ON r.id_client = c.id_client WHERE c.id_client = [client_id];';
  client.query(selectSQL)
    .then((result) => {
      const select_easy_5 = result.rows;
      res.json(select_easy_5);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//	--  6-Afficher la liste des clients qui n''ont pas encore payé en totalité leurs frais  

app.get('/select_easy_6', (_req, res) => {
  const selectSQL = 'SELECT c.first_name, c.last_name, p.amount_paid, p.total_amount_status FROM client c JOIN payment p  ON c.id_client = p.id_client WHERE p.total_amount_status = FALSE;'
  client.query(selectSQL)
    .then((result) => {
      const select_easy_6 = result.rows;
      res.json(select_easy_6);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//	-- 	7-Afficher le total des payements reçus par mobile money 

app.get('/select_easy_7', (_req, res) => {
  const selectSQL = 'SELECT SUM(amount_paid) AS total_payments FROM payment JOIN payment_method ON payment.id_payement_method = payment_method.id_payment_method WHERE payment_method.mobile_money = true;'

  client.query(selectSQL)
    .then((result) => {
      const select_easy_7 = result.rows;
      res.json(select_easy_7);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//	-- 	8-Afficher le nombre de réservations effectuées par un client donné durant une période donnée --(remplacez date start et date end par les dates que vous voules)
app.get('/select_easy_8', (_req, res) => {
  const selectSQL = "SELECT COUNT(r.id_reservation) FROM reservation r JOIN client c ON r.id_client = c.id_client WHERE c.id_client = [id_client] AND r.date_arrived BETWEEN date_start' AND 'date_end;"

  client.query(selectSQL)
    .then((result) => {
      const select_easy_8 = result.rows;
      res.json(select_easy_8);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//	--	9-Afficher la liste des hotels dans une localisation (province) donnée --(remplacer le province name par le nom de province qui existe dans la base de donnée)
app.get('/select_easy_9', (_req, res) => {
  const selectSQL = " SELECT h.hotel_name, h.address FROM hotel h JOIN province_available pa ON h.id_province = pa.id_province WHERE pa.province_name = 'province_name';"
  client.query(selectSQL)
    .then((result) => {
      const select_easy_9 = result.rows;
      res.json(select_easy_9);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//	-- 	10-Afficher la liste des chambres qui correspondent à un intervalle de prix donné par le client 
app.get('/select_easy_10', (_req, res) => {
  const selectSQL = "SELECT r.id_room, r.number, r.room_type, p.cost_per_night FROM room r JOIN price p ON r.id_room = p.id_room WHERE p.cost_per_night BETWEEN 'min_price' AND 'max_price';  ";
  client.query(selectSQL)
    .then((result) => {
      const select_easy_10 = result.rows;
      res.json(select_easy_10);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//	--	11-Afficher la liste des chambres par prix décroissant (Display the list of rooms in descending order of price):
app.get('/select_easy_11', (_req, res) => {
  const selectSQL = "SELECT r.id_room, r.number, r.room_type, p.cost_per_night FROM room r JOIN price p ON r.id_room = p.id_room ORDER BY p.cost_per_night DESC;"
  client.query(selectSQL)
    .then((result) => {
      const select_easy_11 = result.rows;
      res.json(select_easy_11);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//	-- 14-Afficher les détails sur la chambre qu''occupe un client donné actuellement
app.get('/select_easy_14', (_req, res) => {
  const selectSQL = "SELECT r.id_reservation, r.date_arrived, r.leaving_date, r.number_of_person, ro.number AS room_number, ro.room_type, ro.capacity_room FROM reservation r JOIN room ro ON r.id_room = ro.id_room WHERE r.id_client =  1 AND r.leaving_date >= CURRENT_DATE;"
  client.query(selectSQL)
    .then((result) => {
      const select_easy_14 = result.rows;
      res.json(select_easy_14);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

//  	 --	15- Afficher l'hotel avec le plus de reservations
app.get('/select_easy_15', (_req, res) => {
  const selectSQL = "SELECT h.hotel_name, COUNT(r.id_reservation) AS reservation_count FROM hotel h LEFT JOIN room ro ON h.id_hotel = ro.id_hotel LEFT JOIN reservation r ON ro.id_room = r.id_room GROUP BY h.hotel_name ORDER BY reservation_count desc LIMIT 1;"

  client.query(selectSQL)
    .then((result) => {
      const select_easy_15 = result.rows;
      res.json(select_easy_15);
    })
    .catch((err) => {
      console.error('Erreur lors de la récupération des données:', err);
      res.status(500).send('Erreur lors de la récupération des données');
    });
});

// 	-- 	16-Afficher l''hotel avec le moins de reservations 

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

//  	-- 17-Afficher le client avec le plus d'avis négatifs redigés envers les hotels.

app.get('/select_easy_17', (_req, res) => {
  const selectSQL = "SELECT client.id_client, client.first_name, client.last_name FROM feedback INNER JOIN client ON feedback.id_client = client.id_client WHERE rating < 3 GROUP BY client.id_client, client.first_name, client.last_name ORDER BY COUNT(*) DESC LIMIT 1;"
  client.query(selectSQL)
    .then((result) => {
      const select_easy_17 = result.rows;
      res.json(select_easy_17);
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


//  SELECT MEDIUM 

app.get('/reservations-count', async (_req, res) => {
  try {
    const query = `
      SELECT c.id_client, c.first_name, c.last_name, COUNT(r.id_reservation) AS total_reservations
      FROM client c
      LEFT JOIN reservation r ON c.id_client = r.id_client
      GROUP BY c.id_client, c.first_name, c.last_name;
    `;

    const result = await client.query(query);
    const reservationsCount = result.rows;

    res.json(reservationsCount);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// -- Afficher la liste des chambres qui seront libres demain :
app.get('/availableroom', async (_req, res) => {
  try {
    const query = `
    SELECT r.number, r.room_type
    FROM room r
    WHERE r.id_room NOT IN (
        SELECT res.id_room
        FROM reservation res
        WHERE res.date_arrived <= CURRENT_DATE + INTERVAL '1 day'
        AND res.leaving_date >= CURRENT_DATE + INTERVAL '1 day'
    );
    `;

    const result = await client.query(query);
    const availableroom = result.rows;

    res.json(availableroom);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// -- Afficher le nombre total de réservations par type de chambre (par exemple : VIP : 30 réservations, Simple : 40 réservations...) :
app.get('/total_reservation_wtih_type', async (_req, res) => {
  try {
    const query = `
    SELECT r.number, r.room_type
    FROM room r
    WHERE r.id_room NOT IN (
        SELECT res.id_room
        FROM reservation res
        WHERE res.date_arrived <= CURRENT_DATE + INTERVAL '1 day'
        AND res.leaving_date >= CURRENT_DATE + INTERVAL '1 day'
    );
    `;

    const result = await client.query(query);
    const total_reservation_wtih_type = result.rows;

    res.json(total_reservation_wtih_type);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// -- Afficher la liste des chambres qui répondent à de multiples critères

app.get('/listroom', async (_req, res) => {
  try {
    const query = `
    SELECT r.number, r.room_type
    FROM room r
    JOIN room_features rf ON r.id_room_features = rf.id_rooms_features
    WHERE rf.wifi_available = true
    AND rf.hot_water = true
    AND rf.mini_bar=true
    AND rf.flat_screen=true
    AND rf.room_service=true
    AND r.capacity_room >= 5;
    `;

    const result = await client.query(query);
    const listroom = result.rows;

    res.json(listroom);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// -- Afficher le nombre total des réservations par hôtel :
app.get('/total_reservation', async (_req, res) => {
  try {
    const query = `
    SELECT r.number, r.room_type
    FROM room r
    JOIN room_features rf ON r.id_room_features = rf.id_rooms_features
    WHERE rf.wifi_available = true
    AND rf.hot_water = true
    AND rf.mini_bar=true
    AND rf.flat_screen=true
    AND rf.room_service=true
    AND r.capacity_room >= 5;
    `;

    const result = await client.query(query);
    const total_reservation = result.rows;

    res.json(total_reservation);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// -- Afficher chaque client, et le nombre de fois où il a annulé une réservation :

app.get('/cancel_reservation', async (_req, res) => {
  try {
    const query = `
    SELECT c.id_client, c.first_name, c.last_name, COUNT(*) AS cancellations
    FROM client c
    JOIN reservation r ON c.id_client = r.id_client
    WHERE r.is_cancel = true
    GROUP BY c.id_client, c.first_name, c.last_name`;

    const result = await client.query(query);
    const cancel_reservation = result.rows;

    res.json(cancel_reservation);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// -- Afficher les hôtels, avec le nombre de chambres par hôtel :

app.get('/rooms_hotel', async (_req, res) => {
  try {
    const query = `
    SELECT h.hotel_name, COUNT(r.id_room) AS total_rooms
    FROM hotel h
    LEFT JOIN room r ON h.id_hotel = r.id_hotel
    GROUP BY h.hotel_name;`;

    const result = await client.query(query);
    const rooms_hotel = result.rows;

    res.json(rooms_hotel);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// --Afficher la liste des chambres occupées actuellement

app.get('/rooms_disenable', async (_req, res) => {
  try {
    const query = `
    SELECT *
    FROM room
    WHERE id_room IN (
        SELECT id_room
        FROM reservation
        WHERE leaving_date >= CURRENT_DATE
    );
    `;

    const result = await client.query(query);
    const rooms_disenable = result.rows;

    res.json(rooms_disenable);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --Afficher les chambres les moins réservés d'un hotel donné (2 par exemple)

app.get('/room_moins_reserve', async (_req, res) => {
  try {
    const query = `
    SELECT r.id_room, r.number, r.room_type, COUNT(re.id_reservation) AS total_reservations
    FROM room r
    LEFT JOIN reservation re ON r.id_room = re.id_room
    WHERE r.id_hotel = 2
    GROUP BY r.id_room, r.number, r.room_type
    ORDER BY total_reservations ASC;
    `;

    const result = await client.query(query);
    const room_moins_reserve = result.rows;

    res.json(room_moins_reserve);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --Afficher les chambres les plus réservés d'un hotel donné (2 par exemple)
app.get('/room_plus_reserve', async (_req, res) => {
  try {
    const query = `
    SELECT r.number,r.room_type, COUNT(*) AS total_reservations
    FROM room r
    JOIN reservation re ON r.id_room = re.id_room
    WHERE r.id_hotel = 2
    GROUP BY r.number, r.room_type
    ORDER BY total_reservations DESC;
    `;

    const result = await client.query(query);
    const room_plus_reserve = result.rows;

    res.json(room_plus_reserve);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --Afficher la liste des promotions en cours actuellement
app.get('/promotion_en_cours', async (_req, res) => {
  try {
    const query = `
    SELECT p.name, p.begin_date, p.end_date, p.percent
    FROM promotion p
    WHERE CURRENT_DATE BETWEEN p.begin_date AND p.end_date;
    `;

    const result = await client.query(query);
    const promotion_en_cours = result.rows;

    res.json(promotion_en_cours);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Afficher la liste des clients, avec le nombre de reservations, le nombre de reservations annulées, et le total d'argent que le client a payé

app.get('/client_reservation', async (_req, res) => {
  try {
    const query = `
    SELECT
    client.id_client,
    client.first_name,
    client.last_name,
    COUNT(DISTINCT reservation.id_reservation) AS total_reservations,
    COUNT(CASE WHEN reservation.is_cancel = true THEN 1 ELSE NULL END) AS total_cancelled_reservations,
    COALESCE(SUM(payment.amount_paid), 0) AS total_amount_paid
FROM
    client
LEFT JOIN
    reservation ON client.id_client = reservation.id_client
LEFT JOIN
    payment ON client.id_client = payment.id_client
GROUP BY
    client.id_client,
    client.first_name,
    client.last_name;
    `;

    const result = await client.query(query);
    const client_reservation = result.rows;

    res.json(client_reservation);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// -Afficher la liste des payements avec le nom et le prénom du réceptionniste que les a reçus
app.get('/payement', async (_req, res) => {
  try {
    const query = `
    SELECT p.name, p.begin_date, p.end_date, p.percent
    FROM promotion p
    WHERE CURRENT_DATE BETWEEN p.begin_date AND p.end_date;
    `;

    const result = await client.query(query);
    const payement = result.rows;

    res.json(payement);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Afficher la liste des chambres, avec leur prix brut, et leur prix net (c'est-à-dire leur prix en appliquant toutes les réductions qui sont appliquées aujourd'hui)

app.get('/room_price', async (_req, res) => {
  try {
    const query = `
    SELECT
    r.id_room,
    r.number,
    r.room_type,
    r.capacity_room,
    p.cost_per_night AS prix_brut,
    p.cost_per_night * (1 - (pr.percent / 100)) AS prix_net
FROM
    room r
    LEFT JOIN price p ON r.id_room = p.id_room
    LEFT JOIN have h ON r.id_room = h.id_room
    LEFT JOIN promotion pr ON h.id_promotion = pr.id_promotion
WHERE
    CURRENT_DATE BETWEEN pr.begin_date AND pr.end_date;
    `;

    const result = await client.query(query);
    const room_price = result.rows;

    res.json(room_price);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// SELECT HARD

// -Afficher la liste des chambres qui seront libres (au moins pour un jour) la semaine prochaine
app.get('/room_will_avalaible', async (_req, res) => {
  try {
    const query = `
    SELECT
    r.id_room,
    r.number,
    r.room_type,
    h.hotel_name
FROM
    room r
    JOIN hotel h ON r.id_hotel = h.id_hotel
WHERE
    r.id_room NOT IN (
        SELECT
            id_room
        FROM
            reservation
        WHERE
            date_arrived >= CURRENT_DATE + INTERVAL '7 days' -- Date de début de la semaine prochaine
            AND leaving_date <= CURRENT_DATE + INTERVAL '13 days' -- Date de fin de la semaine prochaine
    );
    `;

    const result = await client.query(query);
    const room_will_avalaible = result.rows;

    res.json(room_will_avalaible);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --Afficher la liste des chambres libres sur une certaine période, en précisant leur hotel. (mbola tsy mety)
app.get('/room_avalaible_period', async (_req, res) => {
  try {
    const query = `
    SELECT r.id_room, r.number, r.room_type, h.hotel_name FROM room r JOIN hotel h ON r.id_hotel = h.id_hotel WHERE r.id_room NOT IN ( SELECT id_room FROM reservation WHERE date_arrived <= 'YYYY-MM-DD'::DATE -- Date de départ de la période recherchée 
    AND leaving_date >= 'YYYY-MM-DD'::DATE -- Date d'arrivée de la période recherchée);
    `;
    promotion_total_revision
    const result = await client.query(query);
    const room_avalaible_period = result.rows;

    res.json(room_avalaible_period);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// -- Pour chaque promotion, afficher le nombre total de reservations qui ont bénéficié de la promotion, par hotel (pour savoir si ça a marché ou non)
app.get('/promotion_total_revision', async (_req, res) => {
  try {
    const query = `
    SELECT
    p.id_promotion,
    p.name AS promotion_name,
    h.id_hotel,
    h.hotel_name,
    COUNT(*) AS total_reservations
FROM
    promotion p
    INNER JOIN have hv ON p.id_promotion = hv.id_promotion
    INNER JOIN room r ON hv.id_room = r.id_room
    INNER JOIN reservation res ON r.id_room = res.id_room
    INNER JOIN hotel h ON r.id_hotel = h.id_hotel
GROUP BY
    p.id_promotion,
    p.name,
    h.id_hotel,
    h.hotel_name
ORDER BY
    p.id_promotion;
    `;

    const result = await client.query(query);
    const promotion_total_revision = result.rows;
      } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).send('<h1>Erreur serveur</h1>');
  }
});

// Afficher la liste des hotels qui ont des chambres libres sur une période demandée par l'utilisateur (mbola tsy mety)
app.get('/room_period', async (_req, res) => {
  try {
    const query = `

    SELECT
    h.id_hotel,
    h.hotel_name
FROM
    hotel h
    JOIN room r ON h.id_hotel = r.id_hotel
WHERE
    r.id_room NOT IN (
        SELECT
            id_room
        FROM
            reservation
        WHERE
            date_arrived <= 'YYYY-MM-DD'::DATE -- Date de départ de la période recherchée
            AND leaving_date >= 'YYYY-MM-DD'::DATE -- Date d'arrivée de la période recherchée
    );
    `;

    const result = await client.query(query);
    const room_period = result.rows;

    res.json(room_period);
  } catch (err) {
    console.error('Erreur lors de l\'exécution de la requête :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



// Démarrez le serveur
app.listen(port, () => {
  console.log(`Le serveur est en cours d'exécution sur http://localhost:${port}`);
});
