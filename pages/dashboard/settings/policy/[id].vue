<!-- pages/terms.vue -->
<template>
        <Layout class="">
            <template #header-content>
                <div class="flex items-center justify-between px-4 md:px-8 w-full">
    <!-- Back Button -->
<div class="flex  items-center gap-x-3">
    <button
      class="flex items-center py-3 rounded-lg px-6 gap-2 text-gray-600 bg-[#F9FAFB]"
      @click="goBack"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
      <span class="text-sm font-medium md:text-base">Back</span>
    </button>

    <!-- Title -->
    <h1 class="text-lg hidden lg:block font-medium text-[#1D2739] md:text-lg">
      Terms & Conditions
    </h1>

</div>
    <!-- Action Buttons -->
    <div class="flex items-center gap-2">
      <span
        class="px-3 py-1 text-sm font-medium text-[#292929] bg-gray-100 rounded-full md:text-base"
      >
        Draft
      </span>
      <button
        class="px-4 py-2 text-sm font-medium text-[#292929] bg-[#F0F2F5] border-[0.5px] border-gray-100 rounded-lg md:text-base"
      >
        Delete
      </button>
      <button
        class="px-4 py-2 text-sm font-medium text-white bg-[#292929] rounded-lg hover:bg-gray-800 md:text-base"
      >
        Edit
      </button>
    </div>
  </div>
            </template>
      <div class="max-w-4xl mx-auto px-4">
        <main class="space-y-8">
          <!-- Title section -->
          <div class="text-center space-y-4">
            <span class="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
              Tenants
            </span>
            <p class="text-gray-600 text-sm">Current as of 20 Jan 2022</p>
            <h1 class="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
            <p class="text-gray-600">
              Your privacy is important to us at Untitled. We respect your privacy regarding any
              information we may collect from you across our website.
            </p>
          </div>
  
          <!-- Content sections -->
          <section class="space-y-6">
            <div class="space-y-4">
              <h2 class="text-lg font-bold text-gray-900">Introduction</h2>
              <p class="text-gray-600">
                Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus
                eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere
                vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.
              </p>
            </div>
  
            <div class="space-y-4">
              <h2 class="text-lg font-bold text-gray-900">What information do we collect?</h2>
              <p class="text-gray-600">
                Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisi vitae. In aliquet
                pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae
                malesuada fringilla.
              </p>
            </div>
  
            <div class="space-y-4">
              <h2 class="text-lg font-bold text-gray-900">How do we use your information?</h2>
              <p class="text-gray-600">
                Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisi vitae. In aliquet
                pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae
                malesuada fringilla.
              </p>
            </div>
  
            <div class="space-y-4">
              <h2 class="text-lg font-bold text-gray-900">Do we use cookies and other tracking technologies?</h2>
              <p class="text-gray-600">
                Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor.
                Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac
                pellentesque ac.
              </p>
            </div>
  
            <div class="space-y-4">
              <h2 class="text-lg font-bold text-gray-900">How long do we keep your information?</h2>
              <p class="text-gray-600">
                Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor.
                Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac
                pellentesque ac.
              </p>
            </div>
  
            <div class="space-y-4">
              <h2 class="text-lg font-bold text-gray-900">What are your privacy rights?</h2>
              <p class="text-gray-600">
                Pharetra morbi libero id aliquam elit massa integer tellus. Quis felis aliquam ullamcorper porttitor.
                Pulvinar ullamcorper sit dictumst ut eget a, elementum eu. Maecenas est morbi mattis id in ac
                pellentesque ac.
              </p>
            </div>
  
            <div class="space-y-4">
              <h2 class="text-lg font-bold text-gray-900">How can you contact us about this policy?</h2>
              <p class="text-gray-600 mb-4">
                Sagittis et eu at elementum, quis in. Proin praesent volutpat egestas sociis sit lorem nunc nunc sit.
                Eget diam curabitur mi ac. Auctor rutrum lacus malesuada massa ornare et. Vulputate consectetur
                ac ultrices at diam dui eget fringilla tincidunt. Arcu sit dignissim massa erat cursus vulputate gravida
                id. Sed quis auctor vulputate hac elementum gravida cursus dis.
              </p>
              <ol class="list-decimal list-inside space-y-2 text-gray-600 pl-4">
                <li>Lectus id duis vitae porttitor enim gravida morbi.</li>
                <li>Eu turpis posuere semper feugiat volutpat elit, ultrices suspendisse. Auctor vel in vitae placerat.</li>
                <li>Suspendisse maecenas ac donec scelerisque diam sed est duis purus.</li>
              </ol>
            </div>
          </section>
        </main>
      </div>
</Layout>
  </template>
  
  <script setup lang="ts">
    import Layout from '@/layouts/dashboard.vue';
    const goBack = () => {
  // Navigate back in history
  window.history.back();
};
  // Add any required functionality here
  </script>