<template>
  <main>
    <div class="bg-gray-100">
      <!-- Header with back button and template title -->
      <div class="flex flex-wrap justify-between items-center bg-white p-4 shadow px-10">
        <div class="flex items-center space-x-2">
          <button @click="router.back()"
            class="text-gray-600 bg-gray-100 text-sm py-3 px-4 rounded-md hover:text-black">
            <span>&larr;</span> Back
          </button>
          <h1 class="text-lg font-semibold">{{ payload.documentName }}</h1>
        </div>
        <div class="relative">
          <!-- Preview and Use Template Buttons -->
          <div class="flex space-x-4">
            <button @click="previewDocument" class="bg-transparent text-green-600 hover:underline">
              Preview
            </button>
            <button type="button" :disabled="processingSaveAndExit" @click="proceedSaveAndExit"
              class="bg-gray-400  disabled:cursor-not-allowed disabled:opacity-25 text-sm text-white px-4 py-3 rounded-md">
              {{ processingSaveAndExit ? 'processing...' : 'Save & Exit' }}
            </button>
            <button type="button" :disabled="processingSaveAndSend" @click="proceedSaveAndSend"
              class="bg-black disabled:cursor-not-allowed disabled:opacity-25 text-sm text-white px-4 py-3 rounded-md">
              {{ processingSaveAndSend ? 'processing...' : 'Save & Send' }}
            </button>
          </div>

          <!-- Dropdown modal -->
          <div v-if="dropdownVisible"
            class="absolute right-0 z-50 mt-2 w-40 bg-white shadow-lg rounded-md overflow-hidden">
            <ul>
              <li class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" @click="sendNow">
                Send now
              </li>
              <li class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer" @click="saveAndExit">
                {{ loading ? 'processing..' : ' Save and exit' }}
              </li>
              <li class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                @click="duplicateTemplate">
                Duplicate
              </li>
              <li class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer" @click="deleteTemplate">
                Delete
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <LayoutWithoutSidebar class="h-0 bg-gray-300">
      <div class="lg:flex items-start min-h-screen bg-gray-25">
        <!-- Left Side: Text Editor -->
        <div class="flex-1 lg:w-6/12 lg:p-10 bg-gray-25">
          <div contenteditable="true"
            class="border border-gray-300 lg:px-10 bg-white p-4 outline-none border-none rounded-lg shadow-sm min-h-[500px]"
            ref="editor">
            Start editing your text here...
          </div>
          <div contenteditable="true"
            class="border border-gray-300 lg:px-10 bg-white pb-4 px-4 outline-none border-none rounded-lg shadow-sm min-h-[500px]"
            ref="signatureSection">
            <h2 class="text-sm font-medium mb-2">Signature</h2>
            <p class="text-gray-500 mb-6 text-sm">
              The parties hereto have executed this Lease Agreement as of the date first above written.
            </p>

            <div class="mb-4">
              <h3 class="text-sm font-medium mb-2">Landlord/Property Manager:</h3>
              <label class="block text-sm text-gray-500 mb-3">Signature</label>
              <div class="w-full border-b-2 border-dotted py-2 mb-4 bg-transparent outline-none">
                <img v-if="emittedAgreementData?.signatureObj?.url || leaseSignatureUrl || user.signatureUrl" :src="emittedAgreementData?.signatureObj?.url || leaseSignatureUrl || user.signatureUrl" alt="Signature"
                class="h-[50px] w-auto  object-fill mix-blend-multiply  placeholder-gray-400" />
              </div>
              <label class="block text-sm text-gray-500 mb-1">Full Name</label>
              <div class="border-b-2 border-dotted text-gray-800 py-2 mb-4">
                {{ user.firstName }} {{ user.lastName }}
              </div>
              <label class="block text-sm text-gray-500 mb-1">Date</label>
              <div class="border-b-2 border-dotted text-gray-800 py-2 mb-8">
                {{ new Date().toLocaleString() }}
              </div>
            </div>

            <div class="mb-4 space-y-6">
              <h3 class="text-base font-medium mb-2">Tenant:</h3>
              <input type="text" disabled :value="emittedAgreementData.fullName" placeholder="Full name"
                class="w-full border-b-2 border-dotted py-2 mb-4 bg-transparent outline-none placeholder-gray-400" />

              <input type="text" diabled :value="emittedAgreementData.date" placeholder="Signature"
                class="w-full border-b-2 border-dotted py-2 mb-4 bg-transparent outline-none placeholder-gray-400" />
              <!-- <img :src="emittedAgreementData.signature" alt="Signature" class="w-full border-b-2 border-dotted py-2 mb-4 bg-transparent outline-none placeholder-gray-400" /> -->
              <input type="text" diabled :value="emittedAgreementData.date" placeholder="Date"
                class="w-full border-b-2 border-dotted py-2 mb-4 bg-transparent outline-none placeholder-gray-400" />
            </div>
          </div>
        </div>

        <!-- Right Side: Settings Panel -->
        <div class="lg:w-1/3 p-6 bg-white rounded-lg lg:mt-10 lg:mr-10">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Settings</h3>
          <p class="text-gray-500 mb-6">Edit template according to your liking</p>

          <div class="space-y-6">
            <!-- Status -->
            <div class="flex justify-between items-center">
              <p class="text-[#1A47C5] text-sm mb-1">Status</p>
              <span class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-full">Draft</span>
            </div>

            <!-- Alignment -->
            <div>
              <p class="text-[#1A47C5] text-sm mb-1">Alignment</p>
              <div class="flex space-x-4">
                <button
                  :class="[alignmentPosition === 'justify' ? 'bg-[#5B8469] text-white' : 'bg-gray-25 text-gray-500']"
                  @click="setAlignment('justify')"
                  class="p-2 border-[0.5px] gap-y-2 border-gray-25 rounded-md  text-xs flex justify-center items-center flex-col">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3 9H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3 15H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3 21H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  Justify</button>
                <button
                  :class="[alignmentPosition === 'left' ? 'bg-[#5B8469] text-white' : 'bg-gray-25 text-gray-500']"
                  @click="setAlignment('left')"
                  class="p-2 border-[0.5px] gap-y-2 border-gray-25 rounded-md text-xs flex justify-center items-center flex-col">
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.16797 3H11.168" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M3.16797 9H11.168" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M3.16797 15H21.168" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M3.16797 21H21.168" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>

                  Left align</button>
                <button
                  :class="[alignmentPosition === 'center' ? 'bg-[#5B8469] text-white' : 'bg-gray-25 text-gray-500']"
                  @click="setAlignment('center')"
                  class="p-2 border-[0.5px] gap-y-2 border-gray-25 rounded-md text-xs flex justify-center items-center flex-col">
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 3H21.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M8.5 9H16.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M3.5 15H21.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M8.5 21H16.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>

                  Center</button>
                <button
                  :class="[alignmentPosition === 'right' ? 'bg-[#5B8469] text-white' : 'bg-gray-25 text-gray-500']"
                  @click="setAlignment('right')"
                  class="p-2 border-[0.5px] gap-y-2 border-gray-25 rounded-md text-xs flex justify-center items-center flex-col">
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.832 3H21.832" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M13.832 9H21.832" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M3.83203 15H21.832" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M3.83203 21H21.832" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>

                  Right align</button>
              </div>
            </div>

            <!-- Listing -->
            <div>
              <p class="text-[#1A47C5] text-sm mb-1">Listing</p>
              <div class="flex space-x-5">
                <button
                  :class="[listingPosition === 'ordered' ? 'bg-[#5B8469] text-white' : 'bg-gray-50 text-gray-500']"
                  @click="setList('ordered')"
                  class="p-2  border-gray-200 rounded-md gap-y-2 border-[0.5px] gap-y-2 border-gray-25 text-xs flex justify-center items-center flex-col">
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.5 5H20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" />
                    <path d="M4.5 5H4.50898" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M4.5 12H4.50898" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M4.5 19H4.50898" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M8.5 12H20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" />
                    <path d="M8.5 19H20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round" />
                  </svg>

                  Ordered List</button>
                <button
                  :class="[listingPosition === 'unordered' ? 'bg-[#5B8469] text-white' : 'bg-gray-50 text-gray-500']"
                  @click="setList('unordered')"
                  class="p-2  border-gray-200 rounded-md gap-y-2 border-[0.5px] gap-y-2 border-gray-25 text-xs flex justify-center items-center flex-col">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 6H21" stroke="white" stroke-width="2" stroke-linecap="round" />
                    <path d="M11 12H21" stroke="white" stroke-width="2" stroke-linecap="round" />
                    <path d="M11 18H21" stroke="white" stroke-width="2" stroke-linecap="round" />
                    <path
                      d="M3 15H4.5C4.77879 15 4.91819 15 5.03411 15.0231C5.51014 15.1177 5.88225 15.4899 5.97694 15.9659C6 16.0818 6 16.2212 6 16.5C6 16.7788 6 16.9182 5.97694 17.0341C5.88225 17.5101 5.51014 17.8823 5.03411 17.9769C4.91819 18 4.77879 18 4.5 18C4.22121 18 4.08181 18 3.96589 18.0231C3.48986 18.1177 3.11775 18.4899 3.02306 18.9659C3 19.0818 3 19.2212 3 19.5V20.4C3 20.6828 3 20.8243 3.08787 20.9121C3.17574 21 3.31716 21 3.6 21H6"
                      stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3 3H4.2C4.36569 3 4.5 3.13431 4.5 3.3V9M4.5 9H3M4.5 9H6" stroke="white" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>

                  Unordered List</button>
              </div>
            </div>

            <!-- Font Style & Size -->
            <div>
              <p class="text-[#1A47C5] text-sm mb-1">Font style & size</p>
              <div class="flex space-x-2 items-center pb-3">
                <select v-model="selectedFont" class="p-2 border-[0.5px] rounded-md outline-none border-gray-100">
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
                <input type="number" v-model="fontSize"
                  class="w-16 p-2 border-[0.5px] outline-none border-gray-100 rounded-md" min="8" max="48" />
              </div>
              <div class="flex space-x-2 mt-2">
                <button @click="setBold"
                  class="p-2 border rounded-md flex justify-center items-center hover:bg-gray-100 py-0 text-sm px-6">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                      d="M4.16797 5C4.16797 3.82149 4.16797 3.23223 4.53409 2.86612C4.9002 2.5 5.48946 2.5 6.66797 2.5H10.4837C12.5185 2.5 14.168 4.17893 14.168 6.25C14.168 8.32107 12.5185 10 10.4837 10H4.16797V5Z"
                      stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                      d="M10.3585 10H11.3902C13.3846 10 15.0013 11.6789 15.0013 13.75C15.0013 15.8211 13.3846 17.5 11.3902 17.5H6.66797C5.48946 17.5 4.9002 17.5 4.53409 17.1339C4.16797 16.7677 4.16797 16.1785 4.16797 15V10"
                      stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Bold
                </button>
                <button @click="setUnderline" class="p-2 border rounded-md hover:bg-gray-100 text-sm">U
                  underline</button>
                <button @click="setItalic" class="p-2 border rounded-md hover:bg-gray-100"><svg width="20" height="20"
                    viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3.33301H15.8333" stroke="#1D2739" stroke-width="2" stroke-linecap="round" />
                    <path d="M6.66797 16.6663L13.3346 3.33301" stroke="#1D2739" stroke-width="2"
                      stroke-linecap="round" />
                    <path d="M4.16797 16.667H10.0013" stroke="#1D2739" stroke-width="2" stroke-linecap="round" />
                  </svg>
                  Italic
                </button>
                <input type="color" v-model="fontColor" class="p-2 border rounded-md">
              </div>
            </div>

            <!-- Paragraph Format -->
            <div>
              <p class="text-[#1A47C5] text-sm mb-1">Paragraph format</p>
              <div class="flex flex-wrap gap-2">
                <button :class="[paragraphPosition === 'p' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']"
                  @click="setHeading('p')"
                  class="p-2 border-[0.5px] border-gray-100 rounded-md bg-[#F9FAFB] flex justify-center flex-col items-center text-sm">
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 4.5V20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M18 4.5V20.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M6 12.5H18" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  None
                </button>
                <button :class="[paragraphPosition === 'h1' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']"
                  @click="setHeading('h1')"
                  class="p-2 border-[0.5px] border-gray-100 rounded-md bg-[#F9FAFB] flex justify-center flex-col items-center text-sm">
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M14 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M17 19.5H18.5M18.5 19.5H20M18.5 19.5V11.5L17 12.5" stroke="#1D2739" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4 12.5H14" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  Heading 1
                </button>
                <button :class="[paragraphPosition === 'h2' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']"
                  @click="setHeading('h2')"
                  class="p-2 border-[0.5px] border-gray-100 rounded-md bg-[#F9FAFB] flex justify-center flex-col items-center text-sm">
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M13.5 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path
                      d="M20.5 19.5H16.5V19.1907C16.5 18.7521 16.5 18.5327 16.5865 18.3385C16.673 18.1443 16.836 17.9976 17.1621 17.7041L19.7671 15.3596C20.2336 14.9397 20.5 14.3416 20.5 13.714V13.5C20.5 12.3954 19.6046 11.5 18.5 11.5C17.3954 11.5 16.5 12.3954 16.5 13.5V13.9"
                      stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3.5 12.5H13.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  Heading 2
                </button>
                <button :class="[paragraphPosition === 'h3' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']"
                  @click="setHeading('h3')"
                  class="p-2 border-[0.5px] border-gray-100 rounded-md bg-[#F9FAFB] flex justify-center flex-col items-center text-sm">
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M14 5V19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                      d="M17 17C17 18.1046 17.8954 19 19 19C20.1046 19 21 18.1046 21 17C21 15.8954 20.1046 15 19 15C20.1046 15 21 14.1046 21 13C21 11.8954 20.1046 11 19 11C17.8954 11 17 11.8954 17 13"
                      stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M4 12H14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Heading 3
                </button>
                <button :class="[paragraphPosition === 'h4' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']"
                  @click="setHeading('h4')"
                  class="p-2 border-[0.5px] border-gray-100 rounded-md bg-[#F9FAFB] flex justify-center flex-col items-center text-sm">
                  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M13.5 5.5V19.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M16.5 11.5V15.5H20.5M20.5 15.5V19.5M20.5 15.5V11.5" stroke="#1D2739" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3.5 12.5H13.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  Heading 4
                </button>
                <button :class="[paragraphPosition === 'h5' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']"
                  @click="setHeading('h5')"
                  class="p-2 border-[0.5px] border-gray-100 rounded-md bg-[#F9FAFB] flex justify-center flex-col items-center text-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 5V19" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M13.5 5V19" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path
                      d="M16.5 16.5V17C16.5 18.1046 17.3954 19 18.5 19C19.6046 19 20.5 18.1046 20.5 17V16.5C20.5 15.1193 19.3807 14 18 14H16.5V11H20.5"
                      stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3.5 12H13.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  Heading 5
                </button>
                <button :class="[paragraphPosition === 'h6' ? 'bg-[#5B8469] text-white' : 'bg-gray-100 text-gray-500']"
                  @click="setHeading('h6')"
                  class="p-2 border-[0.5px] border-gray-100 rounded-md bg-[#F9FAFB] flex justify-center flex-col items-center text-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.5 5V19" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path d="M13.5 5V19" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                    <path
                      d="M16.5 17C16.5 18.1046 17.3954 19 18.5 19C19.6046 19 20.5 18.1046 20.5 17C20.5 15.8954 19.6046 15 18.5 15C17.3954 15 16.5 15.8954 16.5 17ZM16.5 17V13C16.5 11.8954 17.3954 11 18.5 11C19.6046 11 20.5 11.8954 20.5 13"
                      stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M3.5 12H13.5" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  Heading 6
                </button>
              </div>
            </div>

            <!-- Insert Options -->
            <div>
              <p class="text-[#1A47C5] text-sm mb-1">Insert</p>
              <div class="flex space-x-2">
                <button @click="isModalOpen = true"
                  class="p-2 border-[0.5px] border-gray-100 text-sm rounded-md px-5 bg-[#F9FAFB] flex justify-center items-center flex-col gap-y-2 hover:bg-gray-100">
                  <svg class="flex justify-center items-center" width="24" height="25" viewBox="0 0 24 25" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 13.1344C18 16.6465 17.4279 11.121 15.3496 11.5165C13 11.9637 11.5 16.9445 13 16.9445C14.5 16.9445 12.5 11 10.5 13.0556C8.5 15.1111 7.85936 17.7946 6.23526 15.8025C-1.5 6.31446 4.99998 -0.649937 8.16322 3.95685C10.1653 6.87256 6.5 17.4769 2 22.5"
                      stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9 21.5H19" stroke="#141B34" stroke-width="1.5" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  Signature

                </button>
                <button @click="insertImage"
                  class="p-2 border-[0.5px] border-gray-100 text-sm rounded-md px-5 bg-[#F9FAFB] flex justify-center flex-col items-center gap-y-2 hover:bg-gray-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11.5095 2.99023C7.02664 2.99023 4.78525 2.99023 3.39262 4.38232C2 5.77441 2 8.01494 2 12.496C2 16.977 2 19.2176 3.39262 20.6097C4.78525 22.0018 7.02664 22.0018 11.5095 22.0018C15.9922 22.0018 18.2336 22.0018 19.6263 20.6097C21.0189 19.2176 21.0189 16.977 21.0189 12.496V11.9957"
                      stroke="#1D2739" stroke-width="2" stroke-linecap="round" />
                    <path d="M5 20.9902C9.20998 16.2389 13.9412 9.9377 21 14.6636" stroke="#1D2739" stroke-width="2" />
                    <path d="M17.9939 1.99805V10.0062M21.9995 5.97704L13.9883 5.99193" stroke="#1D2739" stroke-width="2"
                      stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  Image
                </button>
                <button @click="insertLine"
                  class="p-2 border-[0.5px] border-gray-100 text-sm rounded-md px-5 bg-[#F9FAFB] flex justify-center flex-col items-center gap-y-2 hover:bg-gray-100">
                  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 12H22.0002" stroke="#1D2739" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  Solid line
                </button>
                <button @click="insertTable"
                  class="p-2 border-[0.5px] border-gray-100 text-sm rounded-md px-5 bg-[#F9FAFB] flex justify-center flex-col items-center gap-y-2 hover:bg-gray-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M20.1087 20.1088C18.7175 21.5 16.4784 21.5 12 21.5C7.52165 21.5 5.28248 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4784 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89125C5.28248 2.5 7.52165 2.5 12 2.5C16.4784 2.5 18.7175 2.5 20.1087 3.89125C21.4999 5.28249 21.4999 7.52166 21.4999 12C21.4999 16.4784 21.4999 18.7175 20.1087 20.1088Z"
                      stroke="#1D2739" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M9 21.5V2.5" stroke="#1D2739" stroke-width="2" />
                    <path d="M21.4999 8H2.5" stroke="#1D2739" stroke-width="2" />
                    <path d="M21.4999 16H2.5" stroke="#1D2739" stroke-width="2" />
                  </svg>
                  Table
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
          <div v-html="previewContent" class="p-4 rounded-lg shadow-sm h-[500px] overflow-y-auto min-h-[300px]"></div>
          <button @click="showPreview = false" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">Close</button>
        </div>
      </div>
    </LayoutWithoutSidebar>

    <CoreModal title="Sign Lease Agreement" :isOpen="isModalOpen" @close="isModalOpen = false">
      <SignatureComponent @agreementData="handleAgreement" @close="closeModal" class="w-full" />
    </CoreModal>
  </main>
