import express from 'express';
import { MongoClient } from 'mongodb';
import { readFile } from 'fs/promises';
import { ObjectId } from 'mongodb';

const app = express();
const port = 3000;
const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority";

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

async function startServer() {

  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const markersCollection = client.db("Parking").collection("marker");
  console.log("Connected to MongoDB Atlas");

  const markersWithStatus = await markersCollection.find().toArray();

  const leafletJS = await readFile('./node_modules/leaflet/dist/leaflet.js', 'utf-8');
  const leafletCSS = await readFile('./node_modules/leaflet/dist/leaflet.css', 'utf-8');

app.get('/', (req, res) => {
  let html = `
    <html>
      <head>
        <title>Parki - Parking</title>

        <link rel="shortcut icon" type="image/png" href="https://i.postimg.cc/NMbHx9JP/favicon.png" />

        <style>${leafletCSS}</style>
      </head>

      <body>
        <div class="main-body">
          <div id="map" style="height: 800px; width: 90%;"></div>
        </div>
        <button id="locateME">Locate Me Parkie</button>

        <script>${leafletJS}</script>
        
        <script>
          const L = window.L;

          var map = L.map('map').setView([${markersWithStatus[0].lat}, ${markersWithStatus[0].long}], 16);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
          }).addTo(map);

          const myIcon = L.icon({
            iconUrl: 'https://i.ibb.co/09HNBnz/my-icon.png"',
            iconSize: [30, 45],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
          });

          const markersWithStatus = ${JSON.stringify(markersWithStatus)};

          
          markersWithStatus.forEach(marker => {
           /*    console.log(marker); */
            let markerPopup = L.popup();
          
            const popupContent = document.createElement('div');
            const status = document.createElement('p');
            status.id = marker.id;
            status.textContent = 'Available: ' + marker.status;
            const bookButton = document.createElement('button');
            bookButton.textContent = 'Book Now';
          
            bookButton.addEventListener('click', (event) => {
              const bookingForm = document.createElement('form');
              bookingForm.innerHTML =
                '<label for="name">Name:</label>' +
                '<input type="text" id="name" name="name" required>' +
                '<label for="email">Email:</label>' +
                '<input type="email" id="email" name="email" required>' +
                '<button type="submit">Book Now</button>';
              const bookingFormPopup = L.popup().setContent(bookingForm);
              map.closePopup(markerPopup);
              map.openPopup(bookingFormPopup, L.latLng(marker.lat, marker.long));
            
              bookingForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const formData = new FormData(bookingForm);
                  const data = new URLSearchParams();
                  data.append('name', formData.get('name'));
                  data.append('email', formData.get('email'));
                  data.append('markerId', marker._id);
                fetch("/book", {
                  method: "POST",
                  headers: {
                   "Content-Type": "application/x-www-form-urlencoded"
                  },
                  body: data
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error("An error occurred.");
                  }
                  return response.json();
                })
                .then(data => {
                  console.log(data);
                })
                .catch(error => {
                  console.error(error.message);
                });                
              });
            });
          
            popupContent.appendChild(status);
            popupContent.appendChild(bookButton);
            markerPopup.setContent(popupContent);
            L.marker([marker.lat, marker.long], {icon: myIcon})
              .addTo(map)
              .bindPopup(markerPopup);
          }); // add closing curly brace here

          
          const forms = document.querySelectorAll('form');

          forms.forEach(form => {
            form.addEventListener('submit', (event) => {
              event.preventDefault();
              const formData = new FormData(event.target);
              const booking = {
                name: formData.get('name'),
                email: formData.get('email'),
                status: 'booked'
              };
              console.log('New booking:', booking);
          
              const markerIndex = markersWithStatus.findIndex(marker => marker._id === form.dataset.markerId);
          
              if (markerIndex >= 0) {
                markersWithStatus[markerIndex].status = 'booked';
                markersCollection.updateOne({_id: markersWithStatus[markerIndex]._id}, {$set: {status: 'booked'}})
                  .then(() => {
                    console.log('Updated marker status:', markersWithStatus[markerIndex].status);
                  })
                  .catch((error) => {
                    console.log('Error updating marker status:', error);
                  });
          
                const bookingSuccessMessage = document.createElement('p');
                bookingSuccessMessage.textContent = 'Booking Successful!';
                const bookingSuccessPopup = L.popup().setContent(bookingSuccessMessage);
                map.closePopup(markerPopup);
                map.openPopup(bookingSuccessPopup, L.latLng(markersWithStatus[markerIndex].lat, markersWithStatus[markerIndex].long));
              } else {
                console.log('Marker not found for booking:', booking);
              }
          
              event.target.reset();
            });
          });
          

               
               
             </script>
           </body>
         </html>
       `;
       res.send(html);
     });


    app.post('/book', async (req, res) => {
        const { name, email, markerId } = req.body;
        console.log("name: ", name);
        console.log("email: ", email);
        console.log("markerId: ", markerId);

        try {
            const client = await MongoClient.connect(uri, { useNewUrlParser: true });
            const markersCollection = client.db("Parking").collection("marker");
            const marker = await markersCollection.findOneAndUpdate(
                { _id: new ObjectId(markerId) },
                { $set: { name, email, status: 'booked' } },
                { returnOriginal: false }
            );

            console.log(`Marker ${markerId} has been booked by ${name} (${email})`);
            res.json(marker);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error updating marker: ' + err.message });
        }
    });


    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });


} 


startServer();

