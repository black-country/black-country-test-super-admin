<template>
  <main>
    <div class="container mx-auto px-4">
      <div class="md:col-span-2 space-y-1">
        <div class="relative">
          <input ref="searchInput" type="text" v-model="localAddress" placeholder="Enter a location"
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
          </select>
        </section>

        <section>
          <label class="text-xs mb-2 text-[#1D2739]">Street *</label>
          <input v-model="streetAddress"
            class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100" />
        </section>

        <section>
          <label class="text-xs mb-2 text-[#1D2739]">State *</label>
          <select class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100"
            v-model="selectedState" @change="handleStateChange(selectedState)">
            <option v-for="state in states" :key="state.stateCode" :value="state.stateCode">
              {{ state.name }}
            </option>
          </select>
        </section>

        <section v-if="!loadingCities">
          <label class="text-xs mb-2 text-[#1D2739]">City/Town *</label>
          <select v-model="selectedCity"
            class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100">
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>
        </section>

        <div v-if="loadingCities" class="h-10 animate-pulse w-full bg-slate-200 rounded"></div>

        <div class="w-full pt-6 flex justify-between items-center gap-x-6">
          <button type="button" @click="isLocationModalOpen = false"
            class="bg-[#EBE5E0] text-[#292929] w-full text-sm rounded-md py-3">Cancel</button>
          <button type="button" @click="saveAndContinue"
            class="bg-[#292929] text-white w-full text-sm rounded-md py-3">Save & Continue</button>
        </div>
      </div>
    </CoreModal>
  </main>
</template>

<script setup lang="ts">
import { useGetLocation } from "@/composables/core/useGetLocation";
import { ref, onMounted, watch, computed } from 'vue'

const {
  states,
  cities,
  loadingStates,
  loadingCities,
  selectedState,
  selectedCity,
  handleStateChange,
} = useGetLocation();

const props = defineProps<{ payload: any }>()

const isLocationModalOpen = ref(false)
const selectedCountry = ref('NG')
const streetAddress = ref('')
const localAddress = ref('')

// CRITICAL FIX: Replace with your actual API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyCa0Rx0TJ9BGkQ9NC23BZc51zCql_Xrhs0'

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

// Watch for changes in localAddress and sync with payload
watch(localAddress, (newVal) => {
  if (props.payload?.address?.value !== undefined) {
    props.payload.address.value = newVal
  }
})

// Initialize localAddress from payload
watch(() => props.payload?.address?.value, (newVal) => {
  if (newVal && localAddress.value !== newVal) {
    localAddress.value = newVal
  }
}, { immediate: true })

onMounted(() => {
  // Check if API key is set
  if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    console.error('⚠️ GOOGLE_MAPS_API_KEY is not set! Please add your API key.')
    return
  }

  if (!(window as any).google) {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => {
      initializeGoogleServices()
      checkExistingLocation()
    }
    script.onerror = () => {
      console.error('Failed to load Google Maps API. Check your API key and billing status.')
    }
    document.head.appendChild(script)
  } else {
    initializeGoogleServices()
    checkExistingLocation()
  }
})

function checkExistingLocation() {
  const hasLatitude = props.payload?.latitude?.value
  const hasLongitude = props.payload?.longitude?.value
  const hasAddress = props.payload?.address?.value
  
  if (hasLatitude && hasLongitude) {
    const existingCoords = {
      lat: parseFloat(props.payload.latitude.value),
      lng: parseFloat(props.payload.longitude.value)
    }
    
    currentCoordinates.value = existingCoords
    
    if (googleServicesInitialized) {
      if (hasAddress) {
        const place = {
          geometry: {
            location: new google.maps.LatLng(existingCoords.lat, existingCoords.lng)
          },
          name: 'Saved Location',
          formatted_address: props.payload.address.value
        } as google.maps.places.PlaceResult
        
        currentLocation.value = place
        localAddress.value = props.payload.address.value
        updateMap(place, true)
        searchNearbyPlaces()
      } else {
        reverseGeocode(existingCoords)
      }
    }
  } else if (hasAddress) {
    if (googleServicesInitialized) {
      geocodeAddress(props.payload.address.value)
    }
  } else {
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
      
      if (props.payload?.latitude?.value !== undefined) {
        props.payload.latitude.value = location.lat()
      }
      if (props.payload?.longitude?.value !== undefined) {
        props.payload.longitude.value = location.lng()
      }
      
      currentLocation.value = results[0]
      updateMap(results[0], true)
      searchNearbyPlaces()
    } else {
      console.error('Geocoder failed due to: ' + status)
      getUserLocation()
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
    const fallbackType = place.types?.[0] || "Unknown";
    return {
      name: place.name,
      address: place.vicinity,
      description: place.vicinity,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      type: typeMapping[mainType] || fallbackType,
    };
  }).filter(Boolean);

  if (props.payload?.neighbouringLandmarks?.value !== undefined) {
    props.payload.neighbouringLandmarks.value = amenitiesArray
  }
});

