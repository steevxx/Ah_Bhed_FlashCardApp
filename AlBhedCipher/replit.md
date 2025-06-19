# Al Bhed Flashcard Quiz Application

## Overview

This is a web-based flashcard quiz application for learning the Al Bhed alphabet from Final Fantasy X. The application presents users with English letters and challenges them to input the corresponding Al Bhed characters. It features a Flask backend with session-based state management and a responsive Bootstrap frontend with JavaScript interactivity.

## System Architecture

The application follows a traditional client-server architecture with:

- **Frontend**: HTML templates with Bootstrap 5 dark theme, vanilla JavaScript for interactivity
- **Backend**: Flask web framework with session-based state management
- **Deployment**: Gunicorn WSGI server configured for autoscale deployment on Replit
- **Environment**: Python 3.11 with Nix package management

## Key Components

### Backend (Flask Application)
- **app.py**: Main Flask application with quiz logic and API endpoints
- **main.py**: WSGI entry point for Gunicorn deployment
- **Session Management**: Uses Flask sessions to track quiz progress, current question index, and scoring
- **Al Bhed Mapping**: Hardcoded dictionary mapping English letters to Al Bhed equivalents

### Frontend
- **templates/index.html**: Single-page application template with multiple screens (welcome, quiz, results)
- **static/script.js**: JavaScript class-based quiz controller handling user interactions and API calls
- **static/style.css**: Custom CSS with dark theme styling and responsive design

### API Endpoints
- `GET /`: Serves the main application page
- `POST /start_quiz`: Initializes new quiz session with shuffled letter order
- `GET /get_question`: Returns current question data or completion status

## Data Flow

1. **Quiz Initialization**: User clicks start → POST to `/start_quiz` → Server creates shuffled letter list and initializes session
2. **Question Flow**: Frontend requests current question → Server returns letter and progress data → User submits answer → Validation and scoring
3. **Session State**: All quiz progress stored in Flask session (letters array, current index, score)
4. **Completion**: When all letters answered, quiz completion screen shows final score

## External Dependencies

### Python Packages (pyproject.toml)
- **flask**: Web framework (v3.1.1+)
- **gunicorn**: WSGI HTTP server for deployment (v23.0.0+)
- **flask-sqlalchemy**: SQLAlchemy integration (v3.1.1+) - *Note: Currently unused*
- **psycopg2-binary**: PostgreSQL adapter (v2.9.10+) - *Note: Currently unused*
- **email-validator**: Email validation utility (v2.2.0+) - *Note: Currently unused*

### Frontend Dependencies (CDN)
- **Bootstrap 5**: UI framework with dark theme
- **Font Awesome 6**: Icon library
- **Replit Bootstrap Agent Theme**: Custom dark theme styling

## Deployment Strategy

- **Platform**: Replit with autoscale deployment target
- **Server**: Gunicorn WSGI server binding to 0.0.0.0:5000
- **Environment**: Nix-based environment with Python 3.11
- **Process Management**: Configured with --reuse-port and --reload flags for development
- **Secrets**: Session secret key from environment variable with fallback

## Changelog

- June 18, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.

## Notes

- The application currently includes database dependencies (SQLAlchemy, psycopg2) but doesn't implement database functionality
- Quiz state is maintained in Flask sessions, making it stateless between server restarts
- The Al Bhed mapping is hardcoded and based on the Final Fantasy X game's official alphabet
- Frontend uses a single-page application approach with JavaScript-managed screen transitions
- Responsive design supports both desktop and mobile devices