</template>
<script setup lang="ts">
import { useSaveAndSend } from '@/composables/modules/lease/saveAndSend';
import { useSaveAndExit } from '@/composables/modules/lease/saveAndExit';
import LayoutWithoutSidebar from '@/layouts/dashboardWithoutSidebar.vue';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useCreateLeaseTemplate } from '@/composables/modules/lease/create';
import { useUser } from "@/composables/auth/user";

const { createLeaseTemplate, loading, payload, setPayloadObj } = useCreateLeaseTemplate();
const { showToast } = useCustomToast();
const { user } = useUser();
const router = useRouter();

const leaseSignatureUrl = localStorage.getItem('lease-signature-url')

const { setSaveAndSendPayloadObj, handleSaveAndSend, processingSaveAndSend } = useSaveAndSend();
const { handleSaveAndExit, setSaveAndExitPayloadObj, processingSaveAndExit } = useSaveAndExit();

const editor = ref<HTMLElement | null>();
const signatureSection = ref<HTMLElement | null>(null);
const selectedFont = ref('Arial');
const fontSize = ref(14);
const fontColor = ref('#000000'); // Fixed incorrect hex value
const showPreview = ref(false);
const previewContent = ref('');
const alignmentPosition = ref('justify');
const listingPosition = ref('');
const paragraphPosition = ref('p');
const localData = ref({});