watch(currentLocation, (newLocation) => {
  if (!newLocation?.formatted_address) return;

  localAddress.value = newLocation.formatted_address;
  
  if (newLocation.geometry?.location) {
    if (props.payload?.latitude?.value !== undefined) {
      props.payload.latitude.value = newLocation.geometry.location.lat();
    }
    if (props.payload?.longitude?.value !== undefined) {
      props.payload.longitude.value = newLocation.geometry.location.lng();
    }
  }
});

function initializeGoogleServices() {
  try {
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

      infoWindow = new google.maps.InfoWindow()
      placesService = new google.maps.places.PlacesService(map)

      if (searchInput.value) {
        autocomplete = new google.maps.places.Autocomplete(searchInput.value, {
          types: ['geocode']
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (place.geometry) {
            const addressDetails = parseAddressComponents(place)
            
            if (props.payload?.latitude?.value !== undefined) {
              props.payload.latitude.value = place.geometry.location.lat()
            }
            if (props.payload?.longitude?.value !== undefined) {
              props.payload.longitude.value = place.geometry.location.lng()
            }
            
            streetAddress.value = addressDetails.street
            selectedCountry.value = 'NG'
            
            const stateCode = findStateCode(addressDetails.state)
            if (stateCode) {
              selectedState.value = stateCode
              handleStateChange(stateCode)
            }
            
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
      
      googleServicesInitialized = true
      
      if (currentCoordinates.value) {
        if (props.payload?.address?.value) {
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
        
        if (props.payload?.latitude?.value !== undefined) {
          props.payload.latitude.value = pos.lat
        }
        if (props.payload?.longitude?.value !== undefined) {
          props.payload.longitude.value = pos.lng
        }
        
        if (googleServicesInitialized) {
          reverseGeocode(pos)
        }
      },
      (error) => {
        console.warn('Geolocation error:', error.message)
        handleLocationError(true)
      },
      { 
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  } else {
    handleLocationError(false)
  }
}

function handleLocationError(browserHasGeolocation: boolean) {
  console.warn(browserHasGeolocation ?
    'Geolocation failed. Using default location.' :
    'Browser doesn\'t support geolocation. Using default location.')
  
  if (!currentCoordinates.value) {
    currentCoordinates.value = defaultLocation
    
    if (props.payload?.latitude?.value !== undefined) {
      props.payload.latitude.value = defaultLocation.lat
    }
    if (props.payload?.longitude?.value !== undefined) {
      props.payload.longitude.value = defaultLocation.lng
    }
    
    if (googleServicesInitialized) {
      reverseGeocode(defaultLocation)
    }
  }
}

function reverseGeocode(latLng: google.maps.LatLngLiteral) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ location: latLng }, (results, status) => {
    if (status === 'OK' && results && results[0]) {
      const place = results[0];
      const addressDetails = parseAddressComponents(place);
      
      streetAddress.value = addressDetails.street;
      localAddress.value = place.formatted_address || '';
      selectedCountry.value = 'NG';
      
      const stateCode = findStateCode(addressDetails.state);
      if (stateCode) {
        selectedState.value = stateCode;
        handleStateChange(stateCode);
      }
      
      currentLocation.value = place;
      updateMap(place, true);
      searchNearbyPlaces();
    } else {
      console.error('Geocoder failed due to: ' + status)
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

  clearMarkers()
  map.setCenter(place.geometry.location)
  map.setZoom(14)

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
      radius: 2000,
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
                type: typeMapping[mainType],
              };
            }
          }).filter(Boolean);

          if (props.payload?.neighbouringLandmarks?.value !== undefined) {
            props.payload.neighbouringLandmarks.value = amenitiesArray
          }

          places.value = results
          amenities.value = results.slice(0, 5000)
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

function parseAddressComponents(place: google.maps.places.PlaceResult) {
  const addressComponents = place.address_components || [];
  const componentTypes = {
    street_number: 'streetNumber',
    route: 'street',
    locality: 'city',
    administrative_area_level_1: 'state',
    country: 'country',
    postal_code: 'postalCode'
  } as any;
  
  const parsedAddress: { [key: string]: string } = {};
  
  addressComponents.forEach(component => {
    component.types.forEach(type => {
      if (componentTypes[type]) {
        parsedAddress[componentTypes[type]] = component.long_name;
      }
    });
  });

  return {
    street: parsedAddress.streetNumber ? `${parsedAddress.streetNumber} ${parsedAddress.street || ''}`.trim() : parsedAddress.street || '',
    city: parsedAddress.city || '',
    state: parsedAddress.state || '',
    country: parsedAddress.country || '',
    postalCode: parsedAddress.postalCode || ''
  };
}

function findStateCode(stateName: string) {
  return states.value.find(state => 
    state.name.toLowerCase() === stateName.toLowerCase()
  )?.stateCode;
}

function saveAndContinue() {
  // Update payload with modal values
  if (props.payload?.address?.value !== undefined) {
    props.payload.address.value = streetAddress.value
  }
  isLocationModalOpen.value = false
}
</script>

<style scoped>
.pac-container {
  z-index: 9999;
}
</style>