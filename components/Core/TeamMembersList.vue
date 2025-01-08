<template>
  <div class="max-w-3xl mx-auto p-4">
    <!-- Search and controls header -->
    <div class="flex items-center gap-4 mb-6">
      <div class="flex-1 relative">
        <input 
          type="text" 
          placeholder="Search" 
          class="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-gray-700"
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-3 top-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      
      <button 
        @click="toggleMembersList"
        class="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      <button class="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </button>
    </div>

    <!-- Team members list -->
    <div class="space-y-4">
      <div v-for="member in members" :key="member.id" class="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <div class="flex items-center gap-4">
          <img :src="member.avatar" :alt="member.name" class="w-12 h-12 rounded-full object-cover" />
          <div>
            <h3 class="font-medium text-gray-900">{{ member.name }}</h3>
            <p class="text-gray-500 text-sm">{{ member.role }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-gray-500">{{ member.date }}</span>
          <span v-if="member.status === 'checked'" class="text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span v-if="member.status === 'online'" class="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
        </div>
      </div>
    </div>

    <!-- Members popover -->
    <div v-if="showMembersList" class="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4" @click="showMembersList = false">
      <div class="bg-white rounded-xl p-4 w-full max-w-md" @click.stop>
        <div class="space-y-4">
          <div v-for="member in availableMembers" :key="member.id" class="flex items-center gap-4">
            <img :src="member.avatar" :alt="member.name" class="w-12 h-12 rounded-full object-cover" />
            <div>
              <h3 class="font-medium text-gray-900">{{ member.name }}</h3>
              <p class="text-gray-500 text-sm">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showMembersList = ref(false)

const members: Member[] = [
  {
    id: '1',
    name: 'John W.',
    role: "I'm inte",
    avatar: '/avatars/john.jpg',
    date: '08 Feb',
  },
  {
    id: '2',
    name: 'Jason C',
    role: "I will se",
    avatar: '/avatars/jason.jpg',
    date: '08 Feb',
  },
  {
    id: '3',
    name: 'John W',
    role: "I'm inte",
    avatar: '/avatars/john-dark.jpg',
    date: '08 Feb',
    status: 'checked'
  }
]

const availableMembers: Member[] = [
  {
    id: '4',
    name: 'Jeffery McKenzie',
    role: 'Super admin',
    avatar: '/avatars/jeffery.jpg'
  },
  {
    id: '5',
    name: 'Susie Roob',
    role: 'Property manager',
    avatar: '/avatars/susie.jpg'
  },
  {
    id: '6',
    name: 'Lonnie Wisoky',
    role: 'Property manager',
    avatar: '/avatars/lonnie.jpg'
  },
  {
    id: '7',
    name: 'Stacey Towne',
    role: 'Property manager',
    avatar: '/avatars/stacey.jpg'
  },
  {
    id: '8',
    name: 'John Walton',
    role: 'Property manager',
    avatar: '/avatars/john-walton.jpg'
  }
]

const toggleMembersList = () => {
  showMembersList.value = !showMembersList.value
}
</script>