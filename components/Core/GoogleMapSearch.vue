<template>
  <main>
    <div class="container mx-auto px-4">
      <div class="md:col-span-2 space-y-1">
        <div class="relative">
          <input ref="searchInput" type="text" v-model="payload.address.value" placeholder="Enter a location"
            class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <!-- Map Container -->
        <div ref="mapContainer" class="w-full h-[400px] rounded-lg shadow-lg"></div>
      </div>
    </div>

    <CoreModal :isOpen="isLocationModalOpen" @close="isLocationModalOpen = false" title="Confirm property's address">
      <p class="text-xs text-[#667185]">Please review the address and ensure that all fields marked with '*' are
        completed</p>
      <div class="space-y-4">
        <section>
          <label class="text-xs mb-2 text-[#1D2739]">Country *</label>
          <select v-model="selectedCountry"
            class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100">
            <option value="NG">Nigeria</option>
            <!-- <option value="US">United States</option>
            <option value="CA">Canada</option> -->
            <!-- Add more options or dynamically load them -->
          </select>
        </section>

        <section>
          <label class="text-xs mb-2 text-[#1D2739]">Street *</label>
          <input :value="payload.address.value"
            class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100" />
        </section>
        <!-- {{ states[0] }} -->
        <section>
          <label class="text-xs mb-2 text-[#1D2739]">State *</label>
          <select class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100"
            v-model="selectedState" @change="handleStateChange(selectedState)">
            <option v-for="state in states" :key="state.stateCode" :value="state.stateCode">
              {{ state.name }}
            </option>
          </select>
        </section>
        <!-- {{ cities[0] }} -->
        <section v-if="!loadingCities">
          <label class="text-xs mb-2 text-[#1D2739]">City/Town *</label>
          <select v-model="selectedCity"
            class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100">
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>
        </section>
        <!-- {{ selectedCity }} -->
        <div v-if="loadingCities" class="h-10 animate-pulse w-full bg-slate-200 rounded"></div>
        <!-- <section>
          <label class="text-xs mb-2">Postcode (Optional)</label>
          <input type="tel" class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100" />
        </section> -->

        <div class="w-full pt-6 flex justify-between items-center gap-x-6">
          <button type="button" @click="isLocationModalOpen = false"
            class="bg-[#EBE5E0] text-[#292929] w-full  text-sm rounded-md py-3">Cancel</button>
          <button type="button" @click="isLocationModalOpen = false"
            class="bg-[#292929] text-white w-full  text-sm rounded-md py-3">Save & Continue</button>
        </div>
      </div>
    </CoreModal>
  </main>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { useGetLocation } from "@/composables/core/useGetLocation";
import { ref, onMounted, watch } from 'vue'
const {
  states,
  cities,
  loadingStates,
  loadingCities,
  selectedState,
  selectedCity,
  handleStateChange,
} = useGetLocation();


// Define props with proper types for ref values
const props = defineProps<{ payload: any }>()

const isLocationModalOpen = ref(false)

interface Amenity {
  name: string
  address: string
  description: string
  latitude: number
  longitude: number
  type: string
}

interface Coordinates {
  lat: number
  lng: number
}

const selectedCountry = ref('NG')

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

// Default location (Lagos, Nigeria)
const defaultLocation = {
  lat: 6.5244,
  lng: 3.3792
}

let map: google.maps.Map
let placesService: google.maps.places.PlacesService
let autocomplete: google.maps.places.Autocomplete
let markers: google.maps.Marker[] = []
let currentLocationMarker: google.maps.Marker | null = null
let infoWindow: google.maps.InfoWindow
let googleServicesInitialized = false

onMounted(() => {
  if (!(window as any).google) {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => {
      initializeGoogleServices()
      checkExistingLocation()
    }
    document.head.appendChild(script)
  } else {
    initializeGoogleServices()
    checkExistingLocation()
  }
})

