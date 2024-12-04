<!-- <template>
    <div class="max-w-4xl mx-auto p-4 grid grid-cols-2 gap-6">
      <div v-for="(items, group) in rentalChecklist" :key="group" class="mb-8 border-[0.5px] rounded-lg border-gray-100 p-3">
        <h2 class="text-sm font-semibold mb-6 capitalize">{{ group }}</h2>
        
        <div class="space-y-4">
          <div v-for="item in items" :key="item.id" 
               class="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-2">
            <div class="text-xs text-gray-600 capitalize">{{ item.itemName }}</div>
            
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs">Good</span>
              <div class="w-4 h-4 border-2 border-green-500 rounded flex items-center justify-center">
                <svg v-if="item.state === 'good'" 
                     class="w-4 h-4 text-green-500" 
                     viewBox="0 0 20 20" 
                     fill="currentColor">
                  <path fill-rule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <span class="text-gray-500 text-xs">Needs repair</span>
              <div class="w-4 h-4 border-2 border-green-500 rounded flex items-center justify-center">
                <svg v-if="item.state === 'bad'" 
                     class="w-4 h-4 text-green-500" 
                     viewBox="0 0 20 20" 
                     fill="currentColor">
                  <path fill-rule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div id="footer" class="flex items-center justify-between mt-8">
      <div>
        <h2 class="text-sm font-medium">{{ checklistType }} checklist</h2>
      </div>
      <button
              class="flex items-center gap-2 text-gray-600 hover:text-gray-800">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
           </div>
        </div>
          
      </div>
    </div>

    </template>
    
    <script setup lang="ts">
      import moment from "moment";
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
            default: () => {}
        },
        checklistType: {
            type: String
        }
    })
    </script> -->

    <template>
        <div class="max-w-4xl mx-auto p-4 border">        
          <!-- Checklist Items -->
          <div v-for="(items, group) in rentalChecklist" :key="group" class="mb-8">
            <h2 class="text-base mb-4">{{ group }} <span class="text-gray-500">(if applicable)</span></h2>
            
            <table class="w-full">
              <tbody>
                <tr v-for="item in items" :key="item.id" class="border-t border-gray-100 first:border-t-0">
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
                           :class="{ 'border-green-500': item.state === 'bad' }">
                        <svg v-if="item.state === 'bad'" 
                             class="w-4 h-4 text-green-500" 
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
      
          <!-- Footer -->
          <div class="flex items-center justify-between mt-12 mb-4">
            <div>
              <h2 class="text-2xl font-medium">Move in checklist</h2>
              <p class="text-gray-600">Date: {{ formatDate }}</p>
            </div>
            <button class="text-gray-600 hover:text-gray-800">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </button>
          </div>
        </div>
      </template>
      
      <script setup lang="ts">
      import { computed } from 'vue'
      
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
        }
      })
      
      const formatDate = computed(() => {
        return new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      })
      </script>