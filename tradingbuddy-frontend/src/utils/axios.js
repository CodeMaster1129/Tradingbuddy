import axios from 'axios';

const axiosInstance = axios.create({
  timeout: 1000000, // Set a timeout as needed
});

// Retry Interceptor
// axiosInstance.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
//   const config = err.config;
//   // If config does not exist or the retry option is not set, reject
//   if (!config || !config.retry) return Promise.reject(err);
  
//   // Set the variable for keeping track of the retry count
//   config.__retryCount = config.__retryCount || 0;
  
//   // Check if we've maxed out the total number of retries
//   if (config.__retryCount >= config.retry) {
//     // Reject with the error
//     return Promise.reject(err);
//   }
  
//   // Increase the retry count
//   config.__retryCount += 1;
  
//   // Create new promise to handle exponential backoff
//   const backoff = new Promise(function(resolve) {
//     setTimeout(() => {
//       resolve();
//     }, config.retryDelay || 1000); // Here you can customize your backoff algorithm
//   });
  
//   // Return the promise in which recalls axios to retry the request
//   return backoff.then(function() {
//     return axiosInstance(config);
//   });
// });


export default axiosInstance;
// Usage with retry config
// axiosInstance.get('/test', {
//   retry: 3,         // Number of retry attempts
//   retryDelay: 2000  // Wait between retries
// })
// .then(response => {
//   console.log(response.data);
// })
// .catch(error => {
//   console.error('Failed to fetch data:', error.message);
// });
