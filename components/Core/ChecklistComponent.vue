

      <template>
        <div class="max-w-sm h-96 overflow-y-auto p-4 border-[0.5px] rounded-lg">        
          <div v-for="(items, group) in rentalChecklist" :key="group" class="mb-8">
            <h2 class="text-base font-semibold mb-4">{{ group }}</h2>
            
            <table class="w-full">
              <tbody>

                <tr v-for="item in items" :key="item.id" class="border-t border-gray-100 first:border-t-0">
                  <!-- {{ item.createdAt }} -->
                  <td class="py-4 text-sm w-1/3">{{ item.itemName }}</td>
                  <td class="py-4 text-sm w-1/3">
                    <div class="flex items-center gap-2">
                      <span>Good</span>
                      <div class="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center"
                           :class="{ 'border-green-500': item.state === 'good' }">
                        <svg v-if="item.state === 'good'" 
                             class="w-4 h-4 text-green-500" 
                             viewBox="0 0 20 20" 
                             fill="currentColor">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 text-sm w-1/3">
                    <div class="flex items-center gap-2">
                      <span>Needs repair</span>
                      <div class="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center"
                           :class="{ 'border-red-500': item.state === 'bad' }">
                        <svg v-if="item.state === 'bad'" 
                             class="w-4 h-4 text-red-500" 
                             viewBox="0 0 20 20" 
                             fill="currentColor">
                          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex items-center justify-between mt-12 mb-4">
            <div>
              <h2 class="text-sm font-medium">Move in checklist</h2>
              <p class="text-gray-600 text-sm">Date: {{ moment(selectedItem?.createdAt).format('DD MMMM YYYY') ?? 'Nil' }}</p>
            </div>
            <button @click="downloadChecklist" class="text-gray-600 hover:text-gray-800">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </button>
          </div>
        </div>
      </template>
      
      <script setup lang="ts">
          import moment from "moment";
      import { useCustomToast } from '@/composables/core/useCustomToast'
      const { showToast } = useCustomToast();
      import { computed } from 'vue'
      import { jsPDF } from "jspdf";
      
      interface InspectionItem {
        id: string;
        itemName: string;
        group: string;
        state: 'good' | 'bad';
        createdAt: string;
      }
      
      const props = defineProps({
        rentalChecklist: {
          type: Object,
          required: true,
          default: () => ({})
        },
        checklistType: {
            type: String
        }
      })
      
      // const formatDate = computed(() => {
      //   return new Date().toLocaleDateString('en-GB', {
      //     day: 'numeric',
      //     month: 'long',
      //     year: 'numeric'
      //   })
      // })

      // Reactive reference to the selected item
const selectedItem = ref<InspectionItem | null>(null);

// Automatically set the selected item on mount
onMounted(() => {
  // Loop through the rentalChecklist groups to find the first item
  for (const group in props.rentalChecklist) {
    if (props.rentalChecklist[group]?.length > 0) {
      selectedItem.value = props.rentalChecklist[group][0]; // Assign the first item
      console.log('Selected item on mount:', selectedItem.value); // Debug or process further
      break;
    }
  }
});
      
      // Compute the date for the checklist
const formatDate = computed(() => {
  // Extract the first available date from the checklist items
  for (const group in props.rentalChecklist) {
    if (props.rentalChecklist.hasOwnProperty(group)) {
      const items = props.rentalChecklist[group];
      if (items && items.length > 0) {
        return new Date(items[0].createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    }
  }
  // Fallback if no date is found
  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
});


      // Function to download checklist as PDF
      const downloadChecklist = () => {
        const doc = new jsPDF();
      
        // Add title to PDF
        doc.setFontSize(18);
        doc.text('Rental Checklist', 20, 20);
      
        // Add Date
        doc.setFontSize(12);
        doc.text(`Date: ${formatDate.value}`, 20, 30);
      
        // Loop through the rentalChecklist and add each group and items
        let yPosition = 40;
        for (const group in props.rentalChecklist) {
          if (props.rentalChecklist.hasOwnProperty(group)) {
            doc.setFontSize(14);
            doc.text(group, 20, yPosition);
            yPosition += 10;
      
            // Add table for items in this group
            const items = props.rentalChecklist[group];
            items.forEach(item => {
              doc.setFontSize(12);
              doc.text(`${item.itemName} - ${item.state === 'good' ? 'Good' : 'Needs Repair'}`, 20, yPosition);
              yPosition += 8;
            });
      
            yPosition += 5;  // Extra space after each group
          }
        }
      
        // Save the generated PDF
        doc.save('rental_checklist.pdf');
        showToast({
          title: "Success",
          message: `Move ${checklistType} Rental Checklist was downloaded successfully`,
          toastType: "error",
          duration: 3000
        });
      }
      </script>
      
      <style scoped>
      /* Add styles if needed */
      </style>
      