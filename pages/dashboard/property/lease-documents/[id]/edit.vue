<template>
    <main>
      <div class="bg-gray-100">
        <!-- Header with back button and template title -->
        <div class="flex justify-between items-center bg-white p-4 shadow px-10">
          <div class="flex items-center space-x-2">
            <button @click="router.back()" class="text-gray-600 bg-gray-100 text-sm py-3 px-4 rounded-md hover:text-black">
              <span>&larr;</span> Back
            </button>
            <h1 class="text-lg font-semibold">{{ templateTitle }}</h1>
          </div>
          <div class="relative">
            <!-- Preview and Use Template Buttons -->
            <div class="flex space-x-4">
              <button @click="previewDocument" class="bg-transparent text-green-600 hover:underline">
                Preview
              </button>
              <button @click="useTemplate" class="bg-black text-sm text-white px-4 py-3 rounded-md">
                Use Template
              </button>
              <!-- More options button -->
              <button
                class="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
                @click="toggleDropdown"
              >
                &#8942;
              </button>
            </div>
    
            <!-- Dropdown modal -->
            <div
              v-if="dropdownVisible"
              class="absolute right-0 z-50 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden"
            >
              <ul>
                <li
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  @click="sendNow"
                >
                  Send now
                </li>
                <li
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  @click="saveAndExit"
                >
                {{loading ? 'processing..' : ' Save and exit'}}
                </li>
                <li
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  @click="duplicateTemplate"
                >
                  Duplicate
                </li>
                <li
                  class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                  @click="deleteTemplate"
                >
                  Delete
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <LayoutWithoutSidebar class="h-0 bg-gray-300">
        <div class="flex min-h-screen bg-gray-25">
          <!-- Left Side: Text Editor -->
          <div class="flex-1 p-10 bg-gray-25">
            <div contenteditable="true" class="border border-gray-300 px-10 bg-white p-4 outline-none border-none rounded-lg shadow-sm min-h-[500px]" ref="editor">
              Start editing your text here...
            </div>
          </div>
      
          <!-- Right Side: Settings Panel -->
          <div class="w-1/3 p-6 bg-white rounded-lg mt-10 mr-10 ">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Settings</h3>
            <p class="text-gray-500 mb-6">Edit template according to your liking</p>
      
            <div class="space-y-6">
              <!-- Status -->
              <div class="flex justify-between itemskkk">
                <p class="text-gray-500 text-sm mb-1">Status</p>
                <span class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-full">Drafted</span>
              </div>
      
              <!-- Alignment -->
              <div>
                <p class="text-gray-900 text-sm mb-1">Alignment</p>
                <div class="flex space-x-4">
                  <button :class="[alignmentPosition === 'justify' ? 'bg-[#5B8469] text-white' : 'bg-gray-25 text-gray-500']" @click="setAlignment('justify')" class="p-2 border-[0.5px] gap-y-2 border-gray-25 rounded-md  text-xs flex justify-center items-center flex-col">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3 9H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3 15H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3 21H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                    Justify</button>
                  <button :class="[alignmentPosition === 'left'  ? 'bg-[#5B8469] text-white' : 'bg-gray-25 text-gray-500']" @click="setAlignment('left')" class="p-2 border-[0.5px] gap-y-2 border-gray-25 rounded-md text-xs flex justify-center items-center flex-col">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.16797 3H11.168" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.16797 9H11.168" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.16797 15H21.168" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.16797 21H21.168" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                    Left align</button>
                  <button :class="[alignmentPosition === 'center'  ? 'bg-[#5B8469] text-white' : 'bg-gray-25 text-gray-500']" @click="setAlignment('center')" class="p-2 border-[0.5px] gap-y-2 border-gray-25 rounded-md text-xs flex justify-center items-center flex-col">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 3H21.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8.5 9H16.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.5 15H21.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8.5 21H16.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                    Center</button>
                  <button :class="[alignmentPosition === 'right'  ? 'bg-[#5B8469] text-white' : 'bg-gray-25 text-gray-500']" @click="setAlignment('right')" class="p-2 border-[0.5px] gap-y-2 border-gray-25 rounded-md text-xs flex justify-center items-center flex-col">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.832 3H21.832" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.832 9H21.832" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.83203 15H21.832" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.83203 21H21.832" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                    Right align</button>
                </div>
              </div>
      
              <!-- Listing -->
              <div>
                <p class="text-gray-500 text-sm mb-1">Listing</p>
                <div class="flex space-x-5">
                  <button  :class="[listingPosition === 'ordered' ? 'bg-[#5B8469] text-white' : 'bg-gray-50 text-gray-500']" @click="setList('ordered')" class="p-2  border-gray-200 rounded-md gap-y-2 border-[0.5px] gap-y-2 border-gray-25 text-xs flex justify-center items-center flex-col">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.5 5H20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
                      <path d="M4.5 5H4.50898" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4.5 12H4.50898" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4.5 19H4.50898" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M8.5 12H20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
                      <path d="M8.5 19H20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                      
                    Ordered List</button>
                  <button  :class="[listingPosition === 'unordered' ? 'bg-[#5B8469] text-white' : 'bg-gray-50 text-gray-500']" @click="setList('unordered')" class="p-2  border-gray-200 rounded-md gap-y-2 border-[0.5px] gap-y-2 border-gray-25 text-xs flex justify-center items-center flex-col">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 6H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
                      <path d="M11 12H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
                      <path d="M11 18H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
                      <path d="M3 15H4.5C4.77879 15 4.91819 15 5.03411 15.0231C5.51014 15.1177 5.88225 15.4899 5.97694 15.9659C6 16.0818 6 16.2212 6 16.5C6 16.7788 6 16.9182 5.97694 17.0341C5.88225 17.5101 5.51014 17.8823 5.03411 17.9769C4.91819 18 4.77879 18 4.5 18C4.22121 18 4.08181 18 3.96589 18.0231C3.48986 18.1177 3.11775 18.4899 3.02306 18.9659C3 19.0818 3 19.2212 3 19.5V20.4C3 20.6828 3 20.8243 3.08787 20.9121C3.17574 21 3.31716 21 3.6 21H6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3 3H4.2C4.36569 3 4.5 3.13431 4.5 3.3V9M4.5 9H3M4.5 9H6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                    Unordered List</button>
                </div>
              </div>
      
              <!-- Font Style & Size -->
              <div>
                <p class="text-gray-500 text-sm mb-1">Font style & size</p>
                <div class="flex space-x-2 items-center pb-3">
                  <select v-model="selectedFont" class="p-2 border-[0.5px] rounded-md outline-none border-gray-100">
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                  <input type="number" v-model="fontSize" class="w-16 p-2 border-[0.5px] outline-none border-gray-100 rounded-md" min="8" max="48" />
                </div>
                <div class="flex space-x-2 mt-2">
                  <button @click="setBold" class="p-2 border rounded-md hover:bg-gray-100">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.16797 5C4.16797 3.82149 4.16797 3.23223 4.53409 2.86612C4.9002 2.5 5.48946 2.5 6.66797 2.5H10.4837C12.5185 2.5 14.168 4.17893 14.168 6.25C14.168 8.32107 12.5185 10 10.4837 10H4.16797V5Z" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M10.3585 10H11.3902C13.3846 10 15.0013 11.6789 15.0013 13.75C15.0013 15.8211 13.3846 17.5 11.3902 17.5H6.66797C5.48946 17.5 4.9002 17.5 4.53409 17.1339C4.16797 16.7677 4.16797 16.1785 4.16797 15V10" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                  <button @click="setUnderline" class="p-2 border rounded-md hover:bg-gray-100">U</button>
                  <button @click="setItalic" class="p-2 border rounded-md hover:bg-gray-100"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3.33301H15.8333" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
                    <path d="M6.66797 16.6663L13.3346 3.33301" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
                    <path d="M4.16797 16.667H10.0013" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    </button>
                  <input type="color" v-model="fontColor" class="p-2 border rounded-md">
                </div>
              </div>
      
              <!-- Paragraph Format -->
              <div>
                <p class="text-gray-500 text-sm mb-1">Paragraph format</p>
                <div class="flex space-x-2">
                  <button :class="[paragraphPosition === 'p' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']" @click="setHeading('p')" class="p-2 border-[0.5px] border-gray-100 rounded-md">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 4.5V20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M18 4.5V20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M6 12.5H18" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                  <button :class="[paragraphPosition === 'h1' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']" @click="setHeading('h1')" class="p-2 border-[0.5px] border-gray-100 rounded-md">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17 19.5H18.5M18.5 19.5H20M18.5 19.5V11.5L17 12.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4 12.5H14" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                  <button :class="[paragraphPosition === 'h2' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']" @click="setHeading('h2')" class="p-2 border-[0.5px] border-gray-100 rounded-md">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.5 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M20.5 19.5H16.5V19.1907C16.5 18.7521 16.5 18.5327 16.5865 18.3385C16.673 18.1443 16.836 17.9976 17.1621 17.7041L19.7671 15.3596C20.2336 14.9397 20.5 14.3416 20.5 13.714V13.5C20.5 12.3954 19.6046 11.5 18.5 11.5C17.3954 11.5 16.5 12.3954 16.5 13.5V13.9" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.5 12.5H13.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                  <button :class="[paragraphPosition === 'h3' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']" @click="setHeading('h3')" class="p-2 border-[0.5px] border-gray-100 rounded-md">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M14 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M17 17C17 18.1046 17.8954 19 19 19C20.1046 19 21 18.1046 21 17C21 15.8954 20.1046 15 19 15C20.1046 15 21 14.1046 21 13C21 11.8954 20.1046 11 19 11C17.8954 11 17 11.8954 17 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M4 12H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                  <button :class="[paragraphPosition === 'h4' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']" @click="setHeading('h4')" class="p-2 border-[0.5px] border-gray-100 rounded-md">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.5 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16.5 11.5V15.5H20.5M20.5 15.5V19.5M20.5 15.5V11.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.5 12.5H13.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                  <button :class="[paragraphPosition === 'h5' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']" @click="setHeading('h5')" class="p-2 border-[0.5px] border-gray-100 rounded-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 5V19" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.5 5V19" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16.5 16.5V17C16.5 18.1046 17.3954 19 18.5 19C19.6046 19 20.5 18.1046 20.5 17V16.5C20.5 15.1193 19.3807 14 18 14H16.5V11H20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.5 12H13.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                  <button :class="[paragraphPosition === 'h6' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']" @click="setHeading('h6')" class="p-2 border-[0.5px] border-gray-100 rounded-md">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.5 5V19" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.5 5V19" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M16.5 17C16.5 18.1046 17.3954 19 18.5 19C19.6046 19 20.5 18.1046 20.5 17C20.5 15.8954 19.6046 15 18.5 15C17.3954 15 16.5 15.8954 16.5 17ZM16.5 17V13C16.5 11.8954 17.3954 11 18.5 11C19.6046 11 20.5 11.8954 20.5 13" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M3.5 12H13.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                </div>
              </div>
      
              <!-- Insert Options -->
              <div>
                <p class="text-gray-500 text-sm mb-1">Insert</p>
                <div class="flex space-x-2">
                  <button @click="insertImage" class="p-2 border rounded-md hover:bg-gray-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.5095 2.99023C7.02664 2.99023 4.78525 2.99023 3.39262 4.38232C2 5.77441 2 8.01494 2 12.496C2 16.977 2 19.2176 3.39262 20.6097C4.78525 22.0018 7.02664 22.0018 11.5095 22.0018C15.9922 22.0018 18.2336 22.0018 19.6263 20.6097C21.0189 19.2176 21.0189 16.977 21.0189 12.496V11.9957" stroke="#1D2739" stroke-width="2" stroke-linecap="round"/>
                      <path d="M5 20.9902C9.20998 16.2389 13.9412 9.9377 21 14.6636" stroke="#1D2739" stroke-width="2"/>
                      <path d="M17.9939 1.99805V10.0062M21.9995 5.97704L13.9883 5.99193" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                  <button @click="insertLine" class="p-2 border rounded-md hover:bg-gray-100">
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 12H22.0002" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      
                  </button>
                  <button @click="insertTable" class="p-2 border rounded-md hover:bg-gray-100">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.1087 20.1088C18.7175 21.5 16.4784 21.5 12 21.5C7.52165 21.5 5.28248 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4784 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89125C5.28248 2.5 7.52165 2.5 12 2.5C16.4784 2.5 18.7175 2.5 20.1087 3.89125C21.4999 5.28249 21.4999 7.52166 21.4999 12C21.4999 16.4784 21.4999 18.7175 20.1087 20.1088Z" stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M9 21.5V2.5" stroke="#1D2739" stroke-width="2"/>
                      <path d="M21.4999 8H2.5" stroke="#1D2739" stroke-width="2"/>
                      <path d="M21.4999 16H2.5" stroke="#1D2739" stroke-width="2"/>
                      </svg>
                      
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    
        <!-- Preview Modal -->
        <div v-if="showPreview" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 class="text- font-semibold mb-4">Preview Document</h2>
            <div v-html="previewContent" class="p-4 rounded-lg shadow-sm min-h-[300px]"></div>
            <button @click="showPreview = false" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">Close</button>
          </div>
        </div>
      </LayoutWithoutSidebar>
    </main>
    </template>
    
    <script setup lang="ts">
    import LayoutWithoutSidebar from '@/layouts/dashboardWithoutSidebar.vue';
    import { useCustomToast } from '@/composables/core/useCustomToast'
    import { useCreateLeaseTemplate } from '@/composables/modules/lease/create'
    const {  createLeaseTemplate, loading, payload, setPayloadObj } = useCreateLeaseTemplate()
    const { showToast } = useCustomToast();

    const router = useRouter()

    definePageMeta({
     middleware: 'auth'
});

    
    const editor = ref<HTMLElement | null>(null);
    const selectedFont = ref('Arial');
    const fontSize = ref(14);
    const fontColor = ref('#z000000');
    const showPreview = ref(false);
    const previewContent = ref('');
    const templateTitle = 'Lease Agreement';
    const dropdownVisible = ref(false);
    const alignmentPosition = ref('justify')
    const listingPosition = ref('ordered')
    const paragraphPosition = ref('p')
    
    const leaseAgreementContent = `
      <h2 style="font-size: 1.5rem; font-weight: 600; color: #2D3748; text-align: center; margin-bottom: 1rem;">Lease Agreement</h2>
      <p style="text-align: center; color: #718096; margin-bottom: 1.5rem;">
        This is a legally binding agreement. If not understood, consult an Attorney.
      </p>
      <ol style="list-style-type: decimal; margin-left: 1rem; space-y: 1.5rem;">
        <li>
          <strong>Parties:</strong>
          This Lease Agreement is entered into on [Date] between: [Homeowner's Name], hereinafter referred to as the "Landlord", and [Tenant's Name], hereinafter referred to as the "Tenant".
        </li>
        <li>
          <strong>Property:</strong>
          The Landlord agrees to lease to the Tenant, and the Tenant agrees to rent from the Landlord, located at [Property location].
        </li>
        <li>
          <strong>Terms of Lease:</strong>
          The lease shall commence on [Start Date] and continue until [End Date], unless terminated earlier as provided in this agreement.
        </li>
        <li>
          <strong>Rent and Payments:</strong>
          <ul style="list-style-type: disc; margin-left: 1rem;">
            <li>The Tenant agrees to pay rent in the amount of [Monthly Rent] per month, due on the [Day of the Month] of each month.</li>
            <li>Rent payments shall be made by [Accepted Payment Method], to be delivered to the Landlord or as directed by the Landlord.</li>
          </ul>
        </li>
        <li>
          <strong>Security Deposit:</strong>
          <ul style="list-style-type: disc; margin-left: 1rem;">
            <li>The Tenant shall provide a security deposit in the amount of [Security Deposit Amount] upon execution of this agreement.</li>
            <li>The security deposit shall be held by the Landlord as security for the performance of the Tenant's obligations under this lease.</li>
          </ul>
        </li>
        <li>
          <strong>Use of Property:</strong>
          <ul style="list-style-type: disc; margin-left: 1rem;">
            <li>The Tenant shall use the property solely for residential purposes and shall not engage in any illegal activities on the premises.</li>
            <li>The Tenant shall comply with all applicable laws, rules, and regulations governing the use of the property.</li>
          </ul>
        </li>
        <li>
          <strong>Maintenance and Repairs:</strong>
          Details of maintenance and repair responsibilities.
        </li>
      </ol>
    `;
    
    onMounted(() => {
        const parsedData = JSON.parse(localStorage.getItem("templateObj"));
      if (editor.value) {
        editor.value.innerHTML = parsedData.body || leaseAgreementContent;
      }
    });

//     const templateObj = ref({}) as any;
// const router = useRouter()
// onMounted(() => {
//   const parsedData = JSON.parse(localStorage.getItem("templateObj"));
//   templateObj.value = parsedData;
// });
    
    const deleteTemplate = () => {
      if (editor.value) {
        editor.value.innerHTML = leaseAgreementContent;
      }
    
      showToast({
              title: "Success",
              message: 'Lease Template was reset successfully',
              toastType: "success",
              duration: 3000
            });
    }
    
    const setAlignment = (alignment: string) => {
      if (editor.value) {
        alignmentPosition.value = alignment
        document.execCommand('justify' + alignment, false, '');
      }
    };
    
    const setList = (listType: string) => {
      if (editor.value) {
        listingPosition.value = listType
        document.execCommand(listType === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList', false, '');
      }
    };
    
    const setBold = () => {
      if (editor.value) {
        document.execCommand('bold', false, '');
      }
    };
    
    const setUnderline = () => {
      if (editor.value) {
        document.execCommand('underline', false, '');
      }
    };
    
    const setItalic = () => {
      if (editor.value) {
        document.execCommand('italic', false, '');
      }
    };
    
    const setHeading = (tag: string) => {
      if (editor.value) {
        paragraphPosition.value = tag
        document.execCommand('formatBlock', false, tag);
      }
    };
    
    const insertImage = () => {
      const url = prompt('Enter image URL');
      if (url && editor.value) {
        document.execCommand('insertImage', false, url);
      }
    };
    
    const insertLine = () => {
      if (editor.value) {
        document.execCommand('insertHorizontalRule', false, '');
      }
    };
    
    const insertTable = () => {
      const rows = prompt('Enter number of rows');
      const cols = prompt('Enter number of columns');
      if (rows && cols && editor.value) {
        let table = '<table border="1" style="width: 100%">';
        for (let i = 0; i < parseInt(rows); i++) {
          table += '<tr>';
          for (let j = 0; j < parseInt(cols); j++) {
            table += '<td>&nbsp;</td>';
          }
          table += '</tr>';
        }
        table += '</table>';
        editor.value.innerHTML += table;
      }
    };
    
    const previewDocument = () => {
      if (editor.value) {
        previewContent.value = editor.value.innerHTML;
        showPreview.value = true;
      }
    };
    
    const useTemplate = () => {
      if (editor.value) {
        const htmlContent = editor.value.innerHTML;
        // Send the htmlContent to the backend here...
        alert('Template content saved and sent to backend!');
      }
    };
    
    // Watch font style and size changes
    watch(selectedFont, (newFont) => {
      if (editor.value) {
        editor.value.style.fontFamily = newFont;
      }
    });
    
    watch(fontSize, (newSize) => {
      if (editor.value) {
        editor.value.style.fontSize = newSize + 'px';
      }
    });
    
    watch(fontColor, (newColor) => {
      if (editor.value) {
        document.execCommand('foreColor', false, newColor);
      }
    });
      
      const toggleDropdown = () => {
        dropdownVisible.value = !dropdownVisible.value;
      };
      
      const sendNow = () => {
        const payload = {
          body: previewContent.value || leaseAgreementContent,
          documentName: 'TEST'
        }
        setPayloadObj(payload)
        createLeaseTemplate()
      };
      
      const saveAndExit = () => {
        const payload = {
          body: previewContent.value || leaseAgreementContent,
          documentName: 'TEST'
        }
        setPayloadObj(payload)
        createLeaseTemplate()
      };
      
      const duplicateTemplate = () => {
        // Logic to handle duplicating the template
      };
    </script>
    
    <style scoped>
    /* Custom styles as needed */
    </style>
    