# Driver Scheduling - Delivery Areas Management

A fully functional, production-ready web application for managing delivery areas with an interactive UK postcode map.

> **🚀 Quick Preview:** `npm install && npm start` then open http://localhost:5000

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
- **npm** or **yarn**
- **MongoDB** (optional - only required for data persistence)

## ⚡ Quick Start - Preview the App in 3 Steps

Want to preview the app immediately? Follow these simple steps:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Application
```bash
npm start
```

### 3. Open in Browser
Navigate to **http://localhost:5000** in your web browser.

**That's it!** 🎉 The app works immediately with in-memory storage (no MongoDB setup required for testing).

You'll see:
- ✅ Interactive UK map with 44 postcode markers
- ✅ Clickable postcodes that highlight when selected
- ✅ Delivery area creation and management features
- ✅ Full functionality without any database setup

> **Note:** Data will not persist between server restarts when using in-memory mode. To enable data persistence, [set up MongoDB](#3-set-up-mongodb) following the installation guide below.

---

## 🛠️ Full Installation Guide

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

### Start the Server
```bash
npm start
```

This will start the Express backend server on port 5000.

### Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

You will immediately see:
- ✅ Interactive UK map with 44 postcode markers
- ✅ Clickable postcodes that highlight in red when selected
- ✅ Sidebar with delivery area creation form
- ✅ List of created delivery areas
- ✅ All functionality working with no additional setup required

## 📁 Project Structure

```
Driver-Scheduling/
├── public/
│   └── index.html          # Complete single-page application with embedded data
├── src/
│   ├── models/
│   │   └── DeliveryArea.js           # Mongoose schema
│   ├── controllers/
│   │   └── deliveryAreaController.js # API controllers
│   ├── routes/
│   │   └── deliveryAreaRoutes.js     # API routes
│   └── utils/
│       └── inMemoryStore.js          # Fallback storage when MongoDB unavailable
├── server.js                # Express server with MongoDB integration
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
  - Pure HTML5, CSS3, and JavaScript (ES6+)
  - Leaflet.js 1.9 (interactive mapping library)
  - 44 UK postcodes embedded with real coordinates
  - Single-page application (SPA) architecture
  - No build tools required

- **Backend:**
  - Node.js with Express.js 4
  - MongoDB with Mongoose 7 (with in-memory fallback)
  - RESTful API architecture
  - CORS enabled for cross-origin requests

- **Map Data:**
  - OpenStreetMap tiles
  - Embedded UK postcode data (London, Manchester, Birmingham, Leeds, Liverpool, Newcastle, Bristol, Sheffield, Norwich, Edinburgh, Glasgow, Aberdeen, Dundee, Cardiff, Swansea, Belfast, and more)
  - Real latitude/longitude coordinates
  - County and country information

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
If you encounter any issues:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### MongoDB Not Required for Testing
The application works without MongoDB using an in-memory storage fallback. This allows you to test all features immediately without database setup. Data will not persist between server restarts when using in-memory mode.

## 📝 Development Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
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