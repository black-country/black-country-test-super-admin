import { property_api } from "@/api_factory/modules/property";
import { useStorage } from '@vueuse/core';
import { ref, onMounted, watch } from "vue";
import { useFetchProperty } from "@/composables/modules/property/fetchProperty";
import { useRoute, useRouter } from "vue-router";

export const useEditProperty = () => {
  // Persistent form fields using useStorage
  const payload = {
    name: useStorage('property_name', null),
    description: useStorage('property_description', null),
    houseTypeId: useStorage('property_houseTypeId', null),
    cityId: useStorage('property_cityId', null),
    flooringTypeId: useStorage('property_flooringTypeId', null),
    size: useStorage('property_size', null),
    sizeUnit: useStorage('property_sizeUnit', 'sq ft'),
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
    agentId: useStorage('property_agentId', null),
    rules: useStorage('property_rules', []),
    questions: useStorage('property_questions', []),
    additionalCharges: useStorage('additional_charges', []),
    status: ref(null), // Add status field to payload for dynamic setting
  };

  const { propertyObj, getProperty, loading: fetchingProperty } = useFetchProperty();
  const route = useRoute();
  const router = useRouter();
  const queryId = ref(route.params.id as string || "");
  const loading = ref(false);
  const saving = ref(false)
  const { $_update_property } = property_api;

  // Initialize form data when component is mounted
  onMounted(async () => {
    await initForm();
  });

  const initForm = async () => {
    loading.value = true;
    await getProperty(queryId.value);
    console.log(propertyObj.value, 'again')
    populateForm(propertyObj.value); // Populate form with fetched data
    loading.value = false;
  };

  const populateForm = (data: any) => {
    console.log(data, 'fetched property')
    payload.name.value = data.name || "";
    payload.description.value = data.description || "";
    payload.houseTypeId.value = data.houseTypeId || "";
    payload.cityId.value = data.cityId || "";
    payload.flooringTypeId.value = data.flooringTypeId || "";
    payload.size.value = data.size || "";
    payload.sizeUnit.value = data.sizeUnit || "";
    payload.bedroomCount.value = data.bedroomCount || "";
    payload.bathroomCount.value = data.bathroomCount || "";
    payload.floorNumber.value = data.floorNumber || "";
    payload.longitude.value = data.coordinates.coordinates[1] || "";
    payload.latitude.value = data.coordinates.coordinates[0] || "";
    payload.images.value = data.images || [];
    payload.address.value = data.address || "";
    payload.isFurnishedCommonArea.value = data.isFurnishedCommonArea || false;
    payload.commonAreas.value = data.commonAreas || [];
    payload.neighbouringLandmarks.value = data.neighbouringLandmarks || [];
    payload.rooms.value = data.rooms || [];
    payload.agentId.value = data.agent.id || "";
    payload.rules.value = data.rules || [];
    payload.questions.value = data.preScreeningQuestions || [];
    payload.additionalCharges.value = data.additionalCharges || [];
  };

  // Function to clean and filter rooms and payload data
  const filterRooms = (rooms: any[]) => {
    return rooms
      .filter((room) => Array.isArray(room.features) && room.features.length > 0) // Remove rooms without features array
      .map((room) => {
        // Remove empty fields from each room
        return Object.keys(room).reduce((acc, key) => {
          const value = room[key];

          // Include only non-empty values
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
  };

  const finalPayload = (status: string) => {
    console.log(status, 'her from composale')
    const filteredRooms = filterRooms(payload.rooms.value); // Apply room filtering

    return {
      name: payload.name.value,
      description: payload.description.value,
      houseTypeId: payload.houseTypeId.value,
      cityId: payload.cityId.value,
      flooringTypeId: payload.flooringTypeId.value,
      size: Number(payload.size.value),
      sizeUnit: payload.sizeUnit.value,
      bedroomCount: Number(payload.bedroomCount.value),
      bathroomCount: Number(payload.bathroomCount.value),
      floorNumber: Number(payload.floorNumber.value),
      longitude: payload.longitude.value,
      latitude: payload.latitude.value,
      images: payload.images.value,
      address: payload.address.value,
      isFurnishedCommonArea: payload.isFurnishedCommonArea.value,
      commonAreas: payload.commonAreas.value,
      neighbouringLandmarks: payload.neighbouringLandmarks.value,
      rooms: filteredRooms, // Use the cleaned and filtered rooms
      agentId: payload.agentId.value,
      rules: payload.rules.value,
      questions: payload.questions.value,
      additionalCharges: payload.additionalCharges.value,
      status, // Adding the status to the payload
    };
  };

  // Edit Property function
  const editProperty = async () => {
    loading.value = true;
    const res = await $_update_property(queryId.value, finalPayload("published"));
    if (res.type !== "ERROR") {
      router.push("/dashboard/property/edit-success");
    }
    loading.value = false;
  };

  const savingProperty = async () => {
    saving.value = true;
    const res = await $_update_property(queryId.value, finalPayload("draft"));
    if (res.type !== "ERROR") {
      router.push("/dashboard/property/edit-success");
    }
    saving.value = false;
  };

  return { editProperty, payload, loading, initForm, fetchingProperty, saving, savingProperty };
};

