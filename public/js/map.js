var map = L.map('map').setView([51.5, -0.09], 13); // Set initial coordinates and zoom level


// Add a tile layer (use OpenStreetMap tiles in this case)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker to the map
L.marker([51.5, -0.09]).addTo(map)
    .bindPopup("A marker!")
    .openPopup();

    L.Control.geocoder({
        defaultMarkGeocode: true
    }).addTo(map);


    function geocodeOpenCage(address) {
        var apiKey = '83ad6fe5ea024555987092b3c03b5b99';
        var url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
    
        fetch(url)
            .then(response => response.json())
            .then(data => {
                var coordinates = data.results[0].geometry;
                L.marker([coordinates.lat, coordinates.lng]).addTo(map)
                    .bindPopup(`Location: ${address}`)
                    .openPopup();
    
                map.setView([coordinates.lat, coordinates.lng], 14);
            })
            .catch(err => console.error(err));
    }
    
    geocodeOpenCage("Berlin, Germany");
    
