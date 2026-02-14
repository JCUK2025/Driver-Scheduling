# Driver Scheduling - Delivery Areas Management

A fully functional, production-ready web application for managing delivery areas with an interactive UK postcode map.

![Driver Scheduling App](https://github.com/user-attachments/assets/4035306e-eb48-4a9d-8661-4773741882b4)

## 🚀 Features

✅ **Interactive UK Postcode Map**
- Visual postcode selection with click-to-select functionality
- 44 realistic UK postcodes with coordinates
- County and country border overlays
- Zoom and pan controls
- Real-time postcode highlighting
- Search functionality for postcodes

✅ **Delivery Area Management**
- Create delivery areas with custom names and colors
- Select postcodes visually from the interactive map
- Edit existing delivery areas
- Delete delivery areas with confirmation
- View all delivery areas in a list
- Data persists in MongoDB

✅ **Professional UI/UX**
- Responsive design for desktop, tablet, and mobile
- Clean, modern interface with gradient headers
- Loading states and error handling
- Success messages for user actions
- Color-coded delivery areas

## 📋 Requirements

- **Node.js** >= 14.0.0
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/JCUK2025/Driver-Scheduling.git
cd Driver-Scheduling
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service:
   ```bash
   # On Linux/Mac
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update the `.env` file with your connection string

### 4. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and set your MongoDB connection string:
```
MONGODB_URI=mongodb://localhost:27017/driver-scheduling
PORT=5000
```

## 🎯 Running the Application

### Development Mode
```bash
npm start
```

This will:
1. Build the React frontend with Webpack
2. Start the Express backend server
3. Open the application at `http://localhost:5000`

### Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

## 📁 Project Structure

```
Driver-Scheduling/
├── public/
│   ├── index.html          # HTML entry point
│   └── bundle.js           # Built React application (generated)
├── src/
│   ├── components/
│   │   ├── PostcodeMap.jsx           # Interactive map component
│   │   ├── PostcodeMap.css           # Map styling
│   │   ├── DeliveryAreaForm.jsx      # Form for creating/editing areas
│   │   ├── DeliveryAreaForm.css      # Form styling
│   │   ├── DeliveryAreasManager.jsx  # Main manager component
│   │   └── DeliveryAreasManager.css  # Manager styling
│   ├── data/
│   │   ├── uk-postcodes.geojson      # UK postcode data
│   │   └── uk-boundaries.geojson     # County/country boundaries
│   ├── models/
│   │   └── DeliveryArea.js           # Mongoose schema
│   ├── controllers/
│   │   └── deliveryAreaController.js # API controllers
│   ├── routes/
│   │   └── deliveryAreaRoutes.js     # API routes
│   ├── App.jsx              # Main React component
│   ├── App.css              # App styling
│   ├── index.js             # React entry point
│   └── index.css            # Global styling
├── server.js                # Express server
├── webpack.config.js        # Webpack configuration
├── package.json             # Dependencies and scripts
└── .env.example             # Example environment variables
```

## 🗺️ How to Use

### Creating a Delivery Area

1. Click the **"Create New Delivery Area"** button
2. The form appears with an integrated interactive map
3. **Select postcodes** by clicking on the map markers
   - Selected postcodes are highlighted in your chosen color
   - They also appear in the selected postcodes list
4. Enter a **name** for the delivery area
5. Choose a **color** using the color picker
6. Click **"Create Area"** to save

### Editing a Delivery Area

1. Find the delivery area in the list
2. Click the **"Edit"** button
3. Update the name, color, or selected postcodes
4. Click **"Update Area"** to save changes

### Deleting a Delivery Area

1. Find the delivery area in the list
2. Click the **"Delete"** button
3. Confirm the deletion when prompted

## 🔌 API Endpoints

The application provides the following REST API endpoints:

- `GET /api/delivery-areas` - Get all delivery areas
- `POST /api/delivery-areas` - Create a new delivery area
- `GET /api/delivery-areas/:id` - Get a specific delivery area
- `PUT /api/delivery-areas/:id` - Update a delivery area
- `DELETE /api/delivery-areas/:id` - Delete a delivery area

## 🛠️ Technology Stack

- **Frontend:**
  - React 17
  - Leaflet.js 1.9 (mapping library)
  - React-Leaflet 3.2
  - GeoJSON for geographic data
  - Webpack 5 (bundling)
  - Babel (transpiling)

- **Backend:**
  - Node.js
  - Express.js 4
  - MongoDB with Mongoose 5
  - CORS enabled

- **Map Data:**
  - OpenStreetMap tiles
  - Custom UK postcode GeoJSON data
  - UK boundaries GeoJSON data

## ⚠️ Troubleshooting

### Database Connection Failed
If you see:
```
⚠ Database connection failed
⚠ Running without database - API operations will fail
```

**Solution:**
1. Ensure MongoDB is installed and running
2. Check your `MONGODB_URI` in `.env` is correct
3. For local MongoDB, try: `mongodb://localhost:27017/driver-scheduling`
4. For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
If port 5000 is already in use:
1. Change `PORT` in `.env` to a different port (e.g., 3000, 8000)
2. Restart the application

### Build Errors
If webpack build fails:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📝 Development Scripts

```bash
# Build production bundle
npm run build

# Start server only (without rebuilding)
npm run server

# Development mode with watch (requires concurrently)
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Credits

- **OpenStreetMap** for map tiles
- **Leaflet.js** for the mapping library
- **React** for the frontend framework
- **MongoDB** for the database