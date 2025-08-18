# React Admin Panel for Supabase Products

This is a simple but complete React application for managing a `products` table in a Supabase database.

## Features

*   List all products
*   Add a new product
*   Edit an existing product
*   Delete a product

## Setup

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up Supabase environment variables:**

    Create a `.env` file in the root of the project and add your Supabase URL and Anon Key:

    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

    You can get these from your Supabase project settings.

3.  **Set up your `products` table in Supabase:**

    Create a table named `products` with the following columns:

    *   `id` (uuid, primary key)
    *   `name` (text)
    *   `description` (text)
    *   `price` (numeric)
    *   `created_at` (timestamptz, default value `now()`)

4.  **Run the application:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.