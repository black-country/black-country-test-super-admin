<template>
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Left Panel -->
        <div class="md:col-span-1 space-y-4">
          <h1 class="text-2xl font-bold mb-6">Find Nearby Places</h1>
          <div v-if="currentLocation" class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-2">Current Location:</h2>
            <p class="text-gray-700">{{ currentLocation.formatted_address }}</p>
          </div>
          <div v-if="amenities.length > 0" class="bg-white p-4 rounded-lg shadow">
            <h2 class="text-lg font-semibold mb-2">Nearby Amenities:</h2>
            <ul class="space-y-2">
              <li 
                v-for="amenity in amenities" 
                :key="amenity.place_id"
                class="text-gray-700"
              >
                {{ amenity.name }} - {{ amenity.types[0] }}
              </li>
            </ul>
          </div>
          <div>
            <select 
              v-model="selectedType"
              @change="searchNearbyPlaces"
              class="w-full p-3 border rounded-lg shadow-sm"
            >
              <option value="">All Places</option>
              <option value="school">Schools</option>
              <option value="church">Churches</option>
              <option value="house">Houses</option>
              <option value="hotel">Hotels</option>
              <option value="restaurant">Restaurants</option>
              <option value="hospital">Hospitals</option>
              <option value="shopping_mall">Shopping Malls</option>
            </select>
          </div>
        </div>
  
        <!-- Map and Results Panel -->
        <div class="md:col-span-2 space-y-1">
            <div class="relative">
            <input
              ref="searchInput"
              type="text"
              placeholder="Enter a location"
              class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
  
          <!-- Map Container -->
          <div ref="mapContainer" class="w-full h-[400px] rounded-lg shadow-lg"></div>
  

          <div v-if="places.length > 0" class="space-y-4">
            <h2 class="text-xl font-semibold">Nearby Places</h2>
            <div class="grid gap-4 md:grid-cols-2">
              <div 
                v-for="place in places" 
                :key="place.place_id"
                class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                @click="highlightMarker(place)"
              >
                <h3 class="font-semibold text-lg mb-2">{{ place.name }}</h3>
                <p class="text-gray-600 mb-2">{{ place.vicinity }}</p>
                <div class="flex items-center mb-2" v-if="place.rating">
                  <span class="text-yellow-500 mr-1">★</span>
                  <span>{{ place.rating }} ({{ place.user_ratings_total }} reviews)</span>
                </div>
                <p v-if="place.open_now" class="text-green-600">Open Now</p>
                <p v-else-if="place.open_now === false" class="text-red-600">Closed</p>
              </div>
            </div>
          </div>
  
          <div v-else-if="searchPerformed" class="text-center py-8 text-gray-600">
            No places found nearby
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  
  // Replace with your actual API key
  const GOOGLE_MAPS_API_KEY = 'AIzaSyCTBVK36LVNlXs_qBOC4RywX_Ihf765lDg'
  
  const searchInput = ref<HTMLInputElement | null>(null)
  const mapContainer = ref<HTMLElement | null>(null)
  const currentLocation = ref<google.maps.places.PlaceResult | null>(null)
  const places = ref<google.maps.places.PlaceResult[]>([])
  const amenities = ref<google.maps.places.PlaceResult[]>([])
  const selectedType = ref('')
  const searchPerformed = ref(false)
  const currentCoordinates = ref<google.maps.LatLngLiteral | null>(null)
  
  let map: google.maps.Map
  let placesService: google.maps.places.PlacesService
  let autocomplete: google.maps.places.Autocomplete
  let markers: google.maps.Marker[] = []
  let currentLocationMarker: google.maps.Marker | null = null
  let infoWindow: google.maps.InfoWindow
  
  onMounted(() => {
    if (!(window as any).google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        initializeGoogleServices()
        getUserLocation()
      }
      document.head.appendChild(script)
    } else {
      initializeGoogleServices()
      getUserLocation()
    }
  })
  
  function initializeGoogleServices() {
    try {
      // Initialize the map
      if (mapContainer.value) {
        map = new google.maps.Map(mapContainer.value, {
          center: { lat: 0, lng: 0 },
          zoom: 13,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        })
  
        // Initialize InfoWindow
        infoWindow = new google.maps.InfoWindow()
  
        // Initialize Places Service
        placesService = new google.maps.places.PlacesService(map)
  
        // Initialize Autocomplete
        if (searchInput.value) {
          autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
            types: ['geocode']
          })
  
          // Add listener for place selection
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace()
            if (place.geometry) {
              currentLocation.value = place
              currentCoordinates.value = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
              updateMap(place)
              searchNearbyPlaces()
            }
          })
        }
      }
    } catch (error) {
      console.error('Error initializing Google services:', error)
    }
  }
  
  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          currentCoordinates.value = pos
          reverseGeocode(pos)
        },
        () => {
          handleLocationError(true)
        }
      )
    } else {
      handleLocationError(false)
    }
  }
  
  function reverseGeocode(latLng: google.maps.LatLngLiteral) {
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        currentLocation.value = results[0]
        updateMap(results[0], true)
        searchNearbyPlaces()
      } else {
        console.error('Geocoder failed due to: ' + status)
      }
    })
  }
  
  function handleLocationError(browserHasGeolocation: boolean) {
    console.error(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.')
  }
  
  function updateMap(place: google.maps.places.PlaceResult, isCurrentLocation: boolean = false) {
    if (!place.geometry?.location) return
  
    // Clear existing markers
    clearMarkers()
  
    // Center map on selected location
    map.setCenter(place.geometry.location)
    map.setZoom(14)
  
    // Add marker for location
    const markerIcon = isCurrentLocation ? 
      'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' : 
      'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  
    const locationMarker = new google.maps.Marker({
      map,
      position: place.geometry.location,
      icon: {
        url: markerIcon
      },
      animation: google.maps.Animation.DROP
    })
  
    // Add info window for location
    const infoContent = `
      <div class="p-2">
        <h3 class="font-semibold">${place.name}</h3>
        <p>${place.formatted_address}</p>
      </div>
    `
    
    locationMarker.addListener('click', () => {
      infoWindow.setContent(infoContent)
      infoWindow.open(map, locationMarker)
    })
  
    if (isCurrentLocation) {
      currentLocationMarker = locationMarker
    } else {
      markers.push(locationMarker)
    }
  }
  
  async function searchNearbyPlaces() {
    if (!currentCoordinates.value) return
  
    try {
      const request = {
        location: currentCoordinates.value,
        radius: 2000, // 2km radius
        type: selectedType.value || undefined
      }
  
      placesService.nearbySearch(
        request,
        (results: google.maps.places.PlaceResult[] | null, status: google.maps.places.PlacesServiceStatus) => {
          searchPerformed.value = true
          
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            places.value = results
            amenities.value = results.slice(0, 10) // Store first 10 results as amenities
            addPlaceMarkers(results)
          } else {
            places.value = []
            amenities.value = []
            console.error('Error fetching nearby places:', status)
          }
        }
      )
    } catch (error) {
      console.error('Error in searchNearbyPlaces:', error)
      places.value = []
      amenities.value = []
    }
  }
  
  function addPlaceMarkers(places: google.maps.places.PlaceResult[]) {
    clearMarkers()
  
    places.forEach(place => {
      if (!place.geometry?.location) return
  
      const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
        animation: google.maps.Animation.DROP
      })
  
      const infoContent = `
        <div class="p-2">
          <h3 class="font-semibold">${place.name}</h3>
          <p>${place.vicinity}</p>
          ${place.rating ? `
            <div class="flex items-center mt-1">
              <span class="text-yellow-500 mr-1">★</span>
              <span>${place.rating} (${place.user_ratings_total} reviews)</span>
            </div>
          ` : ''}
        </div>
      `
  
      marker.addListener('click', () => {
        infoWindow.setContent(infoContent)
        infoWindow.open(map, marker)
      })
  
      markers.push(marker)
    })
  }
  
  function clearMarkers() {
    markers.forEach(marker => marker.setMap(null))
    markers = []
  }
  
  function highlightMarker(place: google.maps.places.PlaceResult) {
    if (!place.geometry?.location) return
  
    // Center map on selected place
    map.panTo(place.geometry.location)
    
    // Find and trigger click on corresponding marker
    const marker = markers.find(m => 
      m.getPosition()?.lat() === place.geometry?.location?.lat() &&
      m.getPosition()?.lng() === place.geometry?.location?.lng()
    )
    
    if (marker) {
      google.maps.event.trigger(marker, 'click')
    }
  }
  </script>
  
  <style scoped>
  .pac-container {
    z-index: 9999;
  }
  </style>
