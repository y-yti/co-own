# Co-own

## About the Application

Co-own is a modern real estate investment platform that democratizes property investment through fractional ownership. The application enables investors to browse, search, and invest in both residential and commercial properties across multiple cities, making real estate investment more accessible and manageable.

### Application Context

The platform addresses the challenge of high entry barriers in real estate investment by allowing users to:
- Purchase fractional shares in premium properties
- Diversify their real estate portfolio across multiple properties
- Access detailed property information and analytics
- Track and manage their investments through an intuitive dashboard

The application follows a modern full-stack architecture with a React-based frontend communicating with a FastAPI backend through RESTful APIs. Property data is stored in JSON format for easy demonstration and development purposes.

### Key Features

- 🏢 **Property Search** - Search for properties by location and type (residential/commercial)
- 📊 **Property Details** - View detailed information including units, pricing, amenities, and location maps
- 💰 **Investment Opportunities** - Browse available units with transparent pricing and ownership details
- 📈 **Investor Dashboard** - Manage multiple property views with an intuitive tabbed interface (up to 5 properties)
- 🗺️ **Interactive Maps** - Google Maps integration for exploring property locations
- 📱 **Responsive Design** - Works seamlessly across desktop and mobile devices

## Tech Stack

### Frontend
- **React 19** - Modern UI framework with hooks
- **Vite 7** - Lightning-fast build tool and development server
- **CSS3** - Custom styling with responsive design
- **Centralized API Service** - Organized service layer for all backend communication

### Backend
- **FastAPI** - High-performance Python web framework
- **Uvicorn** - ASGI server for production-ready async support
- **CORS Middleware** - Configured for secure cross-origin requests

### Testing
- **Playwright** - End-to-end testing framework for comprehensive UI testing

## Getting Started

### Prerequisites

- **Node.js** v18 or higher (v24 recommended)
- **Python** 3.10 or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation & Running

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd co-own
```

#### 2. Start the Backend Server

The backend provides the REST API endpoints for property data.

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend API will be running at:** `http://localhost:8000`

**API Documentation:** `http://localhost:8000/docs` (Interactive Swagger UI)

**Available Endpoints:**
- `GET /properties` - List all properties
- `GET /properties/{id}/details` - Get detailed property information

#### 3. Start the Frontend Development Server

Open a **new terminal window** and keep the backend running.

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the Vite development server
npm run dev
```

**Frontend application will be running at:** `http://localhost:5173`

The development server includes:
- Hot Module Replacement (HMR) for instant updates
- Fast refresh for React components
- Detailed error overlay for debugging

#### 4. Access the Application

Open your browser and navigate to `http://localhost:5173` to start using Co-own!

### Environment Configuration

The frontend uses environment variables for API configuration:

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

This allows easy switching between development and production API endpoints.

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/property-search.spec.ts
```

## Project Structure

```
co-own/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── properties/            # Property data (JSON files)
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   └── config/            # Configuration files
│   ├── tests/                 # Playwright tests
│   └── package.json
└── .github/
    └── copilot-instructions.md # Development guidelines
```

## Development Guidelines

Please refer to [.github/copilot-instructions.md](.github/copilot-instructions.md) for:
- Testing requirements
- API service usage patterns
- Best practices for component development

## License

[Add your license here]

## Contributing

[Add contribution guidelines here]