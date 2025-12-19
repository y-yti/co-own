# Co-own

## Introduction

Co-own is a real estate investment platform that enables fractional ownership of properties. Investors can browse, search, and invest in residential and commercial properties across multiple cities. The platform provides detailed property information, investment opportunities, and a comprehensive dashboard for managing property portfolios.

### Key Features

- 🏢 **Property Search** - Search for properties by location and type (residential/commercial)
- 📊 **Property Details** - View detailed information including units, pricing, and location maps
- 💰 **Investment Opportunities** - Browse available units and investment options
- 📈 **Investor Dashboard** - Manage multiple property views with tabbed interface
- 🗺️ **Interactive Maps** - Google Maps integration for property locations

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and development server
- **CSS3** - Styling

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server

### Testing
- **Playwright** - End-to-end testing framework

## Getting Started

### Prerequisites

- Node.js (v24 or higher)
- Python 3.10+
- npm or yarn

### Installation & Running

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd co-own
```

#### 2. Start the Backend

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

#### 3. Start the Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

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