import { ref, watch } from 'vue';
import { useStorage } from '@vueuse/core';
import { property_api } from "@/api_factory/modules/property";
import { useRouter } from "vue-router";
import { useGetFloorings } from '@/composables/modules/property/fetchFloorings'
import { useGetPropertyTypes } from '@/composables/modules/property/fetchPropertyTypes'
const { propertyTypesList, getPropertyTypes } = useGetPropertyTypes()
import { useCustomToast } from '@/composables/core/useCustomToast'
const { showToast } = useCustomToast();
const { flooringsList, geFloorings  } = useGetFloorings()

import { useClearLocalStorage } from '@/composables/core/useClearLocalStorage';
const { clearLocalStorage } = useClearLocalStorage();

// Initialize payload with useStorage to persist the data
const persistedPayload = {
  name: useStorage('property_name', null),
  description: useStorage('property_description', null),
  houseTypeId: useStorage('property_houseTypeId', null),
  cityId: useStorage('property_cityId', null),
  flooringTypeId: useStorage('property_flooringTypeId', null),
  size: useStorage('property_size', null),
  sizeUnit: useStorage('property_sizeUnit', null),
  bedroomCount: useStorage('property_bedroomCount', null),
  bathroomCount: useStorage('property_bathroomCount', null),
  floorNumber: useStorage('property_floorNumber', null),
  longitude: useStorage('property_longitude', null),
  latitude: useStorage('property_latitude', null),
  images: useStorage('property_images', []),
  address: useStorage('property_address', null),
  isFurnishedCommonArea: useStorage('property_isFurnishedCommonArea', false),
  commonAreas: useStorage('property_commonAreas', []),
  neighbouringLandmarks: useStorage('property_neighbouringLandmarks', []),
  rooms: useStorage('property_rooms', []),
  agentId: useStorage('property_agentId', ""),
  rules: useStorage('property_rules', []),
  questions: useStorage('property_questions', []),
};

const runtimePayload = {
  name: ref(null),
  description: ref(null),
  houseTypeId: ref(''),
  cityId: ref(null),
  flooringTypeId: ref(''),
  size: ref(null), // Remove `Number` here, keep it as `ref`
  sizeUnit: ref('sq ft'),
  bedroomCount: ref(null), // Remove `Number` here, keep it as `ref`
  bathroomCount: ref(null), // Remove `Number` here, keep it as `ref`
  floorNumber: ref(null), // Remove `Number` here, keep it as `ref`
  longitude: ref(null),
  latitude: ref(null),
  images: ref([]),
  address: ref(null),
  isFurnishedCommonArea: ref(false),
  commonAreas: ref([]),
  neighbouringLandmarks: ref([]),
  rooms: ref([]),
  agentId: ref(""),
  rules: ref([]),
  questions: ref([])
};

// Watch for changes to runtimePayload and update persistedPayload accordingly
Object.keys(runtimePayload).forEach((key) => {
  watch(runtimePayload[key], (val) => {
    persistedPayload[key].value = val;
  }, { deep: true });
});

// Function to reset the payloads to their initial state
const resetPayload = () => {
  Object.keys(runtimePayload).forEach((key) => {
    const initialValue = Array.isArray(runtimePayload[key].value) ? [] : null;
    runtimePayload[key].value = initialValue;
    persistedPayload[key].value = initialValue;
  });
  // Reset specific fields with default values
  runtimePayload.isFurnishedCommonArea.value = false;
  persistedPayload.isFurnishedCommonArea.value = false;
};

