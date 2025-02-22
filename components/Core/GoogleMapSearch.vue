<template>
  <main>
    <div class="container mx-auto px-4">
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
        </div>
    </div>
  
    <CoreModal :isOpen="isLocationModalOpen" @close="isLocationModalOpen = false" title="Confirm property's address">
        <p class="text-xs text-[#667185]">Please review the address and ensure that all fields marked with '*' are completed</p>
        <div class="space-y-4">
         <section>
          <label class="text-xs mb-2 text-[#1D2739]">Country *</label>
          <select v-model="selectedCountry" class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100">
            <option value="NG">Nigeria</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <!-- Add more options or dynamically load them -->
          </select>
         </section>
  
        <section>
          <label class="text-xs mb-2 text-[#1D2739]">Street *</label>
          <input :value="payload.address.value" class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100" />
        </section>
  <!-- {{ states[0] }} -->
         <section>
          <label class="text-xs mb-2 text-[#1D2739]">State *</label>
          <select class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100" v-model="selectedState" @change="handleStateChange(selectedState)">
            <option v-for="state in states" :key="state.stateCode" :value="state.stateCode">
              {{ state.name }}
            </option>
          </select>
         </section>
  <!-- {{ cities[0] }} -->
         <section  v-if="!loadingCities">
          <label class="text-xs mb-2 text-[#1D2739]">City/Town *</label>
          <select v-model="selectedCity" class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100">
            <option v-for="city in cities" :key="city.id" :value="city.id">
              {{ city.name }}
            </option>
          </select>
         </section>
         <!-- {{ selectedCity }} -->
         <div v-if="loadingCities" class="h-10 animate-pulse w-full bg-slate-200 rounded"></div>
          <section>
            <label class="text-xs mb-2">Postcode (Optional)</label>
          <input type="tel" class="w-full py-3 text-sm pl-3 border rounded-lg outline-none border-gray-100" />
          </section>
  
          <div class="w-full pt-6 flex justify-between items-center gap-x-6">
            <button type="button" @click="isLocationModalOpen = false" class="bg-[#EBE5E0] text-[#292929] w-full  text-sm rounded-md py-3">Cancel</button>
            <button type="button" @click="isLocationModalOpen = false" class="bg-[#292929] text-white w-full  text-sm rounded-md py-3">Save & Continue</button>
          </div>
        </div>
      </CoreModal>
  </main>
  </template>
  
  <script setup lang="ts">
  import type { PropType } from 'vue'
  import { useGetLocation } from "@/composables/core/useGetLocation";
  import { ref, onMounted } from 'vue'
  
  const {
        states,
        cities,
        loadingStates,
        loadingCities,
        selectedState,
        selectedCity,
        handleStateChange,
      } = useGetLocation();
  
  
  // const props = defineProps({
  //   payload: {
  //     type: Object,
  //     required: true,
  //     default: () => ({})
  //   }
  // });
  
  // Define props with proper types for ref values
const props = defineProps({
  payload: {
    type: Object as PropType<LocationPayload>,
    required: true
  }
})

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
  
  const emit = defineEmits<{
    (e: 'update:amenities', amenities: any): void
    (e: 'update:payload', data: LocationPayload): void
    (e: 'update:location', location: Coordinates): void
  }>()

