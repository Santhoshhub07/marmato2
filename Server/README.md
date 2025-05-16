# Marmato Food Server

A simple REST API for managing food orders using Node.js, Express, and MongoDB.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your MongoDB connection string and other configuration values.
4. Start the server:
   ```
   npm start
   ```

## Environment Variables

The following environment variables are used:

- `PORT`: The port on which the server will run (default: 3001)
- `MONGODB_URI`: MongoDB connection string
- `NODE_ENV`: Environment (development, production, etc.)
- `CORS_ORIGIN`: Allowed origin for CORS (e.g., http://localhost:5173)
- `SERVER_URL`: The URL of the server for generating image URLs (e.g., http://localhost:3001)

## API Endpoints

- `GET /order`: Get all orders
- `POST /order`: Create a new order
- `PUT /order`: Update an existing order
- `DELETE /order`: Delete an order

## Order Schema

- `name`: String (required)
- `phone`: String (required)
- `city`: String (required)
- `pincode`: String (required)
- `food`: String (required)
- `photoPath`: String (required) - Path to the uploaded image file
- `photoUrl`: Virtual field - Full URL to the image

## File Uploads

- Images are stored in the `uploads` directory
- Maximum file size: 5MB
- Only image files are accepted
- Files are served from the `/uploads` endpoint
- When an order is deleted, its associated image is also deleted
