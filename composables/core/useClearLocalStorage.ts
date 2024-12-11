// import { useRouter } from 'vue-router';

// export function useClearLocalStorage() {
//   const router = useRouter();

//   const clearLocalStorage = () => {
//     try {
//       // Fetch user and token from localStorage before clearing
//       const user = localStorage.getItem('user');
//       const token = localStorage.getItem('token');

//       // Clear specific items or reset the required ones
//       localStorage.removeItem('someOtherData'); // Example for specific items
//       localStorage.removeItem('unnecessaryKey'); // Remove more as needed

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
      // Fetch user and token from localStorage before clearing
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      // Clear all items from localStorage
      localStorage.clear();
      // window.location.reload()
      // window.relo

      // Restore the user and token if they exist
      if (user) {
        localStorage.setItem('user', user);
      }
      if (token) {
        localStorage.setItem('token', token);
      }

      // Safely redirect the user
      if (router && typeof router.push === 'function') {
        router.push('/dashboard/property');
      } else {
        console.error('Router is not available or push is not a function');
      }
    } catch (error) {
      console.error('An error occurred while clearing localStorage:', error.message);
    }
  };

  return { clearLocalStorage };
}