// Check if we have existing location data in the payload
function checkExistingLocation() {
  const hasLatitude = props.payload.latitude && props.payload.latitude.value
  const hasLongitude = props.payload.longitude && props.payload.longitude.value
  const hasAddress = props.payload.address && props.payload.address.value
  
  if (hasLatitude && hasLongitude) {
    // We have existing coordinates, use them
    const existingCoords = {
      lat: parseFloat(props.payload.latitude.value),
      lng: parseFloat(props.payload.longitude.value)
    }
    
    currentCoordinates.value = existingCoords
    
    if (googleServicesInitialized) {
      // If we have an address, create a place object directly
      if (hasAddress) {
        const place = {
          geometry: {
            location: new google.maps.LatLng(existingCoords.lat, existingCoords.lng)
          },
          name: 'Saved Location',
          formatted_address: props.payload.address.value
        } as google.maps.places.PlaceResult
        
        currentLocation.value = place
        updateMap(place, true)
        searchNearbyPlaces()
      } else {
        // Otherwise, reverse geocode to get the address
        reverseGeocode(existingCoords)
      }
    }
  } else if (hasAddress) {
    // We have an address but no coordinates, geocode it
    if (googleServicesInitialized) {
      geocodeAddress(props.payload.address.value)
    }
  } else {
    // No existing location data, get user location
    getUserLocation()
  }
}

function geocodeAddress(address: string) {
  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === 'OK' && results && results[0]) {
      const location = results[0].geometry.location
      
      currentCoordinates.value = {
        lat: location.lat(),
        lng: location.lng()
      }
      
      props.payload.latitude.value = location.lat()
      props.payload.longitude.value = location.lng()
      
      currentLocation.value = results[0]
      updateMap(results[0], true)
      searchNearbyPlaces()
    } else {
      console.error('Geocoder failed due to: ' + status)
      getUserLocation() // Fall back to user location
    }
  })
}

const typeMapping = {
  school: "Schools",
  university: "Universities",
  hospital: "Hospitals",
  clinic: "Clinics",
  pharmacy: "Pharmacies",
  dentist: "Dentists",
  doctor: "Doctors",
  restaurant: "Restaurants",
  cafe: "Cafes",
  bakery: "Bakeries",
  bar: "Bars",
  park: "Parks",
  gym: "Gyms",
  spa: "Spas",
  church: "Churches",
  mosque: "Mosques",
  hindu_temple: "Hindu Temples",
  synagogue: "Synagogues",
  lodging: "Hotels",
  night_club: "Night Clubs",
  museum: "Museums",
  art_gallery: "Art Galleries",
  library: "Libraries",
  movie_theater: "Movie Theaters",
  shopping_mall: "Shopping Malls",
  clothing_store: "Clothing Stores",
  supermarket: "Supermarkets",
  convenience_store: "Convenience Stores",
  gas_station: "Gas Stations",
  bus_station: "Bus Stations",
  train_station: "Train Stations",
  subway_station: "Subway Stations",
  taxi_stand: "Taxi Stands",
  airport: "Airports",
  atm: "ATMs",
  bank: "Banks",
  courthouse: "Courthouses",
  embassy: "Embassies",
  post_office: "Post Offices",
  police: "Police Stations",
  fire_station: "Fire Stations",
  car_rental: "Car Rental Services",
  car_repair: "Car Repair Shops",
  car_wash: "Car Wash Stations",
  parking: "Parking Lots",
  stadium: "Stadiums",
  zoo: "Zoos",
  amusement_park: "Amusement Parks",
  aquarium: "Aquariums",
  cemetery: "Cemeteries",
  funeral_home: "Funeral Homes",
} as any

watch(places, (newAmenities) => {
  const filteredAmenities = newAmenities.filter(
    (place: any) => !(place.name === "Lagos" && place.address === "Lagos")
  );

  const amenitiesArray = filteredAmenities.slice(0, 50000).map((place: any) => {
    const mainType = place.types?.find((type: any) => typeMapping[type]);
    const fallbackType = place.types?.[0] || "Unknown"; // Fallback to first type if no mapped type
    return {
      name: place.name,
      address: place.vicinity,
      description: place.vicinity,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      type: typeMapping[mainType] || fallbackType, // Use mapped type or fallback type
    };
  }).filter(Boolean);

  console.log(amenitiesArray, 'new amenities here poooo');
  props.payload.neighbouringLandmarks.value = amenitiesArray
});


