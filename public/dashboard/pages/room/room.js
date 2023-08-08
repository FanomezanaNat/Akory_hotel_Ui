function afficherChambres() {
    // Faire une requête pour récupérer les données JSON des chambres
    fetch('http://localhost:3000/rooms')
      .then(response => response.json())
      .then(chambres => {
        // Créer une liste <ul> pour contenir les informations de chambres
        const listeChambres = document.createElement('ul');
    
        // Parcourir les chambres et créer un <li> pour chaque chambre
        chambres.forEach(chambre => {
          const chambreItem = document.createElement('li');
          chambreItem.innerHTML = `
            <strong>ID room:</strong> ${chambre.id_room}<br>
            <strong>Number room</strong> ${chambre.number}<br>
            <strong>Type :</strong> ${chambre.room_type}<br>
            <strong>Capacity of room:</strong> ${chambre.capacity_room}<br>
            <strong>ID hotel:</strong> ${chambre.id_hotel}<br>
            <strong>ID of caracter of room:</strong> ${chambre.id_room_features}<br>
            <hr>
          `;
    
          // Ajouter chaque chambre à la liste
          listeChambres.appendChild(chambreItem);
        });
    
        // Obtenez une référence à l'élément qui contiendra les chambres
        const conteneurChambres = document.getElementById('conteneurChambres');
    
        // Effacez tout contenu précédent dans le conteneur (au cas où des chambres précédentes auraient été affichées)
        conteneurChambres.innerHTML = '';
    
        // Ajouter la liste de chambres au conteneur
        conteneurChambres.appendChild(listeChambres);
      })
      .catch(error => {
        console.error('Une erreur s\'est produite lors de la récupération des chambres :', error);
      });
  }


  fetch('http://localhost:3000/receptionnists')
  .then(response => response.json())
  .then(receptionnists => {
    const receptionnistData = document.getElementById('receptionnistData');

    receptionnists.forEach(receptionnist => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${receptionnist.name}</td>
        <td>${receptionnist.number}</td>
        <td>${receptionnist.date}</td>
        <td><label class="badge badge-${receptionnist.status}">${receptionnist.status}</label></td>
      `;
      receptionnistData.appendChild(tr);
    });
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des réceptionnistes:', error);
  });