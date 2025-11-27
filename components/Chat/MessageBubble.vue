<template>
  <div :class="['flex mb-3', isMine ? 'justify-end' : 'justify-start']">
    <div
      :class="[
        'max-w-[70%] rounded-2xl p-3 break-words',
        isMine ? 'bg-[#91D6A8] rounded-br-sm' : 'bg-[#EBE5E0] rounded-bl-sm'
      ]">
      
      <!-- File message -->
      <div v-if="parsedContent.type === 'file' && parsedContent.file">
        <!-- Image -->
        <div v-if="isImage && !imageError">
          <img
            :src="parsedContent.file.url"
            :alt="parsedContent.file.fileName || 'Image'"
            class="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
            loading="lazy"
            @error="imageError = true"
            @click="openImage(parsedContent.file.url)"
          />
        </div>

        <!-- PDF or other files -->
        <div v-else class="flex items-center gap-3 p-2 bg-white/30 rounded">
          <div class="flex-shrink-0 w-10 h-10 bg-white/50 rounded flex items-center justify-center">
            <svg v-if="isPDF" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6M10 12h4M10 16h4"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/>
              <path d="M13 2v7h7"/>
            </svg>
          </div>
          
          <div class="flex-1 min-w-0">
            <p class="text-xs font-medium text-gray-700 truncate">
              {{ parsedContent.file.fileName || 'File' }}
            </p>
            <a
              :href="parsedContent.file.url"
              target="_blank"
              class="text-xs text-blue-600 hover:underline">
              {{ isPDF ? 'Open PDF' : 'Download' }}
            </a>
          </div>
        </div>

        <!-- Caption for file -->
        <p v-if="parsedContent.message" class="text-sm text-gray-800 mt-2">
          {{ parsedContent.message }}
        </p>
      </div>

      <!-- Text message -->
      <p v-else class="text-sm text-gray-800 whitespace-pre-wrap">
        {{ parsedContent.message }}
      </p>

      <!-- Message footer -->
      <div class="flex items-center justify-end gap-1 mt-1">
        <span class="text-xs text-gray-600">
          {{ formatTime(message.createdAt) }}
        </span>
        
        <!-- Status indicators for sent messages -->
        <template v-if="isMine">
          <!-- Sending -->
          <svg v-if="message.status === 'sending'" class="w-4 h-4 text-gray-500 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          
          <!-- Sent -->
          <svg v-else-if="message.status === 'sent'" class="w-4 h-4 text-gray-600" viewBox="0 0 16 16" fill="none">
            <path d="M2 8l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <!-- Read -->
          <svg v-else-if="message.readAt" class="w-4 h-4 text-green-600" viewBox="0 0 16 16" fill="none">
            <path d="M2 8l2 2 4-4M6 10l2 2 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          
          <!-- Error -->
          <button
            v-else-if="message.status === 'error'"
            @click="$emit('retry', message.id)"
            class="text-red-500 hover:text-red-700"
            title="Click to retry">
            <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2"/>
              <path d="M8 4v4M8 10h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import moment from 'moment';

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isMine: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['retry']);

const imageError = ref(false);

const parsedContent = computed(() => {
  try {
    const parsed = JSON.parse(props.message.content);
    if (parsed.type === 'file' && parsed.file?.url) {
      return parsed;
    }
    return { type: 'text', message: props.message.content };
  } catch {
    return { type: 'text', message: props.message.content };
  }
});

const isImage = computed(() => {
  if (parsedContent.value.type !== 'file') return false;
  const mime = parsedContent.value.file?.mimetype || '';
  const url = parsedContent.value.file?.url || '';
  const ext = url.split('.').pop()?.toLowerCase();
  return mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
});

const isPDF = computed(() => {
  if (parsedContent.value.type !== 'file') return false;
  const mime = parsedContent.value.file?.mimetype || '';
  const url = parsedContent.value.file?.url || '';
  return mime === 'application/pdf' || url.toLowerCase().endsWith('.pdf');
});

const formatTime = (dateString: string) => {
  return moment(dateString).format('h:mm A');
};

const openImage = (url: string) => {
  window.open(url, '_blank');
};
</script>