//   const emit = defineEmits<{
//   'update:location': [address: string]
//   'update:payload': [payload: LocationPayload]
// }>()
  
  const  selectedCountry = ref('Nigeria')
  
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
  };

  watch(places, (newAmenities) => {
  const filteredAmenities = newAmenities.filter(
    (place) => !(place.name === "Lagos" && place.address === "Lagos")
  );
  
  const amenitiesArray = filteredAmenities.slice(0, 10).map((place) => {
    const mainType = place.types?.find((type) => typeMapping[type]);
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
  emit("update:payload", {
    ...props.payload,
    neighbouringLandmarks: { value: amenitiesArray },
  });
});

// watch(currentLocation, (newLocation) => {
//   console.log(newLocation.formatted_address, 'my location')
//   if (newLocation && newLocation.formatted_address) {
//     emit('update:location', {
//       ...props.payload,
//       address: newLocation.formatted_address
//     })

//     emit("update:payload", {
//       ...props.payload,
//       value: {
//         ...props.payload.value,
//         latitude: newLocation.geometry?.location?.lat(),
//         longitude: newLocation.geometry?.location?.lng(),
//         address: newLocation.formatted_address
//       }
//     });
//   }
// });

// watch(currentLocation, (newLocation) => {
//   if (!newLocation?.formatted_address) return;

//   console.log(newLocation.formatted_address, 'my location');

//   const updatedPayload = {
//     ...props.payload,
//     address: newLocation.formatted_address
//   };

//   emit('update:location', updatedPayload);

//   emit('update:payload', {
//     ...updatedPayload,
//     value: {
//       ...props.payload?.value,
//       latitude: newLocation.geometry?.location?.lat(),
//       longitude: newLocation.geometry?.location?.lng(),
//       address: newLocation.formatted_address
//     }
//   });
// });

// watch(currentLocation, (newLocation) => {
//   if (!newLocation?.formatted_address) return;

//   console.log(newLocation.formatted_address, 'my location');

//   // Assign values directly to `props.payload.<field>.value`
//   props.payload.address.value = newLocation.formatted_address;
//   props.payload.latitude.value = newLocation.geometry?.location?.lat();
//   props.payload.longitude.value = newLocation.geometry?.location?.lng();

//   emit('update:location', props.payload.address.value);

//   emit('update:payload', {
//     ...props.payload,
//     value: {
//       ...props.payload.value,
//       latitude: props.payload.latitude.value,
//       longitude: props.payload.longitude.value,
//       address: props.payload.address.value
//     }
//   });
// });


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
  props.payload.latitude.value = String(newLocation.geometry?.location?.lat());
  props.payload.longitude.value = String(newLocation.geometry?.location?.lng());

  emit('update:location', props.payload.address.value);

  emit('update:payload', {
    ...props.payload,
    value: {
      latitude: props.payload.latitude.value,
      longitude: props.payload.longitude.value,
      address: props.payload.address.value,
    }
  });
});



  
  // watch(places, (newAmenities) => {
  //   const amenitiesArray = newAmenities.slice(0, 10).map((place: any) => {
  //               const mainType = place.types?.find((type: any) => typeMapping[type]);
  //               if (mainType) {
  //                 return {
  //                   name: place.name,
  //                   address: place.vicinity,
  //                   description: place.vicinity,
  //                   latitude: place.geometry.location.lat(),
  //                   longitude: place.geometry.location.lng(),
  //                   type: typeMapping[mainType], // Mapped type
  //                 };
  //               }
  //             })
  //             .filter(Boolean); // Remove any undefined entries
  //             console.log(amenitiesArray, 'new amenities here poooo')
  //     emit("update:payload", {
  //      ...props.payload,
  //       neighbouringLandmarks: { value: amenitiesArray },
  //  });
  //   // emit('update:amenities', newAmenities)
  // })
  
  
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
              console.log(place, 'places here')
              currentLocation.value = place
              props.payload.latitude = place.geometry.location.lat()
              props.payload.longitude = place.geometry.location.lng()
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
          props.payload.latitude = pos.lat
          props.payload.longitude = pos.lng
          // props.payload.value.longitude = pos.lng
          // console.log(pos, 'cordinsteshere')
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
        console.log(results, 'mu location')
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
           const amenitiesArray = results.slice(0, 10).map((place) => {
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
  
              //              // Emit the updated payload
              props.payload.neighbouringLandmarks = amenitiesArray
              emit("update:payload", {
              ...props.payload,
              neighbouringLandmarks: { value: amenitiesArray },
            });
  
            places.value = results
            amenities.value = results.slice(0, 10) // Store first 10 results as amenities
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
  
  