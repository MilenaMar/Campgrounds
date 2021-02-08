   mapboxgl.accessToken = mapToken ;
  const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 4 // starting zoom
  });
  
  const marker = new mapboxgl.Marker({
    color: "#D44C59",
    })
  .setLngLat(campground.geometry.coordinates)
  .setPopup(new mapboxgl.Popup( {offset:20, closeButton:false })
  .setHTML(`<h6>${campground.title}</h6>
  <p>${campground.location}</p>`
      )
  )
  .addTo(map);