export const use_create_property = () => {
  const Router = useRouter();
  const loading = ref(false);
  const saving = ref(false)

  const create_property = async () => {
    // Remove rooms that have no features array
    const filteredRooms = runtimePayload.rooms.value
      .filter((room) => Array.isArray(room.features) && room.features.length > 0)
      .map((room) => {
        // Remove empty fields from each room
        return Object.keys(room).reduce((acc, key) => {
          const value = room[key];

          // Check if the value is non-empty and should be included
          if (
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0)
          ) {
            acc[key] = value;
          }

          return acc;
        }, {});
      });

    // Convert specific fields to numbers before creating the final payload
    const finalPayload = Object.keys(runtimePayload).reduce((acc, key) => {
      acc[key] = (['size', 'bedroomCount', 'bathroomCount', 'floorNumber'].includes(key) && runtimePayload[key].value !== null)
        ? Number(runtimePayload[key].value)
        : runtimePayload[key].value;
      return acc;
    }, { status: 'published' });


    finalPayload.status = 'published'
    // Set the cleaned and filtered rooms into the final payload
    finalPayload.rooms = filteredRooms;

    loading.value = true;
    try {
      const res = await property_api.$_create(finalPayload) as any
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Property was created successfully",
          toastType: "success",
          duration: 3000
        });
        clearLocalStorage()
        Router.push("/dashboard/property/success");
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
      }
    } catch (error) {
      if (error.response) {
        // Error response from the server
        console.log(error, 'error 1')
        const errorMessage = error.response.data?.message || 'An error occurred while creating the property.';
        useNuxtApp().$toast.error(errorMessage, {
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
        
      } else if (error.request) {
        console.log(error, 'error 2')
        useNuxtApp().$toast.error('No response from the server. Please check your network connection.', {
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
      } else {
        console.log(error, 'error 3')
        useNuxtApp().$toast.error(`Unexpected error: ${error.message}`, {
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
      }
    } finally {
      loading.value = false;
    }
  };

  const save_property = async () => {
    // Remove rooms that have no features array
    const filteredRooms = runtimePayload.rooms.value
      .filter((room) => Array.isArray(room.features) && room.features.length > 0)
      .map((room) => {
        // Remove empty fields from each room
        return Object.keys(room).reduce((acc, key) => {
          const value = room[key];
  
          // Check if the value is non-empty and should be included
          if (
            value !== null &&
            value !== "" &&
            !(Array.isArray(value) && value.length === 0)
          ) {
            acc[key] = value;
          }
  
          return acc;
        }, {});
      });
  
    // Convert specific fields to numbers before creating the final payload
    const finalPayload = Object.keys(runtimePayload).reduce((acc, key) => {
      acc[key] = (['size', 'bedroomCount', 'bathroomCount', 'floorNumber'].includes(key) && runtimePayload[key].value !== null)
        ? Number(runtimePayload[key].value)
        : runtimePayload[key].value;
      return acc;
    }, {});
  
    // Set isPublished to true explicitly
    finalPayload.status = 'draft';
  
    // Set the cleaned and filtered rooms into the final payload
    finalPayload.rooms = filteredRooms;
  
    saving.value = true;
    try {
      const res = await property_api.$_create(finalPayload) as any
      console.log(res, 'saving rse')
      if (res.type !== "ERROR") {
        showToast({
          title: "Success",
          message: "Property was successfully saved as draft.",
          toastType: "success",
          duration: 3000
        });
        clearLocalStorage();
        // Router.push("/dashboard/property/draft-success");
      } else {
        showToast({
          title: "Error",
          message: res?.data?.error || "An error occured",
          toastType: "error",
          duration: 3000
        });
      }
    } catch (error) {
      if (error.response) {
        // Error response from the server
        const errorMessage = error.response.data?.message || 'An error occurred while creating the property.';
        const errorDetails = error.response.data?.errors || [];
  
        // Display error message to the user
        // useNuxtApp().$toast.error(errorMessage, {
        //   autoClose: 5000,
        //   dangerouslyHTMLString: true,
        // });

        showToast({
          title: "Error",
          message: errorMessage || "An error occured",
          toastType: "error",
          duration: 3000
        });
        
      } else if (error.request) {
        showToast({
          title: "Error",
          message:  "No response from the server. Please check your network connection.",
          toastType: "error",
          duration: 3000
        });
      } else {
        // Other errors (e.g., unexpected exceptions)
        useNuxtApp().$toast.error(`Unexpected error: ${error.message}`, {
          autoClose: 5000,
          dangerouslyHTMLString: true,
        });
      }
    } finally {
      saving.value = false;
    }
  };

  return { payload: runtimePayload, create_property, loading, saving, save_property, resetPayload, persistedPayload };
};