const isModalOpen = ref(false);
const signedSignature = ref<string | null>(null);
const emittedAgreementData = ref({}) as any;

const openModal = () => {
  isModalOpen.value = true;
};

const payloadObj = JSON.parse(localStorage.getItem('lease-template-payload') || '{}')

definePageMeta({
  middleware: 'auth'
});


const closeModal = () => {
  isModalOpen.value = false;
};

const handleAgreement = (data: any) => {
  showToast({
    title: "Success",
    message: 'Signature was saved successfully.',
    toastType: "success",
    duration: 3000,
  });
  emittedAgreementData.value = data;
};

onMounted(() => {
  const localStorageObj = JSON.parse(localStorage.getItem('lease-template-payload') || '{}');
  localData.value = localStorageObj;

  if (Object.keys(localStorageObj).length) {
    // editor.value.innerHTML = localStorageObj.body; 
    editor.value.innerHTML = payload.value.body
  }

  editor.value.addEventListener('input', () => {
    updateLeaseInLocalStorage();
  });
});

// Function to update the lease content in localStorage
const updateLeaseInLocalStorage = () => {
  const leaseContent = editor.value?.innerHTML;
  payload.value.body = leaseContent
};


const setAlignment = (alignment: string) => {
  if (editor.value) {
    alignmentPosition.value = alignment;
    if (alignment === 'justify') {
      document.execCommand('justifyFull', false, '');
    } else {
      document.execCommand('justify' + alignment, false, '');
    }
  }
};


