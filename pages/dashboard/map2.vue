<template>
    <div>
      
      <input
        ref="searchInput"
        type="text"
        id="search-box"
        placeholder="Search for a location"
        style="width: 100%; padding: 10px; font-size: 16px; margin-bottom: 10px;"
      />
      <GoogleMap
        :api-key="googleMapsApiKey"
        style="width: 100%; height: 500px"
        :center="center"
        :zoom="zoom"
      >
        <Marker :options="{ position: center, label: 'You' }" />
        <Marker
          v-for="(marker, index) in markers"
          :key="index"
          :options="{ position: marker.location, label: marker.name }"
        />
      </GoogleMap>
    </div>
  </template>
  
  <script>
  import { GoogleMap, Marker } from "vue3-google-map";
  import { Loader } from "@googlemaps/js-api-loader";
  
  export default {
    name: "App",
    components: { GoogleMap, Marker },
    props: {
      payload: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        center: { lat: 40.689247, lng: -111.044502 }, // Default to a general location
        zoom: 15,
        googleMapsApiKey: 'AIzaSyCa0Rx0TJ9BGkQ9NC23BZc51zCql_Xrhs0', // Secure your API key
        autocomplete: null, // This will hold the autocomplete object
        placesService: null, // To handle the Places API service
        markers: [], // Store markers for amenities
      };
    },
    mounted() {
      // Set map center to the user's current location on mount
      this.setCurrentLocation();
  
      // Initialize Autocomplete once the component is mounted
      this.initAutocomplete();
    },
    methods: {
      setCurrentLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              this.zoom = 15; // Adjust the zoom level if needed
            },
            (error) => {
              console.error("Error getting user location: ", error);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      },
      initAutocomplete() {
        // Load Google Maps places library
        const loader = new Loader({
          apiKey: this.googleMapsApiKey,
          version: "weekly",
          libraries: ["places"],
        });
  
        loader
          .load()
          .then(() => {
            const input = this.$refs.searchInput;
            this.autocomplete = new google.maps.places.Autocomplete(input);
  
            // Add a listener for the place changed event
            this.autocomplete.addListener("place_changed", this.onPlaceChanged);
  
            // Initialize Places service for nearby searches
            const map = new google.maps.Map(document.createElement('div')); // Temporary map for places service
            this.placesService = new google.maps.places.PlacesService(map);
          })
          .catch((error) => {
            console.error("Error loading Google Maps API:", error);
          });
      },
      onPlaceChanged() {
        const place = this.autocomplete.getPlace();
  
        if (!place.geometry) {
          console.error("No details available for the selected place");
          return;
        }
  
        // Update the map center to the new location
        this.center = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
  
        // Populate selected location data into props
        this.populateSelectedLocationData(place);
  
        // Optionally, update the zoom level to fit the selected place better
        this.zoom = 15;
  
        // Search for amenities near the selected place
        this.searchNearbyAmenities();
      },
      populateSelectedLocationData(place) {
        // Set the payload values with selected location data
        this.$emit('update:payload', {
          ...this.payload,
          latitude: { value: place.geometry.location.lat() },
          longitude: { value: place.geometry.location.lng() },
          address: { value: place.formatted_address || place.name }, // Using formatted_address or place name
          neighbouringLandmarks: { value: [] } // Initialize as an empty array for now
        });
      },
      searchNearbyAmenities() {
        if (!this.placesService) {
          console.error("Places Service not initialized");
          return;
        }
  
        // Clear previous markers
        this.markers = [];
  
        // Set up request parameters for the nearby search
        const request = {
          location: this.center,
          radius: 1500, // Define the radius (in meters) to search for amenities
          type: ['restaurant', 'cafe', 'park', 'gym'], // Add more amenity types as needed
        };
  
        // Perform the nearby search
        this.placesService.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Emit the amenities found
            this.emitAmenitiesData(results);
          } else {
            console.error("Error retrieving nearby amenities: ", status);
          }
        });
      },
      emitAmenitiesData(amenities) {
        // Format and emit the amenities data to the parent component
        const formattedAmenities = amenities.map((place) => ({
          name: place.name,
          type: place.types.join(", "), // Joining types for display
          description: place.vicinity, // Description can be set to vicinity or custom
          longitude: place.geometry.location.lng(),
          latitude: place.geometry.location.lat(),
          address: place.vicinity,
        }));
  
        // Store markers for each amenity
        this.markers = formattedAmenities.map(amenity => ({
          name: amenity.name,
          location: {
            lat: amenity.latitude,
            lng: amenity.longitude,
          },
        }));
  
        // Update props with neighbouring landmarks data
        this.$emit('update:payload', {
          ...this.payload,
          neighbouringLandmarks: { value: formattedAmenities },
        });
  
        // Example of how to log the amenities data
        console.log("Nearby amenities:", formattedAmenities);
      },
    },
  };
  </script>
  
  <style>
  /* Optional Styling */
  #search-box {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
  </style>
  