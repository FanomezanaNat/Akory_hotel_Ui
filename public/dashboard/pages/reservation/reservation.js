function afficherReservations() {
    // Faire une requête pour récupérer les données JSON des réservations
    fetch('http://localhost:3000/reservation')
      .then(response => response.json())
      .then(reservations => {
        // Créer une liste <ul> pour contenir les informations de réservation
        const listeReservations = document.createElement('ul');
    
        // Parcourir les réservations et créer un <li> pour chaque réservation
        reservations.forEach(reservation => {
          const reservationItem = document.createElement('li');
          reservationItem.innerHTML = `
            <strong>ID  reservation:</strong> ${reservation.id_reservation}<br>
            <strong>Arrival date :</strong> ${formatDate(reservation.date_arrived)}<br>
            <strong>Deparature date:</strong> ${formatDate(reservation.leaving_date)}<br>
            <strong>Number of persons:</strong> ${reservation.number_of_person}<br>
            <strong>Cancel:</strong> ${reservation.is_cancel ? 'Oui' : 'Non'}<br>
            <strong>ID client:</strong> ${reservation.id_client}<br>
            <strong>ID room:</strong> ${reservation.id_room}<br>
            <hr>
          `;
    
          // Ajouter chaque réservation à la liste
          listeReservations.appendChild(reservationItem);
        });
    
        // Obtenez une référence à l'élément qui contiendra les réservations
        const conteneurReservations = document.getElementById('conteneurReservations');
    
        // Effacez tout contenu précédent dans le conteneur (au cas où des réservations précédentes auraient été affichées)
        conteneurReservations.innerHTML = '';
    
        // Ajouter la liste de réservations au conteneur
        conteneurReservations.appendChild(listeReservations);
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des réservations :', error);
      });
  }
  
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { timeZone: 'UTC' });
  }