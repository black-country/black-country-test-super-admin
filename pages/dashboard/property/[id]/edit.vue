<template>
  <main class="flex flex-col h-screen">
   <main>
    <LayoutWithoutSidebar>
      <template #header-content>
        <header
          class="bg-white px-4  py-4 flex items-center justify-between container mx-auto"
        >
          <div
            @click="router.push('/dashboard')"
            class="flex items-center space-x-2"
          >
            <img src="@/assets/icons/logo.svg" alt="Logo" class="h-8 w-auto" />
            <span class="text-lg font-semibold">BlackCountry</span>
          </div>
          <div class="flex space-x-4 items-center">
            <button @click="router.push(`/dashboard/property/preview`)" class="text-[#326543] py-3 font-semibold text-sm hover:text-[#326543]">
              Preview
            </button>
            <button
              @click="openCancelModal = true"
              type="button"
              class="bg-white border text-sm border-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              @click="handleSaveAndExit"
              :disabled="saving"
              class="text-gray-900 bg-[#F9FAFB] disabled:cursor-not-allowed border-gray-100 border disabled:opacity-25 text-sm font-semibold px-4 py-3 rounded-md hover:bg-gray-800"
            >
              {{ saving ? "saving..." : "Save & exit" }}
            </button>
          </div>
        </header>
      </template>
        <main v-if="!fetchingProperty">
          <section v-if="!isPreviewMode && !fetchingProperty">
            <div
              class="lg:flex space-y-10 lg:space-y-0 lg:max-w-6xl w-full mx-auto py-10"
            >
              <aside
                id="first-part"
                class="space-y-3 lg:max-w-xs w-full px-5 lg:px-0 relative"
              >
                <div
                  v-for="step in steps"
                  :key="step.id"
                  class="flex items-center px-4 py-2 rounded-lg font-normal gap-x-1"
                  :class="{
                    'bg-[#5B8469] text-white': activeParentStep === step.id,
                    '': activeParentStep !== step.id,
                  }"
                  @click="handleStepClick(step.id)"
                >
                  <div
                    class="w-10 h-10 flex items-center justify-center rounded-full mr-3 relative"
                    :class="{
                      'text-black': activeParentStep === step.id,
                      'text-white': activeParentStep !== step.id,
                    }"
                  >
                    <div v-if="step.completed">
                      <svg
                        class="absolute -right-[270px] top-2"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.166 2.7816C12.9403 2.07256 11.5172 1.66675 9.99935 1.66675C5.39697 1.66675 1.66602 5.39771 1.66602 10.0001C1.66602 14.6024 5.39697 18.3334 9.99935 18.3334C14.6017 18.3334 18.3327 14.6024 18.3327 10.0001C18.3327 9.42933 18.2753 8.87192 18.166 8.33342"
                          stroke="#5B8469"
                          stroke-width="2"
                          stroke-linecap="round"
                        />
                        <path
                          d="M6.66602 10.4167C6.66602 10.4167 7.91602 10.4167 9.58268 13.3334C9.58268 13.3334 14.215 5.69452 18.3327 4.16675"
                          stroke="#5B8469"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <span v-if="!step.completed" class="font-semibold absolute">{{
                      step.id
                    }}</span>

                    <svg
                      v-if="activeParentStep !== step.id"
                      width="40"
                      height="40"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <g clip-path="url(#clip0_5289_73233)">
                          <rect width="30" height="30" rx="15" fill="#292929" />
                          <path
                            d="M0.288893 22.1673C0.288893 21.2744 2.18618 20.8582 3.46852 20.8582C3.83222 20.8582 4.44286 20.9314 4.44286 21.4207C4.44286 22.378 2.46915 22.9004 1.45511 22.9004C0.917007 22.9004 0.288893 22.7083 0.288893 22.1673ZM5.08715 21.4207C5.08715 20.8373 4.66193 20.2139 3.46852 20.2139C2.14582 20.2139 -0.355615 20.6223 -0.355615 22.1673C-0.355615 22.9912 0.372212 23.5447 1.45511 23.5447C2.72148 23.5447 5.08715 22.9217 5.08715 21.4207ZM-3.83203 27.9421C-2.18319 28.5337 0.317385 29.1474 3.59738 29.1474C8.76429 29.1474 15.6336 28.5398 15.6336 23.2865C15.6336 21.2778 14.3731 20.3901 13.3601 19.6767C12.4693 19.0492 11.9204 18.6216 11.8641 17.7704C11.8269 17.2092 12.0911 16.7002 12.3974 16.1111C12.7408 15.4504 13.13 14.7017 13.13 13.7548C13.13 12.4696 12.1768 11.0863 10.0842 11.0863C8.42154 11.0863 6.88774 11.7364 5.26415 12.4249C3.17606 13.3103 0.808875 14.314 -2.53609 14.314C-2.99821 14.314 -3.42883 14.2825 -3.83203 14.2264V10.6863C-3.066 10.7815 -2.29483 10.8293 -1.52291 10.8294C2.47908 10.8294 5.28465 9.47993 7.75997 8.28933C9.86835 7.27507 11.8597 6.31736 14.2938 6.31736C17.6584 6.31736 19.4187 8.22349 19.4187 10.1063C19.4187 11.3712 18.7625 12.1415 18.0679 12.9568C17.3522 13.7968 16.612 14.6656 16.612 16.0747C16.612 17.4269 17.1432 18.1537 17.6569 18.8565C18.2565 19.6767 18.8767 20.5252 18.8767 22.5403C18.8767 26.3858 15.2362 28.7662 11.6886 30.1729H-3.83203V27.9421ZM-3.83203 24.7752C-2.24314 25.3475 -0.567193 25.6406 1.12163 25.6414C4.04462 25.6414 8.9482 24.9964 8.9482 20.6776C8.9482 19.4071 7.9279 17.6175 5.65936 17.6175C4.13225 17.6175 2.92891 18.019 1.76528 18.4073C0.581585 18.8021 -0.536279 19.1751 -2.00252 19.1751C-2.64293 19.1751 -3.25659 19.0648 -3.83203 18.8893V15.6561C-3.4019 15.7066 -2.96917 15.7318 -2.53609 15.7315C1.09725 15.7315 3.71437 14.6218 5.81736 13.7302C7.36929 13.072 8.70948 12.5037 10.0842 12.5037C11.2845 12.5037 11.7123 13.15 11.7123 13.7548C11.7123 14.3552 11.4341 14.8905 11.1395 15.4576C10.7863 16.137 10.3862 16.9072 10.4494 17.8642C10.5537 19.4339 11.6109 20.1785 12.5435 20.8356C13.4779 21.4937 14.2159 22.0132 14.2159 23.2865C14.2159 25.1939 13.1151 27.7297 3.59738 27.7297C0.174495 27.7297 -2.3468 27.0077 -3.83203 26.4199V24.7752ZM-3.83203 19.5662C-3.25292 19.725 -2.64078 19.8196 -2.00252 19.8196C-0.431594 19.8196 0.789015 19.4123 1.96926 19.0186C3.13547 18.6294 4.23672 18.262 5.65936 18.262C7.65745 18.262 8.30391 19.8895 8.30391 20.6776C8.30391 23.5034 5.82038 24.9971 1.12163 24.9971C-0.891562 24.9971 -2.59761 24.5486 -3.83203 24.08V19.5662ZM-3.83203 7.2578C-3.25102 7.387 -2.65773 7.453 -2.06253 7.45465C1.70247 7.45465 4.59675 5.87768 7.6609 4.20833C10.7509 2.52473 13.9463 0.783936 18.1603 0.783936C20.1113 0.783936 21.7738 1.34815 22.9674 2.41573C24.1265 3.45222 24.7393 4.86471 24.7393 6.50039C24.7393 8.21658 23.6855 9.76096 22.57 11.3958C21.3578 13.1728 20.104 15.0101 20.104 17.2392C20.104 21.9614 23.9307 24.7251 30.629 24.8753V26.573C30.6003 26.5753 30.5719 26.5816 30.5449 26.5918C25.6866 28.4668 22.5467 25.1208 22.406 24.9641C22.3756 24.9217 22.3355 24.8873 22.2889 24.8639C22.2424 24.8405 22.1909 24.8287 22.1388 24.8295C22.0867 24.8304 22.0355 24.8438 21.9898 24.8688C21.944 24.8937 21.905 24.9294 21.8761 24.9727C21.8391 25.0291 21.8212 25.0958 21.8249 25.1631H21.8225C21.8225 25.1719 21.799 26.0862 20.9976 27.4336C20.5588 28.1715 19.8197 29.1374 18.5911 30.1729H13.3385C14.0817 29.8215 14.8786 29.3902 15.6396 28.8713C18.2151 27.1147 19.521 24.9848 19.521 22.5403C19.521 20.3147 18.807 19.338 18.1771 18.4762C17.683 17.8004 17.2563 17.2165 17.2563 16.0747C17.2563 14.9028 17.8888 14.1605 18.5583 13.3747C19.298 12.5065 20.063 11.6086 20.063 10.1063C20.063 7.90318 18.0813 5.67284 14.2938 5.67284C11.7128 5.67284 9.65704 6.66163 7.48067 7.70848C4.94944 8.92607 2.33209 10.1849 -1.52291 10.1849C-2.39752 10.1849 -3.18385 10.1191 -3.83203 10.0349V7.2578ZM-3.83203 1.24239C-3.09168 1.75114 -1.9941 2.18477 -0.397707 2.18477C3.19397 2.18477 5.87672 0.581903 8.71704 -1.11529C11.6035 -2.8399 14.5882 -4.62322 18.6755 -4.62322C22.3753 -4.62322 25.5729 -3.32059 28.179 -0.75181C29.4033 0.454983 30.2015 1.673 30.629 2.41918V6.28843C30.6218 6.31119 30.6159 6.33432 30.6111 6.35772C30.459 7.09678 29.2861 8.05125 28.0443 9.06162C25.6819 10.9839 22.7416 13.3762 22.7552 17.1109C22.7608 18.6819 23.4254 20.0998 24.5785 21.0011C25.654 21.8416 26.9806 22.1229 28.2739 22.1229C29.0972 22.1227 29.9062 22.0083 30.629 21.8524V24.2313C24.3402 24.0854 20.7485 21.5556 20.7485 17.2392C20.7485 15.2091 21.9451 13.4552 23.1023 11.759C24.2238 10.1152 25.3836 8.41538 25.3836 6.50039C25.3836 2.75525 22.4131 0.139418 18.1603 0.139418C13.7821 0.139418 10.5137 1.92015 7.35266 3.6426C4.36255 5.27159 1.53821 6.81013 -2.06253 6.81013C-2.69086 6.81013 -3.28551 6.72595 -3.83203 6.59601V1.24239ZM30.629 11.3217C30.2133 11.6647 29.8131 11.9742 29.4261 12.2734C27.7527 13.5663 26.4311 14.5877 26.4311 16.4846C26.4311 17.3559 26.7635 18.0307 27.3918 18.4356C27.8973 18.7613 28.5356 18.8835 29.1805 18.8835C29.6791 18.8835 30.181 18.8101 30.629 18.7015V20.3983C28.3704 20.9433 26.5802 20.7665 25.4516 19.8841C24.643 19.2521 24.1768 18.2394 24.1729 17.1058C24.1617 14.0483 26.6996 11.9831 28.939 10.1611C29.5567 9.65843 30.1384 9.184 30.629 8.71389V11.3217ZM30.629 18.0352C29.6975 18.2845 28.4756 18.367 27.7408 17.894C27.2932 17.6054 27.0756 17.1444 27.0756 16.4846C27.0756 14.9041 28.2267 14.0144 29.8201 12.7832C30.0914 12.5745 30.361 12.3636 30.629 12.1506V18.0352ZM30.629 30.1729H19.571C21.5216 28.3559 22.1593 26.709 22.3656 25.813C22.7876 26.1784 23.491 26.7003 24.4554 27.1236C25.8174 27.7213 27.9852 28.2192 30.629 27.2477V30.1729Z"
                            fill="white"
                            fill-opacity="0.3"
                          />
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_5289_73233">
                          <rect width="30" height="30" rx="15" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <svg
                      v-if="activeParentStep === step.id"
                      width="40"
                      height="40"
                      viewBox="0 0 30 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.8">
                        <g clip-path="url(#clip0_5289_73226)">
                          <rect width="30" height="30" rx="15" fill="#BDBDBD" />
                          <path
                            d="M0.288893 22.1673C0.288893 21.2744 2.18618 20.8582 3.46852 20.8582C3.83222 20.8582 4.44286 20.9314 4.44286 21.4207C4.44286 22.378 2.46915 22.9004 1.45511 22.9004C0.917007 22.9004 0.288893 22.7083 0.288893 22.1673ZM5.08715 21.4207C5.08715 20.8373 4.66193 20.2139 3.46852 20.2139C2.14582 20.2139 -0.355615 20.6223 -0.355615 22.1673C-0.355615 22.9912 0.372212 23.5447 1.45511 23.5447C2.72148 23.5447 5.08715 22.9217 5.08715 21.4207ZM-3.83203 27.9421C-2.18319 28.5337 0.317385 29.1474 3.59738 29.1474C8.76429 29.1474 15.6336 28.5398 15.6336 23.2865C15.6336 21.2778 14.3731 20.3901 13.3601 19.6767C12.4693 19.0492 11.9204 18.6216 11.8641 17.7704C11.8269 17.2092 12.0911 16.7002 12.3974 16.1111C12.7408 15.4504 13.13 14.7017 13.13 13.7548C13.13 12.4696 12.1768 11.0863 10.0842 11.0863C8.42154 11.0863 6.88774 11.7364 5.26415 12.4249C3.17606 13.3103 0.808875 14.314 -2.53609 14.314C-2.99821 14.314 -3.42883 14.2825 -3.83203 14.2264V10.6863C-3.066 10.7815 -2.29483 10.8293 -1.52291 10.8294C2.47908 10.8294 5.28465 9.47993 7.75997 8.28933C9.86835 7.27507 11.8597 6.31736 14.2938 6.31736C17.6584 6.31736 19.4187 8.2235 19.4187 10.1063C19.4187 11.3712 18.7625 12.1415 18.0679 12.9568C17.3522 13.7969 16.612 14.6656 16.612 16.0747C16.612 17.4269 17.1432 18.1537 17.6569 18.8565C18.2565 19.6767 18.8767 20.5252 18.8767 22.5403C18.8767 26.3858 15.2362 28.7662 11.6886 30.1729H-3.83203V27.9421ZM-3.83203 24.7752C-2.24314 25.3475 -0.567193 25.6406 1.12163 25.6414C4.04462 25.6414 8.9482 24.9964 8.9482 20.6776C8.9482 19.4071 7.9279 17.6175 5.65936 17.6175C4.13225 17.6175 2.92891 18.019 1.76528 18.4073C0.581585 18.8021 -0.536279 19.1751 -2.00252 19.1751C-2.64293 19.1751 -3.25659 19.0648 -3.83203 18.8893V15.6561C-3.4019 15.7066 -2.96917 15.7318 -2.53609 15.7315C1.09725 15.7315 3.71437 14.6218 5.81736 13.7302C7.36929 13.072 8.70948 12.5037 10.0842 12.5037C11.2845 12.5037 11.7123 13.15 11.7123 13.7548C11.7123 14.3552 11.4341 14.8905 11.1395 15.4576C10.7863 16.137 10.3862 16.9072 10.4494 17.8642C10.5537 19.4339 11.6109 20.1785 12.5435 20.8356C13.4779 21.4937 14.2159 22.0132 14.2159 23.2865C14.2159 25.1939 13.1151 27.7297 3.59738 27.7297C0.174495 27.7297 -2.3468 27.0077 -3.83203 26.4199V24.7752ZM-3.83203 19.5662C-3.25292 19.725 -2.64078 19.8196 -2.00252 19.8196C-0.431594 19.8196 0.789015 19.4123 1.96926 19.0186C3.13547 18.6294 4.23672 18.262 5.65936 18.262C7.65745 18.262 8.30391 19.8895 8.30391 20.6776C8.30391 23.5034 5.82038 24.9971 1.12163 24.9971C-0.891562 24.9971 -2.59761 24.5486 -3.83203 24.08V19.5662ZM-3.83203 7.2578C-3.25102 7.387 -2.65773 7.453 -2.06253 7.45465C1.70247 7.45465 4.59675 5.87768 7.6609 4.20833C10.7509 2.52473 13.9463 0.783939 18.1603 0.783939C20.1113 0.783939 21.7738 1.34816 22.9674 2.41573C24.1265 3.45222 24.7393 4.86472 24.7393 6.5004C24.7393 8.21659 23.6855 9.76097 22.57 11.3958C21.3578 13.1728 20.104 15.0101 20.104 17.2392C20.104 21.9614 23.9307 24.7251 30.629 24.8753V26.573C30.6003 26.5753 30.5719 26.5817 30.5449 26.5918C25.6866 28.4668 22.5467 25.1208 22.406 24.9641C22.3756 24.9217 22.3355 24.8873 22.2889 24.8639C22.2424 24.8405 22.1909 24.8287 22.1388 24.8295C22.0867 24.8304 22.0355 24.8439 21.9898 24.8688C21.944 24.8937 21.905 24.9294 21.8761 24.9727C21.8391 25.0291 21.8212 25.0958 21.8249 25.1631H21.8225C21.8225 25.1719 21.799 26.0862 20.9976 27.4336C20.5588 28.1715 19.8197 29.1374 18.5911 30.1729H13.3385C14.0817 29.8215 14.8786 29.3902 15.6396 28.8713C18.2151 27.1147 19.521 24.9848 19.521 22.5403C19.521 20.3147 18.807 19.338 18.1771 18.4762C17.683 17.8004 17.2563 17.2165 17.2563 16.0747C17.2563 14.9028 17.8888 14.1605 18.5583 13.3747C19.298 12.5065 20.063 11.6086 20.063 10.1063C20.063 7.90318 18.0813 5.67284 14.2938 5.67284C11.7128 5.67284 9.65704 6.66163 7.48067 7.70849C4.94944 8.92607 2.33209 10.1849 -1.52291 10.1849C-2.39752 10.1849 -3.18385 10.1191 -3.83203 10.0349V7.2578ZM-3.83203 1.24239C-3.09168 1.75114 -1.9941 2.18478 -0.397707 2.18478C3.19397 2.18478 5.87672 0.581907 8.71704 -1.11529C11.6035 -2.83989 14.5882 -4.62321 18.6755 -4.62321C22.3753 -4.62321 25.5729 -3.32059 28.179 -0.751806C29.4033 0.454988 30.2015 1.67301 30.629 2.41919V6.28843C30.6218 6.31119 30.6159 6.33432 30.6111 6.35772C30.459 7.09678 29.2861 8.05125 28.0443 9.06162C25.6819 10.9839 22.7416 13.3762 22.7552 17.1109C22.7608 18.6819 23.4254 20.0998 24.5785 21.0011C25.654 21.8416 26.9806 22.1229 28.2739 22.1229C29.0972 22.1227 29.9062 22.0083 30.629 21.8524V24.2313C24.3402 24.0854 20.7485 21.5556 20.7485 17.2392C20.7485 15.2091 21.9451 13.4552 23.1023 11.759C24.2238 10.1152 25.3836 8.41538 25.3836 6.5004C25.3836 2.75526 22.4131 0.139423 18.1603 0.139423C13.7821 0.139423 10.5137 1.92015 7.35266 3.6426C4.36255 5.27159 1.53821 6.81014 -2.06253 6.81014C-2.69086 6.81014 -3.28551 6.72596 -3.83203 6.59602V1.24239ZM30.629 11.3217C30.2133 11.6647 29.8131 11.9742 29.4261 12.2734C27.7527 13.5663 26.4311 14.5877 26.4311 16.4846C26.4311 17.3559 26.7635 18.0307 27.3918 18.4356C27.8973 18.7613 28.5356 18.8835 29.1805 18.8835C29.6791 18.8835 30.181 18.8101 30.629 18.7015V20.3983C28.3704 20.9433 26.5802 20.7665 25.4516 19.8841C24.643 19.2521 24.1768 18.2394 24.1729 17.1058C24.1617 14.0483 26.6996 11.9831 28.939 10.1611C29.5567 9.65844 30.1384 9.18401 30.629 8.71389V11.3217ZM30.629 18.0352C29.6975 18.2845 28.4756 18.367 27.7408 17.894C27.2932 17.6054 27.0756 17.1444 27.0756 16.4846C27.0756 14.9041 28.2267 14.0144 29.8201 12.7832C30.0914 12.5745 30.361 12.3636 30.629 12.1506V18.0352ZM30.629 30.1729H19.571C21.5216 28.3559 22.1593 26.709 22.3656 25.813C22.7876 26.1784 23.491 26.7003 24.4554 27.1236C25.8174 27.7213 27.9852 28.2192 30.629 27.2477V30.1729Z"
                            fill="white"
                          />
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_5289_73226">
                          <rect width="30" height="30" rx="15" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>

                    <span
                      class="font-semibold absolute flex justify-center items-center"
                      >{{ step.id }}</span
                    >
                  </div>
                  <h3
                    class="text-"
                    :class="{
                      'text-white': activeParentStep === step.id,
                      'text-[#98A2B3]': activeParentStep !== step.id,
                      'text-[#1D2739]': step.completed,
                    }"
                  >
                    {{ step.title }}
                  </h3>
                </div>
              </aside>
              <div
                id="second-part"
                class="lg:pl-10 p-4 space-y-6 lg:max-w-screen-7xl w-full"
              >
                <CoreProgressStepper
                  v-if="activeParentStep === 1"
                  :titles="[
                    'Let’s start with the basics',
                    'What’s the location of the property?',
                  ]"
                  :totalSteps="2"
                  :currentStep="basicPropertyInformationStep"
                />
                <CreatePropertyForm
                  :payload="payload"
                  @updateFormData="handleBasicPropertyInformationFormData"
                  v-if="
                    activeParentStep === 1 && basicPropertyInformationStep === 1
                  "
                >
                
                </CreatePropertyForm>
                <CoreGoogleMapSearch
                class="z-10"
                :payload="payload"
                v-if="activeParentStep === 1 && basicPropertyInformationStep === 2">
              
              </CoreGoogleMapSearch>
                <!-- <CoreMapboxSearch
                class="z-10"
                :payload="payload"
                v-if="
                activeParentStep === 1 && basicPropertyInformationStep === 2
              "
                >
                  <template #action-buttons>
                    <div class="flex justify-between mt-4 z-50">
                      <button
                        @click="handlePreviousStep"
                        class="bg-[#EBE5E0] text-[#292929] text-sm font-semibold px-4 py-2 rounded-md disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        Previous
                      </button>
                      <button
                        @click="handleNextParentStep"
                        class="bg-[#292929] text-white text-sm font-semibold px-6 disabled:opacity-25 disabled:cursor-not-allowed py-2.5 rounded-md disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        Next
                      </button>
                    </div>
                  </template> 
                </CoreMapboxSearch> -->
                <!-- <MapSection
                  class="z-10"
                  :payload="payload"
                  @searchResult="handleLocationSearch"
                  @selectedAmenity="handleSelectedAmenity"
                  v-if="
                    activeParentStep === 1 && basicPropertyInformationStep === 2
                  "
                >
                  <template #action-buttons>
                    <div class="flex justify-between mt-4 z-50">
                      <button
                        @click="handlePreviousStep"
                        class="bg-[#EBE5E0] text-[#292929] text-sm font-semibold px-4 py-2 rounded-md disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        Previous
                      </button>
                      <button
                        @click="handleNextParentStep"
                        class="bg-[#292929] text-white text-sm font-semibold px-6 disabled:opacity-25 disabled:cursor-not-allowed py-2.5 rounded-md disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        Next
                      </button>
                    </div>
                  </template>                                                       2
                </MapSection> -->
                <CoreProgressStepper
                  v-if="activeParentStep === 2"
                  :titles="[
                    'Details about Common areas',
                    'Details about the private rooms',
                  ]"
                  :totalSteps="2"
                  :currentStep="propertyDetailsStep"
                />
                <PropertyDetails
                  @updateCommonAreas="handleCommonAreas"
                  @updateIsFurnished="handlePropertyFurnished"
                  :payload="payload"
                  :commonAreasList="commonAreasList"
                  :interiorAreas="interiorAreas"
                  :exteriorAreas="exteriorAreas"
                  :exteriorFurnishedAreasList="exteriorFurnishedAreasList"
                  :exteriorUnFurnishedAreasList="exteriorUnFurnishedAreasList"
                  :interiorFurnishedAreasList="interiorFurnishedAreasList"
                  :interiorUnFurnishedAreasList="interiorUnFurnishedAreasList"
                  :loading="loadingCommonAreas"
                  v-if="activeParentStep === 2 && propertyDetailsStep === 1"
                >
                
                </PropertyDetails>
                <RoomDetails
                  :interiorAreas="interiorAreas"
                  :roomFeaturesList="roomFeaturesList"
                  :loadingRoomFeatures="loadingRoomFeatures"
                  :loading="loadingCommonAreas"
                  :payload="payload"
                  @emitRoomData="handleRoomData"
                  v-if="activeParentStep === 2 && propertyDetailsStep === 2"
                >
                  <!-- <template #action-buttons>
                    <div class="flex justify-between mt-4">
                      <button
                        @click="handlePreviousStep"
                        class="bg-[#EBE5E0] text-[#292929] text-sm font-semibold px-4 py-2 rounded-md disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        Previous
                      </button>
                      <button
                        @click="handleNextParentStep"
                        class="bg-[#292929] text-white text-sm font-semibold px-6 py-2.5 rounded-md disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        Next
                      </button>
                    </div>
                  </template> -->
                </RoomDetails>
                <CoreProgressStepper
                  v-if="activeParentStep === 3"
                  :titles="[
                    'Upload Property Exterior and Street View Images',
                    'Upload images of the common area',
                    'Upload images of the private rooms',
                  ]"
                  :totalSteps="2"
                  :currentStep="visualsStep"
                />
                <UploadPropertyExterior
                :payload="payload"
                v-if="activeParentStep === 3 && visualsStep === 1"
                >
                </UploadPropertyExterior>
                <CommonAreasUpload v-if="activeParentStep === 3 && visualsStep === 2" :payload="payload" />
                <!-- <UploadPhotos
                  :payload="payload"
                  v-if="activeParentStep === 3 && visualsStep === 2"
                >
                </UploadPhotos> -->
                <AddVideoTours
                  :payload="payload"
                  v-if="activeParentStep === 3 && visualsStep === 3"
                >
                  <!-- <template #action-buttons>
                    <div class="flex justify-between mt-4">
                      <button
                        @click="handlePreviousStep"
                        class="bg-[#EBE5E0] text-[#292929] text-sm font-semibold px-4 py-2 rounded-md disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        Previous
                      </button>
                      <button
                        @click="handleNextParentStep"
                        class="bg-[#292929] text-white text-sm font-semibold px-6 py-2.5 rounded-md disabled:bg-gray-200 disabled:text-gray-500"
                      >
                        Next
                      </button>
                    </div>
                  </template> -->
                </AddVideoTours>
                <CoreProgressStepper
                  v-if="activeParentStep === 4"
                  :titles="[
                    'Define house rules',
                    'Set pre-screening questions',
                    'Assign property',
                  ]"
                  :totalSteps="3"
                  :currentStep="finalizeStep"
                />
                <ReviewDetails
                  @updateRules="handleUpdatedRules"
                  :payload="payload"
                  v-if="activeParentStep === 4 && finalizeStep === 1"
                >
                </ReviewDetails>
                <PublishListing
                  @updateQuestions="handleQuestions"
                  :payload="payload"
                  v-if="activeParentStep === 4 && finalizeStep === 2"
                >
                </PublishListing>
                <AssignProperty
                  :payload="payload"
                  :agents="agentsList"
                  :loading="loadingAgents"
                  v-if="activeParentStep === 4 && finalizeStep === 3"
                >
                </AssignProperty>
              </div>
            </div>
          </section>

            <!-- Preview UI: rendered when preview mode is active -->
            <section class="pb-20" v-if="isPreviewMode">
              <div class="max-w-3xl mx-auto py-10 border border-gray-100 rounded-xl mt-6 p-10">
                <p class="text-[#1D2739] font-normal  text-2xl max-w-lg pb-10">Review property details and proceed to publish to the public</p>

                <div class="flex justify-between items-center mb-10">
                  <p class="text-[#1D2739] font-normal">Basic property information</p>
                  <button @click="router.push('/dashboard/property/new')" class="text-[#326543] font-semibold">Edit</button>
                </div>
                <div class="pb-6">
                  <div class="flex justify-between items-center">
                    <div class="space-y-2">
                      <!-- {{editPayload}} -->
                      <h4 class="font-normal text-sm text-[#667185]">Property name</h4>
                      <p>{{payload?.name?.value}}</p>
                    </div>
                    <!-- <button @click="router.push('/dashboard/property/new')" class="text-green-600 font-semibold">Edit</button> -->
                  </div>
                  <div class="mt-4">
                    <h4 class="font-normal text-[#667185] text-sm">Brief description</h4>
                    <p class="text-sm text-[#1D2739]">{{payload?.description?.value}}</p>
                    <!-- <a href="#" class="text-blue-500">View more</a> -->
                  </div>                            
                  <div class="mt-4 space-y-6">
                    <div>
                      <h4 class="font-normal text-[#667185] text-sm">Building/property type</h4>
                      <p class="text-sm text-[#1D2739]">{{ propertyObj?.name }}</p>
                    </div>
                    <div>
                      <h4 class="font-normal text-[#667185] text-sm">Floor type</h4>
                      <p class="text-sm text-[#1D2739]">{{ floorObj?.name }}</p>
                    </div>
                    <div>
                      <h4 class="font-normal text-[#667185] text-sm">Property size</h4>
                      <p class="text-sm text-[#1D2739]">{{ payload?.size?.value }} {{payload?.sizeUnit?.value}}</p>
                    </div>
                <div class="grid grid-cols-2 gap-6">
                  <div>
                    <h4 class="font-normal text-[#667185] text-sm">Number of bedrooms</h4>
                    <p class="text-sm text-[#1D2739]">{{ payload?.bathroomCount?.value  }}</p>
                  </div>
                  <div>
                    <h4 class="font-normal text-[#667185] text-sm">Number of bathrooms/Rest room</h4>
                    <p class="text-sm text-[#1D2739]">{{ payload?.bathroomCount?.value }}</p>
                  </div>
                </div>
                    <div>
                      <h4 class="font-normal text-[#667185] text-sm">Property location</h4>
                      <p class="text-sm text-[#1D2739]">{{ payload?.address?.value  }}</p>
                    </div>
                  </div>
                </div>

                <div class="border-t border-gray-50 py-4 ">
                  <div class="flex justify-between items-center mb-10">
                    <p class="text-[#1D2739] font-normal">Detailed property information</p>
                    <button @click="router.push('/dashboard/property/new?parentStep=2&childStep=1')" class="text-[#326543] font-semibold">Edit</button>
                  </div>
                  <div>
                    <h4 class="font-normal text-[#667185] text-sm">Is the common area furnished?</h4>
                    <p>{{ payload.isFurnishedCommonArea.value ? 'Yes' : 'No' }}</p>
                  </div>
                  <div class="mt-4">
                    <h4 class="font-normal text-[#667185] text-sm">Interior amenities</h4>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span v-for="item in interiorAmenities" :key="item" class="bg-white border-[0.5px] border-[#E4E7EC] font-normal text-sm flex items-center gap-x-2 p-2 px-3 rounded-md">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_6590_54802)">
                            <g opacity="0.8">
                            <g clip-path="url(#clip1_6590_54802)">
                            <rect width="20" height="20" rx="4" fill="#292929"/>
                            <path d="M0.191618 14.7782C0.191618 14.1829 1.45648 13.9055 2.31137 13.9055C2.55384 13.9055 2.96093 13.9543 2.96093 14.2805C2.96093 14.9187 1.64513 15.2669 0.969097 15.2669C0.610362 15.2669 0.191618 15.1388 0.191618 14.7782ZM3.39046 14.2805C3.39046 13.8915 3.10698 13.476 2.31137 13.476C1.42957 13.476 -0.238053 13.7482 -0.238053 14.7782C-0.238053 15.3275 0.247165 15.6964 0.969097 15.6964C1.81334 15.6964 3.39046 15.2812 3.39046 14.2805ZM-2.55566 18.6281C-1.45643 19.0225 0.210613 19.4316 2.39727 19.4316C5.84189 19.4316 10.4214 19.0265 10.4214 15.5243C10.4214 14.1852 9.58106 13.5934 8.90575 13.1178C8.31189 12.6995 7.94595 12.4144 7.9084 11.8469C7.88365 11.4728 8.05978 11.1335 8.26397 10.7408C8.49291 10.3003 8.75235 9.80112 8.75235 9.16984C8.75235 8.31307 8.11691 7.39084 6.72182 7.39084C5.61338 7.39084 4.59085 7.82425 3.50846 8.28329C2.11639 8.87355 0.538274 9.54268 -1.6917 9.54268C-1.99979 9.54268 -2.28686 9.52167 -2.55566 9.48425V7.1242C-2.04498 7.18765 -1.53086 7.21952 -1.01625 7.2196C1.65175 7.2196 3.52212 6.31996 5.17234 5.52622C6.57792 4.85005 7.90552 4.21157 9.52825 4.21157C11.7713 4.21157 12.9448 5.48233 12.9448 6.73755C12.9448 7.58078 12.5074 8.09435 12.0443 8.63785C11.5671 9.1979 11.0737 9.77709 11.0737 10.7164C11.0737 11.618 11.4278 12.1025 11.7703 12.571C12.1701 13.1178 12.5835 13.6835 12.5835 15.0269C12.5835 17.5906 10.1565 19.1775 7.79141 20.1152H-2.55566V18.6281ZM-2.55566 16.5168C-1.49641 16.8984 -0.379105 17.0937 0.746778 17.0943C2.69543 17.0943 5.96449 16.6643 5.96449 13.7851C5.96449 12.9381 5.28429 11.745 3.77193 11.745C2.75386 11.745 1.95163 12.0127 1.17588 12.2715C0.386747 12.5347 -0.358496 12.7834 -1.33599 12.7834C-1.76293 12.7834 -2.17203 12.7099 -2.55566 12.5929V10.4374C-2.26891 10.4711 -1.98042 10.4879 -1.6917 10.4876C0.73052 10.4876 2.47527 9.74787 3.87726 9.15343C4.91188 8.71469 5.80534 8.33581 6.72182 8.33581C7.52203 8.33581 7.80723 8.76664 7.80723 9.16984C7.80723 9.57016 7.62175 9.92703 7.42533 10.305C7.18992 10.758 6.92313 11.2715 6.96529 11.9095C7.03479 12.9559 7.73961 13.4524 8.36139 13.8904C8.98432 14.3291 9.4763 14.6755 9.4763 15.5243C9.4763 16.796 8.74242 18.4865 2.39727 18.4865C0.115353 18.4865 -1.56551 18.0051 -2.55566 17.6133V16.5168ZM-2.55566 13.0441C-2.16959 13.15 -1.76149 13.2131 -1.33599 13.2131C-0.288706 13.2131 0.525033 12.9415 1.31186 12.6791C2.08934 12.4196 2.8235 12.1747 3.77193 12.1747C5.10399 12.1747 5.53496 13.2597 5.53496 13.7851C5.53496 15.669 3.87928 16.6647 0.746778 16.6647C-0.595351 16.6647 -1.73272 16.3657 -2.55566 16.0533V13.0441ZM-2.55566 4.83853C-2.16832 4.92467 -1.7728 4.96867 -1.376 4.96977C1.134 4.96977 3.06353 3.91846 5.10629 2.80555C7.16632 1.68316 9.29658 0.522625 12.1059 0.522625C13.4066 0.522625 14.5149 0.898771 15.3106 1.61049C16.0833 2.30148 16.4919 3.24314 16.4919 4.3336C16.4919 5.47772 15.7894 6.50731 15.0457 7.59719C14.2376 8.78189 13.4017 10.0067 13.4017 11.4928C13.4017 14.641 15.9528 16.4834 20.4184 16.5836V17.7153C20.3992 17.7169 20.3803 17.7211 20.3623 17.7278C17.1234 18.9779 15.0302 16.7472 14.9363 16.6427C14.9161 16.6145 14.8893 16.5916 14.8583 16.5759C14.8273 16.5603 14.7929 16.5525 14.7582 16.553C14.7235 16.5536 14.6894 16.5626 14.6589 16.5792C14.6284 16.5958 14.6024 16.6196 14.5831 16.6485C14.5584 16.686 14.5465 16.7305 14.549 16.7754H14.5474C14.5474 16.7813 14.5317 17.3908 13.9974 18.289C13.7049 18.781 13.2122 19.425 12.3931 20.1152H8.89136C9.38679 19.881 9.91806 19.5935 10.4254 19.2475C12.1424 18.0765 13.013 16.6565 13.013 15.0269C13.013 13.5432 12.537 12.892 12.1171 12.3174C11.7877 11.8669 11.5032 11.4777 11.5032 10.7164C11.5032 9.93523 11.9249 9.44036 12.3712 8.91644C12.8644 8.33768 13.3743 7.73907 13.3743 6.73755C13.3743 5.26879 12.0532 3.78189 9.52825 3.78189C7.80753 3.78189 6.43705 4.44109 4.98613 5.13899C3.29865 5.95071 1.55375 6.78992 -1.01625 6.78992C-1.59932 6.78992 -2.12354 6.74603 -2.55566 6.68991V4.83853ZM-2.55566 0.82826C-2.0621 1.16743 -1.33038 1.45652 -0.266114 1.45652C2.12833 1.45652 3.91684 0.387938 5.81038 -0.743526C7.73472 -1.89326 9.72452 -3.08215 12.4494 -3.08215C14.9159 -3.08215 17.0476 -2.21373 18.785 -0.501205C19.6012 0.303324 20.1333 1.11534 20.4184 1.61279V4.19229C20.4136 4.20746 20.4096 4.22288 20.4064 4.23848C20.305 4.73119 19.5231 5.3675 18.6952 6.04108C17.1203 7.32263 15.1601 8.91744 15.1692 11.4073C15.1729 12.4546 15.616 13.3998 16.3847 14.0008C17.1017 14.5611 17.9861 14.7486 18.8483 14.7486C19.3971 14.7484 19.9365 14.6722 20.4184 14.5683V16.1542C16.2258 16.0569 13.8313 14.3704 13.8313 11.4928C13.8313 10.1394 14.6291 8.97011 15.4006 7.83937C16.1482 6.74344 16.9214 5.61025 16.9214 4.3336C16.9214 1.83684 14.9411 0.092947 12.1059 0.092947C9.18707 0.092947 7.00817 1.2801 4.9008 2.4284C2.90739 3.51439 1.0245 4.54009 -1.376 4.54009C-1.79488 4.54009 -2.19132 4.48397 -2.55566 4.39734V0.82826ZM20.4184 7.54783C20.1412 7.77648 19.8745 7.98283 19.6164 8.18227C18.5008 9.04422 17.6197 9.72514 17.6197 10.9897C17.6197 11.5706 17.8413 12.0204 18.2602 12.2904C18.5972 12.5075 19.0227 12.589 19.4527 12.589C19.7851 12.589 20.1197 12.5401 20.4184 12.4677V13.5989C18.9126 13.9622 17.7192 13.8443 16.9667 13.2561C16.4277 12.8348 16.1169 12.1596 16.1143 11.4038C16.1068 9.36554 17.7987 7.98873 19.2917 6.77409C19.7035 6.43896 20.0913 6.12267 20.4184 5.80926V7.54783ZM20.4184 12.0235C19.7973 12.1897 18.9827 12.2446 18.4929 11.9294C18.1945 11.737 18.0494 11.4296 18.0494 10.9897C18.0494 9.93609 18.8168 9.34295 19.8791 8.52216C20.0599 8.38299 20.2397 8.2424 20.4184 8.1004V12.0235ZM20.4184 20.1152H13.0464C14.3468 18.9039 14.7719 17.806 14.9094 17.2087C15.1907 17.4523 15.6597 17.8002 16.3026 18.0824C17.2106 18.4808 18.6558 18.8128 20.4184 18.1651V20.1152Z" fill="white" fill-opacity="0.9"/>
                            </g>
                            </g>
                            </g>
                            <defs>
                            <clipPath id="clip0_6590_54802">
                            <rect width="20" height="20" fill="white"/>
                            </clipPath>
                            <clipPath id="clip1_6590_54802">
                            <rect width="20" height="20" rx="4" fill="white"/>
                            </clipPath>
                            </defs>
                            </svg>                
                        {{ item.name }}</span>
                    </div>
                  </div>
                  <div class="mt-4">
                    <h4 class="font-normal text-[#667185] text-sm">Exterior amenities</h4>
                    <div class="flex flex-wrap gap-2 mt-2">
                      <span v-for="item in exteriorAmenities" :key="item" class="bg-white border-[0.5px] border-[#E4E7EC] font-normal text-sm flex items-center gap-x-2 p-2 px-3 rounded-md">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_6590_54802)">
                            <g opacity="0.8">
                            <g clip-path="url(#clip1_6590_54802)">
                            <rect width="20" height="20" rx="4" fill="#292929"/>
                            <path d="M0.191618 14.7782C0.191618 14.1829 1.45648 13.9055 2.31137 13.9055C2.55384 13.9055 2.96093 13.9543 2.96093 14.2805C2.96093 14.9187 1.64513 15.2669 0.969097 15.2669C0.610362 15.2669 0.191618 15.1388 0.191618 14.7782ZM3.39046 14.2805C3.39046 13.8915 3.10698 13.476 2.31137 13.476C1.42957 13.476 -0.238053 13.7482 -0.238053 14.7782C-0.238053 15.3275 0.247165 15.6964 0.969097 15.6964C1.81334 15.6964 3.39046 15.2812 3.39046 14.2805ZM-2.55566 18.6281C-1.45643 19.0225 0.210613 19.4316 2.39727 19.4316C5.84189 19.4316 10.4214 19.0265 10.4214 15.5243C10.4214 14.1852 9.58106 13.5934 8.90575 13.1178C8.31189 12.6995 7.94595 12.4144 7.9084 11.8469C7.88365 11.4728 8.05978 11.1335 8.26397 10.7408C8.49291 10.3003 8.75235 9.80112 8.75235 9.16984C8.75235 8.31307 8.11691 7.39084 6.72182 7.39084C5.61338 7.39084 4.59085 7.82425 3.50846 8.28329C2.11639 8.87355 0.538274 9.54268 -1.6917 9.54268C-1.99979 9.54268 -2.28686 9.52167 -2.55566 9.48425V7.1242C-2.04498 7.18765 -1.53086 7.21952 -1.01625 7.2196C1.65175 7.2196 3.52212 6.31996 5.17234 5.52622C6.57792 4.85005 7.90552 4.21157 9.52825 4.21157C11.7713 4.21157 12.9448 5.48233 12.9448 6.73755C12.9448 7.58078 12.5074 8.09435 12.0443 8.63785C11.5671 9.1979 11.0737 9.77709 11.0737 10.7164C11.0737 11.618 11.4278 12.1025 11.7703 12.571C12.1701 13.1178 12.5835 13.6835 12.5835 15.0269C12.5835 17.5906 10.1565 19.1775 7.79141 20.1152H-2.55566V18.6281ZM-2.55566 16.5168C-1.49641 16.8984 -0.379105 17.0937 0.746778 17.0943C2.69543 17.0943 5.96449 16.6643 5.96449 13.7851C5.96449 12.9381 5.28429 11.745 3.77193 11.745C2.75386 11.745 1.95163 12.0127 1.17588 12.2715C0.386747 12.5347 -0.358496 12.7834 -1.33599 12.7834C-1.76293 12.7834 -2.17203 12.7099 -2.55566 12.5929V10.4374C-2.26891 10.4711 -1.98042 10.4879 -1.6917 10.4876C0.73052 10.4876 2.47527 9.74787 3.87726 9.15343C4.91188 8.71469 5.80534 8.33581 6.72182 8.33581C7.52203 8.33581 7.80723 8.76664 7.80723 9.16984C7.80723 9.57016 7.62175 9.92703 7.42533 10.305C7.18992 10.758 6.92313 11.2715 6.96529 11.9095C7.03479 12.9559 7.73961 13.4524 8.36139 13.8904C8.98432 14.3291 9.4763 14.6755 9.4763 15.5243C9.4763 16.796 8.74242 18.4865 2.39727 18.4865C0.115353 18.4865 -1.56551 18.0051 -2.55566 17.6133V16.5168ZM-2.55566 13.0441C-2.16959 13.15 -1.76149 13.2131 -1.33599 13.2131C-0.288706 13.2131 0.525033 12.9415 1.31186 12.6791C2.08934 12.4196 2.8235 12.1747 3.77193 12.1747C5.10399 12.1747 5.53496 13.2597 5.53496 13.7851C5.53496 15.669 3.87928 16.6647 0.746778 16.6647C-0.595351 16.6647 -1.73272 16.3657 -2.55566 16.0533V13.0441ZM-2.55566 4.83853C-2.16832 4.92467 -1.7728 4.96867 -1.376 4.96977C1.134 4.96977 3.06353 3.91846 5.10629 2.80555C7.16632 1.68316 9.29658 0.522625 12.1059 0.522625C13.4066 0.522625 14.5149 0.898771 15.3106 1.61049C16.0833 2.30148 16.4919 3.24314 16.4919 4.3336C16.4919 5.47772 15.7894 6.50731 15.0457 7.59719C14.2376 8.78189 13.4017 10.0067 13.4017 11.4928C13.4017 14.641 15.9528 16.4834 20.4184 16.5836V17.7153C20.3992 17.7169 20.3803 17.7211 20.3623 17.7278C17.1234 18.9779 15.0302 16.7472 14.9363 16.6427C14.9161 16.6145 14.8893 16.5916 14.8583 16.5759C14.8273 16.5603 14.7929 16.5525 14.7582 16.553C14.7235 16.5536 14.6894 16.5626 14.6589 16.5792C14.6284 16.5958 14.6024 16.6196 14.5831 16.6485C14.5584 16.686 14.5465 16.7305 14.549 16.7754H14.5474C14.5474 16.7813 14.5317 17.3908 13.9974 18.289C13.7049 18.781 13.2122 19.425 12.3931 20.1152H8.89136C9.38679 19.881 9.91806 19.5935 10.4254 19.2475C12.1424 18.0765 13.013 16.6565 13.013 15.0269C13.013 13.5432 12.537 12.892 12.1171 12.3174C11.7877 11.8669 11.5032 11.4777 11.5032 10.7164C11.5032 9.93523 11.9249 9.44036 12.3712 8.91644C12.8644 8.33768 13.3743 7.73907 13.3743 6.73755C13.3743 5.26879 12.0532 3.78189 9.52825 3.78189C7.80753 3.78189 6.43705 4.44109 4.98613 5.13899C3.29865 5.95071 1.55375 6.78992 -1.01625 6.78992C-1.59932 6.78992 -2.12354 6.74603 -2.55566 6.68991V4.83853ZM-2.55566 0.82826C-2.0621 1.16743 -1.33038 1.45652 -0.266114 1.45652C2.12833 1.45652 3.91684 0.387938 5.81038 -0.743526C7.73472 -1.89326 9.72452 -3.08215 12.4494 -3.08215C14.9159 -3.08215 17.0476 -2.21373 18.785 -0.501205C19.6012 0.303324 20.1333 1.11534 20.4184 1.61279V4.19229C20.4136 4.20746 20.4096 4.22288 20.4064 4.23848C20.305 4.73119 19.5231 5.3675 18.6952 6.04108C17.1203 7.32263 15.1601 8.91744 15.1692 11.4073C15.1729 12.4546 15.616 13.3998 16.3847 14.0008C17.1017 14.5611 17.9861 14.7486 18.8483 14.7486C19.3971 14.7484 19.9365 14.6722 20.4184 14.5683V16.1542C16.2258 16.0569 13.8313 14.3704 13.8313 11.4928C13.8313 10.1394 14.6291 8.97011 15.4006 7.83937C16.1482 6.74344 16.9214 5.61025 16.9214 4.3336C16.9214 1.83684 14.9411 0.092947 12.1059 0.092947C9.18707 0.092947 7.00817 1.2801 4.9008 2.4284C2.90739 3.51439 1.0245 4.54009 -1.376 4.54009C-1.79488 4.54009 -2.19132 4.48397 -2.55566 4.39734V0.82826ZM20.4184 7.54783C20.1412 7.77648 19.8745 7.98283 19.6164 8.18227C18.5008 9.04422 17.6197 9.72514 17.6197 10.9897C17.6197 11.5706 17.8413 12.0204 18.2602 12.2904C18.5972 12.5075 19.0227 12.589 19.4527 12.589C19.7851 12.589 20.1197 12.5401 20.4184 12.4677V13.5989C18.9126 13.9622 17.7192 13.8443 16.9667 13.2561C16.4277 12.8348 16.1169 12.1596 16.1143 11.4038C16.1068 9.36554 17.7987 7.98873 19.2917 6.77409C19.7035 6.43896 20.0913 6.12267 20.4184 5.80926V7.54783ZM20.4184 12.0235C19.7973 12.1897 18.9827 12.2446 18.4929 11.9294C18.1945 11.737 18.0494 11.4296 18.0494 10.9897C18.0494 9.93609 18.8168 9.34295 19.8791 8.52216C20.0599 8.38299 20.2397 8.2424 20.4184 8.1004V12.0235ZM20.4184 20.1152H13.0464C14.3468 18.9039 14.7719 17.806 14.9094 17.2087C15.1907 17.4523 15.6597 17.8002 16.3026 18.0824C17.2106 18.4808 18.6558 18.8128 20.4184 18.1651V20.1152Z" fill="white" fill-opacity="0.9"/>
                            </g>
                            </g>
                            </g>
                            <defs>
                            <clipPath id="clip0_6590_54802">
                            <rect width="20" height="20" fill="white"/>
                            </clipPath>
                            <clipPath id="clip1_6590_54802">
                            <rect width="20" height="20" rx="4" fill="white"/>
                            </clipPath>
                            </defs>
                            </svg>  
                        {{ item.name }}</span>
                    </div>
                  </div>

                  <!-- <div class="flex justify-between items-center mt-4">
                    <p class="text-[#1D2739] font-normal text-sm">Is the room furnished?</p>

                    <button :class="[payload.isFurnishedCommonArea.value ? 'bg-[#292929] py-3 px-4 rounded-lg' : 'border-[0.5px] border-[#292929] px-5 py-2.5 rounded-lg']" @click="router.push('/dashboard/property/new')" class="font-semibold">{{payload.isFurnishedCommonArea.value ? 'Yes' : 'No'}}</button>
                  </div> -->

                  <div class="bg-white rounded-lg shadow-sm mt-9">
                    <div class="flex space-x-4 mb-6">
                      <!-- Room Tabs -->
                      <button
                        v-for="room in payload.rooms.value"
                        :key="room.name"
                        :class="['px-6 py-2.5 rounded-lg text-sm', currentRoom.name === room.name ? 'bg-[#EBE5E0] text-[#1D2739]' : 'bg-white border border-gray-100 text-[#1D2739]']"
                        @click="selectRoom(room)"
                      >
                        {{ room.name }}
                      </button>
                    </div>

                    <div class="flex justify-between items-center my-4">
                      <p class="text-[#1D2739] font-normal text-sm">Is the room furnished?</p>

                      <button :class="[currentRoom?.isFurnished ? 'bg-[#292929] py-2.5 px-4 rounded-lg text-white' : 'border-[0.5px] border-[#292929] px-5 py-2.5 rounded-lg']" @click="router.push('/dashboard/property/new')" class="font-medium text-sm">{{currentRoom?.isFurnished ? 'Yes' : 'No'}}</button>
                    </div>
                
                    <!-- Interior Area -->
                    <div v-if="currentRoom" class="mb-6">
                      <h3 class="text-[#667185] font-normal text-sm mb-4">Interior area</h3>
                      <div class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4">
                        <div
                          v-for="(feature, index) in currentRoom.features"
                          :key="index"
                          class="flex items-center px-4 py-2.5 border rounded-lg bg-white gap-x-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <!-- <span class="inline-block w-5 h-5 rounded-full bg-gray-200 mr-2"></span> -->
                          <img :src="dynamicImage('roomBg.png')" alt="Living room" class="w-5 h-5">
                          <span class="text-gray-700 text-xs">{{ feature.name }}</span>
                        </div>
                        <div @click="addManually" class="flex items-center px-4 py-2.5 border rounded-lg bg-white hover:bg-gray-100 cursor-pointer">
                          <span class="text-gray-600 font-normal text-lg">+</span>
                          <span class="ml-2 text-gray-700 text-sm">Add manually</span>
                        </div>
                      </div>
                    </div>
                
                    <!-- Room Availability and Price -->
                    <div v-if="currentRoom" class="mt-4">
                      <div class="flex justify-between items-center mb-4">
                        <div class="space-y-2">
                          <p class="text-gray-500 text-sm font-normal">When is the room available?</p>
                          <p class="text-gray-800 text-sm">{{ currentRoom.availability === 'available_now' ? 'Available Now' : currentRoom.availableFrom }}</p>
                        </div>
                        <div class="space-y-2">
                          <p class="text-gray-500 font-normal text-sm">Price</p>
                          <p class="text-gray-800 text-sm">{{ currentRoom.rentAmount ? currentRoom.rentAmount.toLocaleString() : '0' }} per {{ currentRoom.rentFrequency }}</p>
                        </div>
                      </div>
                      <div class="flex justify-between items-center mt-6 pb-10">
                        <!-- <p class="text-[#1D2739] text-sm">{{ currentRoom.isMaster ? 'Master\'s bedroom' : '' }}</p> -->
                        <p class="text-[#1D2739] text-sm">Master's bedroom</p>
                        <label for="Toggle1" class="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100">
                          <span class="relative">
                            <!-- Bind v-model to the checkbox to make it dynamic -->
                            <input id="Toggle1" type="checkbox" class="hidden peer" v-model="currentRoom.isMaster">
                            <!-- Conditional classes based on the toggle state -->
                            <div
                              :class="[
                                'w-10 h-6 rounded-full shadow-inner peer-checked:dark:bg-[#099137]',
                                currentRoom.isMaster ? 'bg-white' : 'dark:bg-gray-400'
                              ]"
                            ></div>
                            <!-- Ball that changes position and color based on the toggle state -->
                            <div
                              class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow"
                              :class="[
                                currentRoom.isMaster ? 'right-0 left-auto bg-white' : 'dark:bg-gray-800'
                              ]"
                            ></div>
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex justify-between items-center my-5 pb-8">
                  <p class="text-[#1D2739] font-semibold">Add visuals</p>
                  <button @click="router.push('/dashboard/property/new?parentStep=3&childStep=1')" class="text-[#326543] font-semibold">Edit</button>
                </div>

                <div>    
                  <p class="font-normal text-sm mt-4 pb-3 text-sm">Property Cover Images</p>    
                  <section v-if="Array.isArray(payload.images.value) && payload.images.value.length" class="grid grid-cols-2 gap-6">
                    <div v-for="(item, index) in payload.images.value" :key="index" class="border p-2">
                      <img 
                        :src="item" 
                        :alt="'Image ' + (index + 1)" 
                        class="w-full h-44 w-auto object-cover"
                      />
                    </div>
                  </section>
                  
                  <!-- Display a fallback message when no images are available -->
                  <p v-else>No images available.</p>
                </div>

                <div class="bg-white rounded- shadow-sm">
                  <h2 class="text font-medium mb-6">Common Area</h2>
                  
                  <!-- Display common areas in a grid layout -->
                  <div class="grid grid-cols-2 gap-6">
                    <div v-for="(area, index) in payload.commonAreas.value" :key="index" class="relative">
                      <div class="relative rounded-lg overflow-hidden shadow-md bg-white border">
                        <div class="relative w-full h-52 flex items-center justify-center overflow-hidden">
                          <!-- Carousel Images -->
                          <img
                            v-if="area?.images?.length > 0"
                            :src="area.images[currentImageIndex[index]]"
                            alt="common area image"
                            class="w-full h-full object-cover transition-opacity"
                          />
                          <img v-else src="@/assets/icons/image-unavailable.svg" alt="" class="h-20 w-20" />
                          
                          <!-- Previous button -->
                          <button
                            v-if="area?.images?.length > 1"
                            @click="prevImage(index)"
                            class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow hover:bg-gray-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          
                          <!-- Next button -->
                          <button
                            v-if="area?.images?.length > 1"
                            @click="nextImage(index)"
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow hover:bg-gray-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                        
                        <!-- Image description overlay -->
                        <div class="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-70 text-white p-2 flex justify-between items-center">
                          <span class="text-sm">{{ area?.name }}</span>
                          <span class="text-sm">{{ area?.images?.length }} {{ area?.images?.length > 1 ? 'images' : 'image' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm mx-auto mt-6">
                  <h2 class="text-sm font-semibold">Rooms</h2>
                
                  <div v-for="(room, index) in payload.rooms.value" :key="index" class="mb-8 border-b pb-6 text-sm">
                    <!-- Room Name and Occupant Information -->
                    <h3 class="font-semibold mb-2">
                      {{ room?.name }}
                      <span v-if="room?.isMaster" class="text-sm font-normal">(Master Room)</span>
                    </h3>
                    <!-- <p class="text-gray-600 mb-2">Occupant: {{ room?.occupantName || 'None' }}</p>
                    <p v-if="room?.availability === 'available_now'" class="text-green-600 mb-2">Available Now</p>
                    <p v-else-if="room?.availability === 'unavailable'" class="text-red-600 mb-2">Unavailable</p>
                    <p v-else class="text-yellow-600 mb-2">Available from: {{ formatDate(room?.availableFrom) }}</p>
                    <p class="text-gray-800 text-sm font-normal mb-2">
                      Rent: {{ formatCurrency(room?.rentAmount, room?.currencyCode) }} per {{ room?.rentFrequency }}
                    </p>
                    <p class="text-gray-600 text-sm font-normal mb-2">Furnished: {{ room?.isFurnished ? 'Yes' : 'No' }}</p> -->
                
                    <div class="mt-4">
                      <h3 class="text-gray-500 font-normal mb-2">Interior Area</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          v-for="(feature, fIndex) in room?.features || []"
                          :key="fIndex"
                          class="relative rounded-lg overflow-hidden shadow-md bg-white border"
                        >
                          <div class="relative w-full h-44 flex items-center justify-center overflow-hidden">
                            <!-- Ensure that feature has an image, or show a placeholder -->
                            <img
                              v-if="feature?.images?.length > 0"
                              :src="feature.images[0]"
                              alt="Feature image"
                              class="w-full h-full object-cover transition-opacity"
                            />
                            <img v-else src="@/assets/icons/image-unavailable.svg" class="h-20 w-20 mb-3" alt="No image available" />
                          </div>
                          <p class="absolute bottom-0 left-0 w-full bg-gray-700 bg-opacity-70 text-white p-2 text-sm">
                            {{ feature.name }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-lg">
                  <!-- <h2 class="text font-normal mb-6">Finalize listings and edit</h2> -->
                  <div class="flex justify-between items-center my-5 pb-8">
                    <p class="text-[#1D2739] font-semibold">Finalize listings and edit</p>
                    <button @click="router.push('/dashboard/property/new?parentStep=4&childStep=1')" class="text-[#326543] font-semibold">Edit</button>
                  </div>
                  <div class="mb-6">
                    <h3 class="text font-normal text-gray-600">
                      Define your rules for potential tenants
                    </h3>
                    <div class="mt-4">
                      <div v-for="(ruleObj, index) in payload.rules.value" :key="index" class="flex justify-between py-2">
                        <div v-if="ruleObj.options" class="flex-1 mr-4">
                          <label class="block text-gray-700 text-sm font-normal mb-1">
                            {{ ruleObj.rule }}
                          </label>
                        </div>
                        <div v-else class="flex-1">
                          <span class="block text-gray-700 flex items-center gap-x-3">
                            <svg width="16" height="16" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.29675 1.29724C1.7605 0.833496 2.50689 0.833496 3.99967 0.833496C5.49244 0.833496 6.23884 0.833496 6.70261 1.29724C7.16634 1.76099 7.16634 2.50738 7.16634 4.00016C7.16634 5.49293 7.16634 6.23933 6.70261 6.7031C6.23884 7.16683 5.49244 7.16683 3.99967 7.16683C2.50689 7.16683 1.7605 7.16683 1.29675 6.7031C0.833008 6.23933 0.833008 5.49293 0.833008 4.00016C0.833008 2.50738 0.833008 1.76099 1.29675 1.29724Z" fill="#292929" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                              </svg>
                              
                            {{ ruleObj.rule }}</span>
                        </div>
                        <div v-if="ruleObj.answer" class="ml-4 text-gray-900 font-normal">
                          {{ ruleObj.answer }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white rounded-lg shadow-sm">
                  <p class="pb-3">Pre-screening questions</p>
                  <form @submit.prevent="submitAnswers">
                    <div v-for="(questionObj, index) in payload?.questions.value" :key="index" class="mb-6">
                      <label :for="'question-' + index" class="block text-gray-700 text-sm font-normal mb-2">
                        {{ questionObj.question }}
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </section>
        </main>
        <main v-else>
          <div class="rounded-md p-4 w-full mx-auto">
            <div class="animate-pulse flex space-x-4">
              <div class="flex-1 space-y-6 py-1">
                <div class="h-44 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
         </main>
      <!-- <section v-else>
        <div class="rounded-md p-4 w-full mx-auto mt-10">
          <div class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-6 py-1">
              <div class="h-32 bg-slate-200 rounded"></div>
              <div class="space-y-3">
                <div class="grid grid-cols-3 gap-4">
                  <div class="h-32 w-full bg-slate-200 rounded col-span-2"></div>
                  <div class="h-32 w-full bg-slate-200 rounded col-span-1"></div>
                </div>
                <div class="h-32 w-full bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
       </section> -->
    </LayoutWithoutSidebar>
    <CoreReusableModal
      :isOpen="openCancelModal"
      message="By cancelling, you will loose progress of your property upload"
      confirmButtonText="No, Continue uploading"
      cancelButtonText="Yes, Cancel"
      @close="handleClose"
      @confirm="handleConfirm"
    />
   </main>
   <footer
   class="bg-white border-t border-gray-200 px-4 py-2 w-full fixed bottom-0 flex justify-between items-center"
 >
 <div class="container mx-auto w-full flex justify-between items-center">
 <button
 type="button"
   @click="handlePreviousStep"
   :disabled="activeParentStep === 1 && basicPropertyInformationStep === 1"
   class="bg-[#EBE5E0] text-[#292929] text-sm font-semibold px-4 py-2 rounded-md disabled:bg-gray-200 disabled:text-gray-500"
 >
   Previous
 </button>
 <button
  v-if="!isPreviewMode"
   type="button"
   @click="handleNextStep"
   :disabled="isNextButtonDisabled"
   class="bg-[#292929] text-white text-sm font-semibold px-6 py-2.5 rounded-md disabled:opacity-25 disabled:cursor-not-allowed"
 >
   Next
 </button>
 <button
 v-if="isPreviewMode"
 @click="handleSubmit"
 :disabled="loading"
 class="bg-[#292929] text-white text-sm font-semibold px-6 py-2.5 rounded-md disabled:opacity-25 disabled:cursor-not-allowed"
>
  {{ loading ? 'processing' : 'Save and Publish'}}
</button>
 </div>
 </footer>
  </main>
</template>

<script lang="ts" setup>
import { useGetRoomFeatures } from  '@/composables/modules/property/fetchRoomFeatures'
import { useGetCommonAreas } from '@/composables/modules/property/fetchCommonAreas'
import { use_create_property } from '@/composables/modules/property/create'
import LayoutWithoutSidebar from "@/layouts/dashboardWithoutSidebar.vue";
import { useFetchAgents } from '@/composables/modules/agents/fetch'
import { useEditProperty } from '@/composables/modules/property/update'
import { useClearLocalStorage } from '@/composables/core/useClearLocalStorage';
import { useGetFloorings } from '@/composables/modules/property/fetchFloorings'
import { useGetPropertyTypes } from '@/composables/modules/property/fetchPropertyTypes'
const { propertyTypesList, getPropertyTypes } = useGetPropertyTypes()
const { flooringsList, geFloorings  } = useGetFloorings()
const { clearLocalStorage } = useClearLocalStorage();
const { resetPayload } = use_create_property()
const { agentsList, loading: loadingAgents } = useFetchAgents()
const { editProperty, payload, loading, fetchingProperty, saving, savingProperty }  = useEditProperty()
const { loading: loadingCommonAreas, commonAreasList, interiorAreas, exteriorAreas, exteriorFurnishedAreasList, exteriorUnFurnishedAreasList, interiorFurnishedAreasList, interiorUnFurnishedAreasList } = useGetCommonAreas()
const { loading: loadingRoomFeatures, roomFeaturesList } = useGetRoomFeatures()
const route = useRoute()

definePageMeta({
     middleware: 'auth'
})

const steps = ref([
  { id: 1, title: "Basic Property Information", completed: false },
  { id: 2, title: "Detailed Property Information", completed: false },
  { id: 3, title: "Add Visuals", completed: false },
  { id: 4, title: "Finalize listing and publish", completed: false },
]);


//Preview section code

const floorObj = computed(() => {
    return flooringsList.value.find((item) => item.id === payload.flooringTypeId.value)
  })

  const propertyObj = computed(() => {
    return propertyTypesList.value.find((item) => item.id ===  payload.houseTypeId.value)
  })

  const interiorAmenities = computed(() => {
    return payload.commonAreas.value.filter((item: any) => item.type === 'interior')
  })

  const exteriorAmenities = computed(() => {
    return payload.commonAreas.value.filter((item: any) => item.type === 'exterior')
  })

  const currentRoomImage = ref<number[]>(Array(payload.rooms?.value?.length || 0).fill(0));

// State to manage if we are in preview mode
const isPreviewMode = ref(false);

// Toggle Preview Mode
function togglePreviewMode(isPreview: boolean) {
  isPreviewMode.value = isPreview;

  // Update query parameter based on preview mode
  if (isPreview) {
    router.push({
      query: { ...route.query, preview: 'true' }
    });
  } else {
    const query = { ...route.query };
    delete query.preview; // Remove the preview query parameter
    router.push({ query });
  }
}

// Function to show the next image
const nextRoomImage = (index: number) => {
  const imagesLength = payload.rooms?.value[index]?.images.length || 1;
  currentRoomImage.value[index] = (currentRoomImage.value[index] + 1) % imagesLength;
};

// Function to show the previous image
const prevRoomImage = (index: number) => {
  const imagesLength = payload.rooms?.value[index]?.images.length || 1;
  currentRoomImage.value[index] =
    (currentRoomImage.value[index] - 1 + imagesLength) % imagesLength;
};

// Helper function to format the date
const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

// Helper function to format currency
const formatCurrency = (amount: number, currencyCode: string | undefined) => {
  // Default to 'NGN' (Naira) if no valid currencyCode is provided
  const validCurrencyCode = currencyCode || 'NGN';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: validCurrencyCode,
    }).format(amount);
  } catch (error) {
    console.error(`Invalid currency code: ${currencyCode}. Defaulting to 'NGN'.`);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  }
};

const currentImageIndex = ref<number[]>(Array(payload?.commonAreas?.value?.length).fill(0));

// Watch for changes to `commonAreas` to keep `currentImageIndex` in sync
watch(
  () => payload.commonAreas.value,
  (newAreas) => {
    currentImageIndex.value = Array(newAreas?.length).fill(0);
  },
  { immediate: true }
);

// Function to show the next image
const nextImage = (index: number) => {
  const totalImages = payload.commonAreas.value[index]?.images?.length;
  if (totalImages) {
    currentImageIndex.value[index] = (currentImageIndex.value[index] + 1) % totalImages;
  }
};

// Function to show the previous image
const prevImage = (index: number) => {
  const totalImages = payload.commonAreas.value[index]?.images?.length;
  if (totalImages) {
    currentImageIndex.value[index] = (currentImageIndex.value[index] - 1 + totalImages) % totalImages;
  }
};


// Current selected room
const currentRoom = ref(payload.rooms.value[0] || {}); // Set the first room as the default selected room

// Function to select a room
const selectRoom = (room) => {
  currentRoom.value = room;
};

// Function to add manual features to the room
const addManually = () => {
  const newItem = prompt('Enter the item name:');
  if (newItem) {
    if (!currentRoom.value.features) {
      currentRoom.value.features = [];
    }
    currentRoom.value.features.push({ name: newItem, images: [] });
  }
};

  // Ensure that `rules` is always treated as an array using a computed property
  const rules = computed(() => {
    return Array.isArray(payload.rules.value) ? payload.rules.valiue : [];
  });
  
  // Store the selected answers in a reactive array
  const rulesaAnswers = ref(payload?.rules?.value?.map(rule => rule.answer || null));

    // Ensure that `questions` is always treated as an array using a computed property
    const questions = computed(() => {
    return Array.isArray(payload.value?.questions) ? payload.value?.questions : [];
  });
  
  // Store answers in a reactive array based on the number of questions
  const answers = ref<(string | null)[]>(questions.value.map(() => null));
  
  // Function to handle form submission
  const submitAnswers = () => {
    // You can handle the submission logic here
    console.log("User Answers:", answers.value);
  };

//End preview code /////////////////////
const router = useRouter();
const openCancelModal = ref(false)

const handleConfirm = () => {
  clearLocalStorage();
  openCancelModal.value = false

}

const handleClose = () => {
  clearLocalStorage();
  router.push('/dashboard/property')
  openCancelModal.value = false
}

function updateQueryParams() {
  router.push({
    query: {
      parentStep: activeParentStep.value,
      childStep:
        activeParentStep.value === 1
          ? basicPropertyInformationStep.value
          : activeParentStep.value === 2
          ? propertyDetailsStep.value
          : activeParentStep.value === 3
          ? visualsStep.value
          : finalizeStep.value,
    },
  });
}

const activeParentStep = ref(1);
const basicPropertyInformationStep = ref(1);
const propertyDetailsStep = ref(1);
const visualsStep = ref(1);
const finalizeStep = ref(1);

// function handleNextStep() {
//   if (activeParentStep.value === 1) {
//     if (basicPropertyInformationStep.value < 2) {
//       basicPropertyInformationStep.value += 1;
//     } else {
//       handleNextParentStep();
//     }
//   } else if (activeParentStep.value === 2) {
//     if (propertyDetailsStep.value < 2) {
//       propertyDetailsStep.value += 1;
//     } else {
//       handleNextParentStep();
//     }
//   } else if (activeParentStep.value === 3) {
//     if (visualsStep.value < 3) { // Ensure this is correctly checking for up to step 3
//       visualsStep.value += 1;
//     } else {
//       handleNextParentStep();
//     }
//   } else if (activeParentStep.value === 4) {
//     if (finalizeStep.value < 3) {
//       finalizeStep.value += 1;
//     } else {
//       // This means we've reached the last step of the final stage
//       router.push(`/dashboard/property/${route?.params?.id}/edit-preview`); // Adjust the route name/path as needed
//       return;
//     }
//   }

//   updateQueryParams();
// }

function handleNextStep() {
  if (activeParentStep.value === 1) {
    if (basicPropertyInformationStep.value < 2) {
      basicPropertyInformationStep.value += 1;
    } else {
      handleNextParentStep();
    }
  } else if (activeParentStep.value === 2) {
    if (propertyDetailsStep.value < 2) {
      propertyDetailsStep.value += 1;
    } else {
      handleNextParentStep();
    }
  } else if (activeParentStep.value === 3) {
    if (visualsStep.value < 3) {
      visualsStep.value += 1;
    } else {
      handleNextParentStep();
    }
  } else if (activeParentStep.value === 4) {
    if (finalizeStep.value < 3) {
      finalizeStep.value += 1;
    } else {
      // This means we've reached the last step of the final stage, switch to preview mode
      togglePreviewMode(true); // Instead of navigating to a new route, switch to preview mode
      return;
    }
  }

  updateQueryParams();
}

function handlePreviousStep() {
  if (activeParentStep.value === 1 && basicPropertyInformationStep.value > 1) {
    basicPropertyInformationStep.value -= 1;
  } else if (activeParentStep.value === 2 && propertyDetailsStep.value > 1) {
    propertyDetailsStep.value -= 1;
  } else if (activeParentStep.value === 3 && visualsStep.value > 1) {
    visualsStep.value -= 1;
  } else if (activeParentStep.value === 4 && finalizeStep.value > 1) {
    finalizeStep.value -= 1;
  } else {
    // Move back to the previous parent step if at the first child step
    if (activeParentStep.value > 1) {
      activeParentStep.value -= 1;
      
      // Ensure we land on the last child step of the previous parent step
      if (activeParentStep.value === 1) {
        basicPropertyInformationStep.value = 2;
      } else if (activeParentStep.value === 2) {
        propertyDetailsStep.value = 2;
      } else if (activeParentStep.value === 3) {
        visualsStep.value = 3; // Set this to 3 to avoid skipping the step
      } else if (activeParentStep.value === 4) {
        finalizeStep.value = 3;
      }
    }
  }
  updateQueryParams();
}

// function handlePreviousStep() {
//   if (activeParentStep.value === 1) {
//     if (basicPropertyInformationStep.value > 1) {
//       basicPropertyInformationStep.value -= 1;
//     }
//   } else if (activeParentStep.value === 2) {
//     if (propertyDetailsStep.value > 1) {
//       propertyDetailsStep.value -= 1;
//     }
//   } else if (activeParentStep.value === 3) {
//     if (visualsStep.value > 1) {
//       visualsStep.value -= 1;
//     }
//   } else if (activeParentStep.value === 4) {
//     if (finalizeStep.value > 1) {
//       finalizeStep.value -= 1;
//     }
//   }
// }

function handleNextParentStep() {
  if (activeParentStep.value < steps.value.length) {
    steps.value[activeParentStep.value - 1].completed = true;
    activeParentStep.value += 1;
    resetSubSteps();
  }
}

function handlePreviousParentStep() {
  if (activeParentStep.value > 1) {
    activeParentStep.value -= 1;
  }
}

// function handleStepClick(stepId: any) {
//   // Only allow navigation to previous steps or the current step
//   if (stepId <= activeParentStep.value) {
//     activeParentStep.value = stepId;
//     resetSubSteps();
//   }
// }
function handleStepClick(stepId: any) {
  // Allow navigation to any step
  activeParentStep.value = stepId;
  resetSubSteps();
}

function resetSubSteps() {
  if (activeParentStep.value === 2) {
    propertyDetailsStep.value = 1;
  } else if (activeParentStep.value === 3) {
    visualsStep.value = 1;
  } else if (activeParentStep.value === 4) {
    finalizeStep.value = 1;
  }
}

function handleSubmit() {
      editProperty();
}

const incomingData = ref({})

function handleBasicPropertyInformationFormData(data: any) {
  // handle the data emitted from the child component here
  // console.log('Data received from child component:', data)
  incomingData.value = data
  // sessionStorage.setItem('property', JSON.stringify(incomingData.value))
}

// const neighbouringLandmarksArray = ref([]) as any
// const handleSelectedAmenity = (item: any) => {
//   const result  = neighbouringLandmarksArray.value.push({
//         name: item.name,
//         type: item.type,
//         description: item.display_name,
//         longitude: item.lat,
//         latitude: item.lon,
//         address: item.display_name,
//   })
//   console.log()
//   payload.neighbouringLandmarks.value = result
// }

const neighbouringLandmarksArray = ref([]) as any;

const handleSelectedAmenity = (item: any) => {
  // Push the new object into the array
  neighbouringLandmarksArray.value.push({
    name: item.name,
    type: item.type,
    description: item.display_name,
    longitude: item.lon, // Corrected: lat and lon were swapped
    latitude: item.lat,  // Corrected: lat and lon were swapped
    address: item.display_name,
  });

  // Update payload with the current array
  payload.neighbouringLandmarks.value = neighbouringLandmarksArray.value;

  console.log(payload.neighbouringLandmarks.value); // To check the updated value
};

const handleLocationSearch = (data: any) => {
  payload.latitude.value = data.lat
  payload.longitude.value = data.lon
  payload.address.value = data.display_name
}

const handleCommonAreas = (data: any) => {
// console.log(data, 'sara')
// const storedData = sessionStorage.getItem('property')
// let propertyData = storedData ? JSON.parse(storedData) : {}

// Update the session storage with new location data
// propertyData = {
//   ...propertyData, // merge with existing data
//   commonAreas: data
// }

payload.commonAreas.value = data

// // Store the updated data back to session storage
// sessionStorage.setItem('property', JSON.stringify(propertyData))
}
const handlePropertyFurnished = (data: any) => {

// Retrieve existing session data from sessionStorage (if any)
// const storedData = sessionStorage.getItem('property')
// let propertyData = storedData ? JSON.parse(storedData) : {}

// // Update the session storage with new location data
// propertyData = {
//   ...propertyData, // merge with existing data
//   isFurnishedCommonArea: data
// }

// // Store the updated data back to session storage
// sessionStorage.setItem('property', JSON.stringify(propertyData))
payload.isFurnishedCommonArea.value = data

}

const roomsArray = ref([]) as any

const handleRoomData = (room: any) => {
  console.log("Room data received:", room);
  // Push or update the received room data in the array
  const roomIndex = roomsArray.value.findIndex(r => r.name === room.name);
  if (roomIndex !== -1) {
    roomsArray.value[roomIndex] = room;
  } else {
    roomsArray.value.push(room);
  }

  // console.log(roomsArray.value, 'room array')

//   const storedData = sessionStorage.getItem('property')
// let propertyData = storedData ? JSON.parse(storedData) : {}

// // Update the session storage with new location data
// propertyData = {
//   ...propertyData, // merge with existing data
//   rooms: roomsArray.value
// }

// // Store the updated data back to session storage
// sessionStorage.setItem('property', JSON.stringify(propertyData))

payload.rooms.value = roomsArray.value
};

const goToNextStep = () => {
  console.log("Moving to the next step...");
  // Add logic here for moving to the next step in the property creation flow
};

const handleUpdatedRules = (updatedRules: any) => {
payload.rules.value = updatedRules
}


const handleSaveAndExit = async () => {
 await savingProperty()
}


const handleQuestions = (questionsData: any) => {
  payload.questions.value = questionsData
}

const validateBasicPropertyInformationStep = () => {
  if (basicPropertyInformationStep.value === 1) {
    // Validate "Let's start with the basics" fields
    return (
      payload.name.value &&
      payload.description.value &&
      payload.houseTypeId.value &&
      payload.flooringTypeId.value &&
      payload.size.value &&
      payload.sizeUnit.value &&
      payload.bedroomCount.value &&
      payload.bathroomCount.value
    );
  } else if (basicPropertyInformationStep.value === 2) {
    // Validate "Details and Preferences" fields
    return (
      payload.address.value &&
      payload.longitude.value !== null &&
      payload.latitude.value !== null
    );
  }
  return true;
};

const validateDetailedPropertyInformationStep = () => {
  if (propertyDetailsStep.value === 1) {
    // Validate "Details about Common areas"
    return payload.commonAreas.value.length > 0;
  } else if (propertyDetailsStep.value === 2) {
    // Validate "Details about the private rooms"
    return payload.rooms.value.length > 0;
  }
  return true;
};

const validateAddVisualsStep = () => {
  if (visualsStep.value === 1) {
    // Validate "Upload images of the common area"
    return payload.images.value.length > 0;
  }
  return true;
};

const validateFinalizeListingStep = () => {
  if (finalizeStep.value === 1) {
    // Validate "Define house rules"
    return payload.rules.value.length > 0;
  }
  return true;
};

// Computed property to determine if the Next button should be disabled
const isNextButtonDisabled = computed(() => {
  if (activeParentStep.value === 1) {
    return !validateBasicPropertyInformationStep();
} else if (activeParentStep.value === 2) {
    return !validateDetailedPropertyInformationStep();
  } else if (activeParentStep.value === 3) {
    return !validateAddVisualsStep();
  } else if (activeParentStep.value === 4) {
    return !validateFinalizeListingStep();
  }
  return false;
});
</script>