interface LocationPayload {
  address: { value: string }
  latitude: { value: string }
  longitude: { value: string }
  value?: {
    latitude: string
    longitude: string
    address: string
  }
}

watch(currentLocation, (newLocation) => {
  if (!newLocation?.formatted_address) return;

  console.log(newLocation.formatted_address, 'my location');

  // Since the payload properties are refs, we can access their .value
  props.payload.address.value = newLocation.formatted_address;
  
  if (newLocation.geometry?.location) {
    props.payload.latitude.value = newLocation.geometry.location.lat();
    props.payload.longitude.value = newLocation.geometry.location.lng();
  }
});

function initializeGoogleServices() {
  try {
    // Initialize the map with default location (will be updated later)
    if (mapContainer.value) {
      map = new google.maps.Map(mapContainer.value, {
        center: defaultLocation,
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
            console.log(place, 'places here')
            currentLocation.value = place
            props.payload.latitude.value = place.geometry.location.lat()
            props.payload.longitude.value = place.geometry.location.lng()
            currentCoordinates.value = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
            updateMap(place)
            searchNearbyPlaces()
          }
        })
      }
      
      googleServicesInitialized = true
      
      // If we already have coordinates, use them
      if (currentCoordinates.value) {
        if (props.payload.address.value) {
          // If we have an address, create a place object directly
          const place = {
            geometry: {
              location: new google.maps.LatLng(currentCoordinates.value.lat, currentCoordinates.value.lng)
            },
            name: 'Saved Location',
            formatted_address: props.payload.address.value
          } as google.maps.places.PlaceResult
          
          currentLocation.value = place
          updateMap(place, true)
          searchNearbyPlaces()
        } else {
          // Otherwise, reverse geocode to get the address
          reverseGeocode(currentCoordinates.value)
        }
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
        props.payload.latitude.value = pos.lat
        props.payload.longitude.value = pos.lng
        
        if (googleServicesInitialized) {
          reverseGeocode(pos)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        handleLocationError(true)
      },
      { 
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  } else {
    handleLocationError(false)
  }
}

function handleLocationError(browserHasGeolocation: boolean) {
  console.error(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.')
  
  // Use default location only if we don't have existing coordinates
  if (!currentCoordinates.value) {
    currentCoordinates.value = defaultLocation
    props.payload.latitude.value = defaultLocation.lat
    props.payload.longitude.value = defaultLocation.lng
    
    if (googleServicesInitialized) {
      reverseGeocode(defaultLocation)
    }
  }
}

function reverseGeocode(latLng: google.maps.LatLngLiteral) {
  const geocoder = new google.maps.Geocoder()
  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === 'OK' && results && results[0]) {
      console.log(results, 'my location')
      currentLocation.value = results[0]
      updateMap(results[0], true)
      searchNearbyPlaces()
    } else {
      console.error('Geocoder failed due to: ' + status)
      // If reverse geocoding fails, still update the map with coordinates
      const dummyPlace = {
        geometry: {
          location: new google.maps.LatLng(latLng.lat, latLng.lng)
        },
        name: 'Selected Location',
        formatted_address: `Lat: ${latLng.lat.toFixed(6)}, Lng: ${latLng.lng.toFixed(6)}`
      } as google.maps.places.PlaceResult
      
      currentLocation.value = dummyPlace
      updateMap(dummyPlace, true)
      searchNearbyPlaces()
    }
  })
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
        <h3 class="font-semibold">${place.name || 'Selected Location'}</h3>
        <p>${place.formatted_address || ''}</p>
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
          const amenitiesArray = results.slice(0, 5000).map((place) => {
            const mainType = place.types?.find((type: any) => typeMapping[type]);
            if (mainType) {
              return {
                name: place.name,
                address: place.vicinity,
                description: place.vicinity,
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
                type: typeMapping[mainType], // Mapped type
              };
            }
          })
            .filter(Boolean); // Remove any undefined entries

          props.payload.neighbouringLandmarks.value = amenitiesArray

          places.value = results
          amenities.value = results.slice(0, 5000) // Store first 10 results as amenities
          isLocationModalOpen.value = true;
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