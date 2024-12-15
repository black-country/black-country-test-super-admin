// import { useRouter } from 'vue-router';

// export function useClearLocalStorage() {
//   const router = useRouter();

//   const clearLocalStorage = () => {
//     try {
//       // Fetch user and token from localStorage before clearing
//       const user = localStorage.getItem('user');
//       const token = localStorage.getItem('token');

//       // Clear all items from localStorage
//       localStorage.clear();
//       // window.location.reload()
//       // window.relo

//       // Restore the user and token if they exist
//       if (user) {
//         localStorage.setItem('user', user);
//       }
//       if (token) {
//         localStorage.setItem('token', token);
//       }

//       // Safely redirect the user
//       if (router && typeof router.push === 'function') {
//         router.push('/dashboard/property');
//       } else {
//         console.error('Router is not available or push is not a function');
//       }
//     } catch (error) {
//       console.error('An error occurred while clearing localStorage:', error.message);
//     }
//   };

//   return { clearLocalStorage };
// }


import { useRouter } from 'vue-router';

export function useClearLocalStorage() {
  const router = useRouter();

  const clearLocalStorage = () => {
    try {
      // Store authentication data
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      // Get all keys from localStorage
      const keys = Object.keys(localStorage);
      
      // Remove all items except user and token
      keys.forEach(key => {
        if (key !== 'user' && key !== 'token') {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage as well since form data might be stored there
      sessionStorage.clear();

      // Restore authentication data
      if (user) {
        localStorage.setItem('user', user);
      }
      if (token) {
        localStorage.setItem('token', token);
      }

      // Clear all form elements on the page
      const forms = document.querySelectorAll('form');
      forms.forEach(form => form.reset());

      // Force clear any vuex/pinia store form states
      // You might need to call your store's reset action here if you have one
      
      // Navigate to the dashboard
      if (router && typeof router.push === 'function') {
        router.push('/dashboard/property').then(() => {
          // Force a hard reload after navigation to ensure clean state
          window.location.reload();
        });
      } else {
        console.error('Router is not available or push is not a function');
        // Fallback to direct reload if router fails
        window.location.reload();
      }
    } catch (error) {
      console.error('An error occurred while clearing storage:', error);
      // Attempt a force reload as fallback
      window.location.reload();
    }
  };

  return { clearLocalStorage };
}