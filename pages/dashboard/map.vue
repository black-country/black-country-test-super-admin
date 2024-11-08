<template>
    <main>
      <div class="relative w-full h-[80vh] max-w-7xl mx-auto">
        <div class="absolute top-0 z-10 w-full">
          <section class="p-2">
            <input
             v-model="search" 
             @input="onInput"
              type="text"
              class="p-4 outline-none rounded-t-lg py-4 pl-10 shadow-md w-full"
              placeholder="Enter location"
            />
            <div class="absolute left-3 top-6">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.83594 15C4.31183 15.3431 3.33594 15.8703 3.33594 16.4614C3.33594 17.4953 6.3207 18.3333 10.0026 18.3333C13.6845 18.3333 16.6693 17.4953 16.6693 16.4614C16.6693 15.8703 15.6934 15.3431 14.1693 15" stroke="#292929" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M12.0807 7.50033C12.0807 8.65091 11.148 9.58366 9.9974 9.58366C8.84681 9.58366 7.91406 8.65091 7.91406 7.50033C7.91406 6.34973 8.84681 5.41699 9.9974 5.41699C11.148 5.41699 12.0807 6.34973 12.0807 7.50033Z" stroke="#292929" stroke-width="1.5"/>
                <path d="M11.0452 14.5783C10.7641 14.849 10.3885 15.0003 9.99756 15.0003C9.60656 15.0003 9.2309 14.849 8.94981 14.5783C6.37598 12.0843 2.92672 9.29824 4.60882 5.25343C5.51831 3.06643 7.70151 1.66699 9.99756 1.66699C12.2936 1.66699 14.4767 3.06643 15.3862 5.25343C17.0662 9.29316 13.6254 12.0929 11.0452 14.5783Z" stroke="#292929" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="absolute right-3 top-6">
              <svg v-if="Object.keys(selectedObj).length" width="20" class="cursor-pointer" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1641 2.78184C12.9383 2.0728 11.5152 1.66699 9.9974 1.66699C5.39502 1.66699 1.66406 5.39795 1.66406 10.0003C1.66406 14.6027 5.39502 18.3337 9.9974 18.3337C14.5997 18.3337 18.3307 14.6027 18.3307 10.0003C18.3307 9.42958 18.2733 8.87216 18.1641 8.33366" stroke="#5B8469" stroke-width="2" stroke-linecap="round"/>
                <path d="M6.66406 10.417C6.66406 10.417 7.91406 10.417 9.58073 13.3337C9.58073 13.3337 14.2131 5.69477 18.3307 4.16699" stroke="#5B8469" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else @click="handleClose" class="cursor-pointer" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.8307 4.16699L4.16406 15.8337M4.16406 4.16699L15.8307 15.8337" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </section>
          <section class="absolute w-full top-12">
            <div class="px-2">
              <ul
                v-if="suggestions.length > 0"
                class="space-y-1 bg-white shadow-lg rounded-b-lg max-h-60 overflow-y-auto scrollbar-none z-20 mt-2 p-2"
              >
                <li
                  v-for="(suggestion, index) in suggestions"
                  :key="index"
                  class="p-4 cursor-pointer hover:bg-gray-100 flex items-center gap-x-3"
                  @click="selectLocation(suggestion)"
                >
                  <span class="text-sm">{{ suggestion.description }}</span>
                </li>
              </ul>
            </div>
          </section>
          
       
          <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <div class="spinner border-t-4 border-indigo-500 rounded-full w-6 h-6 animate-spin"></div>
          </div>
        </div>
    
   
        <div v-if="errorMessage" class="absolute top-24 left-5 z-10 bg-red-500 text-white p-4 rounded-lg">
          {{ errorMessage }}
        </div>
    
 
        <div ref="mapContainer" class="w-full h-full rounded-xl border-2 border-gray-200"></div>
      </div>
      <slot name="action-buttons"></slot>
    </main>
    </template>
    
    <script setup lang="ts">
    import axios from 'axios';
    import debounce from 'lodash.debounce';
    import { onMounted, ref, watch } from 'vue';
    
    // Props
    const props = defineProps({
      payload: {
        type: Object,
        default: () => ({ latitude: ref(null), longitude: ref(null), address: ref('') }),
      },
    });
    
    // Emits
    const emit = defineEmits(['locationSelected']);
    
    const map = ref<google.maps.Map | null>(null);
    const mapContainer = ref<HTMLDivElement | null>(null);
    const searchQuery = ref('');
    const suggestions = ref([]);
    const selectedObj = ref({});
    const loading = ref(false);
    const errorMessage = ref('');
    
    // Initialize Google Maps
    const initMap = () => {
      if (mapContainer.value) {
        map.value = new google.maps.Map(mapContainer.value, {
          center: { lat: 40.730610, lng: -73.935242 }, // Default coordinates (New York City)
          zoom: 10,
        });
    
        // Geolocation
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          map.value.setCenter({ lat: latitude, lng: longitude });
          map.value.setZoom(12);
        });
      }
    };
    
    // Watch for changes in the selected location and update the map
    // watch(selectedObj, (newValue) => {
    //   if (Object.keys(newValue).length) {
    //     const { geometry, description } = newValue;
    //     const location = {
    //       lat: geometry.location.lat(),
    //       lng: geometry.location.lng(),
    //     };
    //     map.value?.panTo(location);
    //     addMarker(location.lat, location.lng, description);
    //     emit('locationSelected', { coordinates: [location.lng, location.lat], address: description });
    //   }
    // });
    
    // Debounce the search function
    const debouncedHandleSearch = debounce(() => {
      handleSearch();
    }, 300);