const setList = (listType: string) => {
  if (editor.value) {
    listingPosition.value = listType
    document.execCommand(listType === 'ordered' ? 'insertOrderedList' : 'insertUnorderedList', false, '');
    console.log(editor.value)
  }
};

// Text formatting functions
const setBold = () => {
  applyStyle('fontWeight', 'bold');
};

const setItalic = () => {
  applyStyle('fontStyle', 'italic');
};

const setUnderline = () => {
  applyStyle('textDecoration', 'underline');
};

const wrapSelectedTextWithSpan = (style: string) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style.cssText = style;
  range.surroundContents(span);
};

// Function to apply styles dynamically
const applyStyle = (styleName: string, styleValue: string) => {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const span = document.createElement('span');
  span.style[styleName] = styleValue;
  range.surroundContents(span);
};

const setHeading = (tag: string) => {
  if (editor.value) {
    paragraphPosition.value = tag;
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

// Handle font and color changes
watch(selectedFont, (newFont) => {
  applyStyle('fontFamily', newFont);
});

watch(fontSize, (newSize) => {
  applyStyle('fontSize', `${newSize}px`);
});

watch(fontColor, (newColor) => {
  applyStyle('color', newColor);
});

// Save and exit or send functionalities
const proceedSaveAndExit = async () => {
  // const signatureUrl = emittedAgreementData?.value?.signatureObj?.secure_url || leaseSignatureUrl.value;
  const leaseSignature = localStorage.getItem('lease-signature-url')
  if (!leaseSignature) {
    showToast({
      title: "Error",
      message: 'You need to sign before you can send the lease agreement.',
      toastType: "error",
      duration: 3000,
    });
    return;
  }
  const reqPayload = {
    leaseAgreement: editor.value?.innerHTML,
    isPublished: false,
    houseOwnerSigneeName: `${user?.value?.firstName} ${user?.value?.lastName}` || "",
    houseOwnerSignatureUrl: leaseSignature,
    startDate: payloadObj?.startDate,
    endDate: payloadObj?.endDate,
    agreementName: payloadObj?.documentName
  };
  setSaveAndExitPayloadObj(reqPayload);
  await handleSaveAndExit(payload.value.tenantId, payload.value.propertyId);
};

const proceedSaveAndSend = async () => {
  // const signatureUrl = leaseSignatureUrl.value || emittedAgreementData?.value?.signatureObj?.secure_url

  // const signatureUrl = leaseSignatureUrl.value
  const leaseSignature = localStorage.getItem('lease-signature-url')
  if (!leaseSignature) {
    showToast({
      title: "Error",
      message: 'You need to sign before you can send the lease agreement.',
      toastType: "error",
      duration: 3000,
    });
    return;
  }

  const reqPayload = {
    leaseAgreement: editor.value?.innerHTML,
    isPublished: true,
    houseOwnerSigneeName: `${user?.value?.firstName} ${user?.value?.lastName}` || "",
    houseOwnerSignatureUrl: leaseSignature,
    startDate: payloadObj?.startDate,
    endDate: payloadObj?.endDate,
    agreementName: payloadObj?.documentName
  };

  setSaveAndSendPayloadObj(reqPayload);
  await handleSaveAndSend(payload.value.tenantId, payload.value.propertyId);
};

// Preview functionality
const previewDocument = () => {
  if (editor.value) {
    previewContent.value = editor.value.innerHTML + signatureSection.value.innerHTML;
    showPreview.value = true;
  }
};

</script>
