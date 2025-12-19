# Development Guidelines

## Testing Requirements

**CRITICAL:** Whenever you create a new component, you MUST create corresponding tests automatically, even if the user doesn't explicitly request them.

### Test Creation Rules:

1. **Every new component requires tests** - Create a test file in the `tests/` directory
2. **Test file naming** - Follow the pattern: `component-name.spec.ts`
3. **Minimum test coverage:**
   - Rendering tests (component renders without errors)
   - Props validation tests
   - User interaction tests (clicks, inputs, etc.)
   - State management tests (if applicable)
   - API integration tests (if component makes API calls)
4. **Use existing test patterns** - Follow the structure and patterns from existing test files in the project

### Example Test Structure:

```typescript
import { test, expect } from '@playwright/test';

test.describe('ComponentName', () => {
  test('renders component correctly', async ({ page }) => {
    // Test implementation
  });

  test('handles user interactions', async ({ page }) => {
    // Test implementation
  });

  test('displays data correctly', async ({ page }) => {
    // Test implementation
  });
});
```

---

## API Service Guidelines

### Overview

This project uses a centralized API service layer to manage all backend API calls. This approach provides consistency, maintainability, and makes it easier to update API configurations.

## Architecture

### 1. Environment Configuration (`.env`)

All environment-specific variables are stored in the `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

**Important:** Never commit sensitive data or production URLs to version control. Use `.env.local` for local overrides.

### 2. API Configuration (`src/config/api.js`)

Centralizes the API base URL configuration:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

### 3. API Service Layer (`src/services/api.js`)

Contains all API methods organized by domain (e.g., `propertyService`):

```javascript
import { API_BASE_URL } from '../config/api';

export const propertyService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/properties`);
    if (!response.ok) {
      throw new Error('Failed to fetch properties');
    }
    return response.json();
  },
  
  getDetails: async (id) => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/details`);
    if (!response.ok) {
      throw new Error('Failed to fetch property details');
    }
    return response.json();
  },
};
```

## Best Practices

### ✅ DO:

1. **Import and use the service layer in components:**
   ```javascript
   import { propertyService } from '../services/api';
   
   const data = await propertyService.getAll();
   ```

2. **Add new API methods to the appropriate service:**
   ```javascript
   export const propertyService = {
     // ... existing methods
     
     create: async (propertyData) => {
       const response = await fetch(`${API_BASE_URL}/properties`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(propertyData),
       });
       if (!response.ok) {
         throw new Error('Failed to create property');
       }
       return response.json();
     },
   };
   ```

3. **Create new service objects for different domains:**
   ```javascript
   export const userService = {
     login: async (credentials) => { /* ... */ },
     logout: async () => { /* ... */ },
   };
   
   export const investmentService = {
     getPortfolio: async (userId) => { /* ... */ },
     createInvestment: async (data) => { /* ... */ },
   };
   ```

4. **Handle errors consistently:**
   ```javascript
   try {
     const data = await propertyService.getAll();
     setProperties(data.items || []);
   } catch (err) {
     console.error('Error fetching properties:', err);
     setError(err.message);
   }
   ```

### ❌ DON'T:

1. **Don't hardcode API URLs in components:**
   ```javascript
   // ❌ BAD
   const res = await fetch('http://localhost:8000/properties');
   
   // ✅ GOOD
   const data = await propertyService.getAll();
   ```

2. **Don't duplicate API logic:**
   ```javascript
   // ❌ BAD - Repeating fetch logic in multiple components
   const response = await fetch(`${API_BASE_URL}/properties/${id}`);
   if (!response.ok) throw new Error('...');
   return response.json();
   
   // ✅ GOOD - Use the service method
   const data = await propertyService.getById(id);
   ```

3. **Don't import API_BASE_URL directly in components:**
   ```javascript
   // ❌ BAD
   import { API_BASE_URL } from '../config/api';
   fetch(`${API_BASE_URL}/properties`);
   
   // ✅ GOOD
   import { propertyService } from '../services/api';
   propertyService.getAll();
   ```

## Adding New API Endpoints

When adding a new API endpoint, follow these steps:

1. **Open `src/services/api.js`**

2. **Add the new method to the appropriate service or create a new service:**
   ```javascript
   export const propertyService = {
     // ... existing methods
     
     updateProperty: async (id, updates) => {
       const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(updates),
       });
       if (!response.ok) {
         throw new Error('Failed to update property');
       }
       return response.json();
     },
   };
   ```

3. **Use the new method in your component:**
   ```javascript
   import { propertyService } from '../services/api';
   
   const handleUpdate = async () => {
     try {
       await propertyService.updateProperty(propertyId, { name: 'New Name' });
       // Handle success
     } catch (err) {
       // Handle error
     }
   };
   ```

## Environment-Specific Configuration

### Development
Uses `.env` file with `http://localhost:8000`

### Production
Create a `.env.production` file:
```env
VITE_API_URL=https://api.production-domain.com
```

### Testing
Create a `.env.test` file:
```env
VITE_API_URL=https://api.test-domain.com
```

## Benefits

✅ **Single source of truth** for API URLs
✅ **Easy to switch** between environments (dev, staging, production)
✅ **Centralized error handling** and request logic
✅ **Better type safety** and IntelliSense support
✅ **Easier to test** and mock
✅ **Improved maintainability** - changes in one place

## Migration Checklist

When creating a new component that needs API access:

- [ ] Import the appropriate service from `src/services/api.js`
- [ ] Use service methods instead of direct `fetch` calls
- [ ] Handle errors with try/catch blocks
- [ ] Never hardcode API URLs
- [ ] If the endpoint doesn't exist, add it to the service first

## Questions?

If you need to add a new API endpoint or service, follow the patterns in `src/services/api.js` and refer to the examples in this document.