const handleSearch = async () => {
  if (!searchQuery.value) {
    suggestions.value = [];
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
      params: {
        input: searchQuery.value,
        key: 'AIzaSyCTBVK36LVNlXs_qBOC4RywX_Ihf765lDg',
      },
    });

    // Check if suggestions are available
    if (response.data.predictions && response.data.predictions.length > 0) {
      suggestions.value = response.data.predictions.map(prediction => ({
        ...prediction,
        geometry: {
          location: {
            lat: () => prediction.geometry.location.lat(),
            lng: () => prediction.geometry.location.lng(),
          },
        },
      }));
    } else {
      suggestions.value = [];
    }

  } catch (error) {
    console.error('Error fetching suggestions:', error); // Log the error for debugging
    errorMessage.value = 'Error fetching suggestions. Please try again.';
  } finally {
    loading.value = false;
  }
};
    // Clear selection
    const handleClose = () => {
      selectedObj.value = {};
      searchQuery.value = '';
      suggestions.value = [];
    };
    
    // Add marker to the map
    const addMarker = (lat, lng, popupText) => {
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map.value,
        title: popupText,
      });
    
      const infowindow = new google.maps.InfoWindow({
        content: `<strong>${popupText}</strong>`,
      });
    
      marker.addListener('click', () => {
        infowindow.open(map.value, marker);
      });
    };

const selectLocation = async (suggestion) => {
  console.log("Selected Suggestion:", suggestion); // Log the suggestion for debugging
  selectedObj.value = suggestion;
  searchQuery.value = suggestion.description;
  suggestions.value = [];

  try {
    // Fetch place details to get geometry
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        place_id: suggestion.place_id, // Get place_id from the suggestion
        key: 'AIzaSyCTBVK36LVNlXs_qBOC4RywX_Ihf765lDg',
      },
    });

    const placeDetails = response.data.result;
    
    // Check if geometry exists
    if (placeDetails && placeDetails.geometry && placeDetails.geometry.location) {
      const location = {
        lat: placeDetails.geometry.location.lat(),
        lng: placeDetails.geometry.location.lng(),
      };

      // Fly to the location
      flyToLocation(location);
    } else {
      console.error('Place details do not have valid geometry:', placeDetails);
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
  }
};


const search = ref('');
// const suggestions = ref([]);

const onInput = async () => {
  if (search.value.length > 2) {
    const autocompleteService = new google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({ input: search.value }, (predictions, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        suggestions.value = predictions;
      } else {
        console.error('Error fetching suggestions:', status);
      }
    });
  } else {
    suggestions.value = [];
  }
};

const selectSuggestion = (suggestion) => {
  search.value = suggestion.description;
  suggestions.value = [];
  // Handle the selected suggestion as needed
};2

// Fly to the specified location with animation
const flyToLocation = (location) => {
  if (map.value) {
    const currentZoom = map.value.getZoom();
    const targetZoom = currentZoom + 2; // Zoom in by 2 levels
    const initialCenter = map.value.getCenter();

    // Animation parameters
    const duration = 1000; // 1 second
    const steps = 60; // Number of animation steps
    const interval = duration / steps; // Interval in milliseconds

    let step = 0;

    const animate = () => {
      step++;
      const progress = step / steps;

      // Interpolating between the initial and target zoom
      const zoom = currentZoom + (targetZoom - currentZoom) * progress;

      // Calculate the intermediate center
      const lat = initialCenter.lat() + (location.lat - initialCenter.lat()) * progress;
      const lng = initialCenter.lng() + (location.lng - initialCenter.lng()) * progress;

      // Set the map center and zoom
      map.value.setCenter({ lat, lng });
      map.value.setZoom(zoom);

      if (step < steps) {
        requestAnimationFrame(animate);
      } else {
        // Ensure the final position is set
        map.value.setCenter(location);
        map.value.setZoom(targetZoom);
      }
    };

    animate();
  }
};

    
    onMounted(() => {
      initMap();
    });
    </script>
    
    <style scoped>
    .spinner {
      border: 2px solid #f3f3f3; /* Light grey */
      border-top: 2px solid #3498db; /* Blue */
      border-radius: 50%;
      width: 30px;
      height: 30px;
      animation: spin 2s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    </style>
    