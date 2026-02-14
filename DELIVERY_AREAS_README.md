# Delivery Areas Management System

## Overview
This system provides a complete solution for managing delivery areas with custom names, colors, and postcodes.

## Features Implemented

### Backend (Express.js + MongoDB)

#### 1. Database Model (`src/models/DeliveryArea.js`)
- **Fields:**
  - `name`: String (required, trimmed)
  - `colour`: String (required, validated hex code, default: #3498db)
  - `postcodes`: Array of Strings (required, minimum 1 item)
  - `createdAt`: Date (auto-generated)
  - `updatedAt`: Date (auto-updated)

- **Validation:**
  - Name cannot be empty
  - Colour must be valid hex code (#XXXXXX)
  - At least one postcode required
  - Postcodes automatically converted to uppercase
  - Duplicate postcodes automatically removed

#### 2. Controller (`src/controllers/deliveryAreaController.js`)
- **Functions:**
  - `createDeliveryArea`: Create new delivery area
  - `getAllDeliveryAreas`: Get all areas (sorted by creation date)
  - `getDeliveryAreaById`: Get single area by ID
  - `updateDeliveryArea`: Update existing area
  - `deleteDeliveryArea`: Delete area

- **Error Handling:**
  - 400: Validation errors
  - 404: Area not found
  - 500: Server errors

#### 3. Routes (`src/routes/deliveryAreaRoutes.js`)
- **Endpoints:**
  - `POST /api/delivery-areas` - Create area
  - `GET /api/delivery-areas` - List all areas
  - `GET /api/delivery-areas/:id` - Get one area
  - `PUT /api/delivery-areas/:id` - Update area
  - `DELETE /api/delivery-areas/:id` - Delete area

#### 4. Server Configuration (`server.js`)
- Updated to include delivery area routes
- MongoDB connection with environment variable support
- Default connection: `mongodb://localhost:27017/driver-scheduling`

### Frontend (React 17)

#### 1. DeliveryAreaForm Component (`src/components/DeliveryAreaForm.jsx`)
- **Features:**
  - Create/Edit modes
  - Real-time validation
  - Color picker with hex code input
  - Dynamic postcode management
  - Loading states
  - Error messages

- **Validation:**
  - Name required
  - Valid hex color required
  - At least one postcode required
  - Duplicate postcodes prevented

#### 2. DeliveryAreasManager Component (`src/components/DeliveryAreasManager.jsx`)
- **Features:**
  - Grid view of all delivery areas
  - Create new area button
  - Edit area (inline form)
  - Delete with confirmation modal
  - Success/error notifications
  - Loading states
  - Empty state message

- **User Interactions:**
  - Click "Create New Area" to show form
  - Edit button (✎) to edit area
  - Delete button (🗑) to delete with confirmation
  - Each area displays color indicator and postcodes

#### 3. Styling
- **DeliveryAreaForm.css**: Professional form styling
- **DeliveryAreasManager.css**: Card-based grid layout
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Color Palette:**
  - Primary: #3498db (blue)
  - Success: #27ae60 (green)
  - Danger: #e74c3c (red)
  - Secondary: #95a5a6 (gray)

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```bash
MONGODB_URI=mongodb://localhost:27017/driver-scheduling
PORT=3000
```

### 3. Start MongoDB
Ensure MongoDB is running:
```bash
mongod
```

### 4. Start Server
```bash
npm start
```

The server will run on `http://localhost:3000`

## API Usage Examples

### Create Delivery Area
```bash
curl -X POST http://localhost:3000/api/delivery-areas \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Norwich",
    "colour": "#3498db",
    "postcodes": ["NR1", "NR2", "NR3"]
  }'
```

### Get All Delivery Areas
```bash
curl http://localhost:3000/api/delivery-areas
```

### Get Single Delivery Area
```bash
curl http://localhost:3000/api/delivery-areas/{id}
```

### Update Delivery Area
```bash
curl -X PUT http://localhost:3000/api/delivery-areas/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Norwich Central",
    "colour": "#2980b9",
    "postcodes": ["NR1", "NR2", "NR3", "NR4"]
  }'
```

### Delete Delivery Area
```bash
curl -X DELETE http://localhost:3000/api/delivery-areas/{id}
```

## Frontend Integration

### Using DeliveryAreasManager
```jsx
import React from 'react';
import DeliveryAreasManager from './components/DeliveryAreasManager';

function App() {
  return (
    <div className="App">
      <DeliveryAreasManager />
    </div>
  );
}

export default App;
```

### Using DeliveryAreaForm Standalone
```jsx
import React from 'react';
import DeliveryAreaForm from './components/DeliveryAreaForm';

function MyComponent() {
  const handleSubmit = async (formData) => {
    // Handle form submission
    console.log(formData);
  };

  const handleCancel = () => {
    // Handle cancel
    console.log('Cancelled');
  };

  return (
    <DeliveryAreaForm 
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      mode="create"
    />
  );
}
```

## Data Validation

### Backend Validation
- Mongoose schema validation
- Custom validators for hex colors
- Pre-save hooks for data normalization

### Frontend Validation
- Real-time validation on form fields
- Visual feedback for errors
- Prevents duplicate postcodes
- Auto-converts postcodes to uppercase

## Security Considerations

1. **Input Validation**: All inputs validated on both frontend and backend
2. **Error Handling**: Sensitive error details not exposed to client
3. **MongoDB Injection Prevention**: Using Mongoose parameterized queries
4. **XSS Prevention**: React automatically escapes rendered content

## Testing

### Backend Tests
Run model validation tests:
```bash
node /tmp/test-model.js
```

Expected output:
```
✓ DeliveryArea model loaded successfully
✓ Model validation works correctly
✓ Colour validation works (rejects invalid hex codes)
✓ Postcodes validation works (requires at least one postcode)
✓ All model validations passed!
```

### Frontend Tests
No automated tests currently implemented. Manual testing recommended:
1. Create delivery area
2. Edit delivery area
3. Delete delivery area (with confirmation)
4. Validate form errors
5. Test responsive design

## File Structure
```
Driver-Scheduling/
├── src/
│   ├── models/
│   │   └── DeliveryArea.js          # Mongoose model
│   ├── controllers/
│   │   └── deliveryAreaController.js # CRUD handlers
│   ├── routes/
│   │   └── deliveryAreaRoutes.js    # API routes
│   └── components/
│       ├── DeliveryAreaForm.jsx     # Form component
│       ├── DeliveryAreaForm.css     # Form styles
│       ├── DeliveryAreasManager.jsx # Manager component
│       └── DeliveryAreasManager.css # Manager styles
├── server.js                         # Express server
├── .env.example                      # Environment template
├── UI_DOCUMENTATION.md              # UI documentation
└── UI_LAYOUT.txt                    # ASCII UI layout
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env` file
- Verify MongoDB port (default: 27017)

### Frontend Not Displaying
- Ensure React is properly configured
- Check browser console for errors
- Verify API endpoints are accessible

### Validation Errors
- Check required fields are filled
- Verify color format is hex (#XXXXXX)
- Ensure at least one postcode is added

## Future Enhancements

Potential improvements:
- [ ] Add area coverage map visualization
- [ ] Bulk import/export postcodes
- [ ] Area overlap detection
- [ ] Search and filter functionality
- [ ] Postcode validation against UK postcode database
- [ ] User authentication and authorization
- [ ] Audit logging for changes
- [ ] API rate limiting
- [ ] Unit and integration tests

## Support

For issues or questions:
1. Check the UI_DOCUMENTATION.md file
2. Review the UI_LAYOUT.txt for UI reference
3. Verify MongoDB connection
4. Check server logs for errors

## License

This component is part of the Driver-Scheduling application.
