// /**
//  * API service for making HTTP requests
//  */

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// interface RequestOptions extends RequestInit {
//   params?: Record<string, string>;
// }

// /**
//  * Make a request to the API
//  */
// async function request<T>(
//   endpoint: string,
//   options: RequestOptions = {}
// ): Promise<T> {
//   const { params, ...init } = options;

//   // Add query parameters if provided
//   const url = new URL(`${API_URL}${endpoint}`);
//   if (params) {
//     Object.entries(params).forEach(([key, value]) => {
//       url.searchParams.append(key, value);
//     });
//   }

//   // Set default headers
//   const headers = new Headers(init.headers);
//   if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
//     headers.append("Content-Type", "application/json");
//   }

//   // Make the request
//   const response = await fetch(url.toString(), {
//     ...init,
//     headers,
//   });

//   // Handle errors
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({
//       message: "An error occurred while fetching the data.",
//     }));

//     throw new Error(error.message || `API error: ${response.status}`);
//   }

//   // Parse the response
//   return response.json();
// }

// /**
//  * API methods
//  */
// export const api = {
//   get: <T>(endpoint: string, options?: RequestOptions) =>
//     request<T>(endpoint, { method: "GET", ...options }),

//   post: <T, D = Record<string, unknown>>(
//     endpoint: string,
//     data: D,
//     options?: RequestOptions
//   ) =>
//     request<T>(endpoint, {
//       method: "POST",
//       body: JSON.stringify(data),
//       ...options,
//     }),

//   put: <T, D = Record<string, unknown>>(
//     endpoint: string,
//     data: D,
//     options?: RequestOptions
//   ) =>
//     request<T>(endpoint, {
//       method: "PUT",
//       body: JSON.stringify(data),
//       ...options,
//     }),

//   patch: <T, D = Record<string, unknown>>(
//     endpoint: string,
//     data: D,
//     options?: RequestOptions
//   ) =>
//     request<T>(endpoint, {
//       method: "PATCH",
//       body: JSON.stringify(data),
//       ...options,
//     }),

//   delete: <T>(endpoint: string, options?: RequestOptions) =>
//     request<T>(endpoint, { method: "DELETE", ...options }),
// };
