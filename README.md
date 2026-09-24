# Product Admin Dashboard

A simple admin dashboard built with Next.js, React, Tailwind CSS, and Axios for managing products from the DummyJSON API.

## Setup Steps

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
5. Log in with the following credentials:
   - **Username**: `emilys`
   - **Password**: `emilyspass`

## What's Finished

- **Authentication**: Login page with error handling, storing token securely, and protecting routes.
- **Product List**: Responsive table for desktop and cards for mobile.
- **Pagination**: Fully functional pagination (page size switching, next/prev, counts) synced with the URL.
- **Search**: Debounced search input that resets pagination.
- **Filter & Sort**: Filter by category and sort by various fields (Price, Title, Rating), synced with the URL.
- **Product Details**: A dedicated page for product details, complete with images, description, pricing, and reviews. Includes 404 handling.
- **CRUD Operations**: Mocked Add, Edit, and Delete operations using a Context provider to show visual changes even though the backend API is read-only.
- **Edge Cases & Resilience**: 
  - `AbortController` used in the custom `useProducts` fetch hook to prevent data race conditions when typing fast.
  - Form submissions are blocked while loading to prevent duplicate requests.
  - URL parameters are validated (e.g., malformed `?page=abc` is ignored and gracefully fallback to page 1).

## Implementation Notes & Choices

- **Custom Fetch Logic vs Libraries**: As requested, React Query and SWR were not used. Instead, a custom `useProducts` hook was built using standard React state and `AbortController` to handle stale data resulting from rapid sequential requests (like fast typing in search).
- **Search and Filter Conflict**: The DummyJSON API doesn't support searching and filtering by category simultaneously. To solve this intuitively, the UI makes these inputs mutually exclusive. If a user types a search term, the category filter is cleared and disabled, and vice-versa. A small note is shown in the UI when this happens to ensure clear communication to the user.
- **Mock CRUD**: Since `dummyjson.com` doesn't actually save state changes across requests, I implemented a `ProductContext` wrapper. It intercepts the data from the API and overlays local state (`addedProducts`, `editedProducts`, and `deletedIds`) onto the list. This creates a convincing illusion that the products are being modified, demonstrating complex state management without needing a real database.
- **URL Synchronization**: A custom `useUrlState` hook acts as the single source of truth for dashboard parameters, making the current view easily shareable via URL.

## AI Assistance Note
AI was used to scaffold the architecture, generate boilerplate code (like the Tailwind layouts and basic API bindings), and assist in structuring the intricate `AbortController` logic for the custom data fetching hook to avoid race conditions. Working with AI helped rapidly build out the context provider that overlays the mock CRUD data on top of the read-only DummyJSON API responses.
