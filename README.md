# Sentiment Analysis Web App

## Overview
This project is a **Sentiment Analysis Web Application** built using **Next.js (React)** for the frontend and **Python (FastAPI/Flask)** for the backend. It analyzes user-provided text and determines its sentiment (positive, negative, or neutral).

## Features
- **User Authentication**: Login & Signup pages.
- **Sentiment Analysis**: AI-driven text sentiment analysis.
- **Dashboard**: Displays sentiment results with a clean UI.
- **Theming**: Theme customization with TailwindCSS.

## Technologies Used
### Frontend:
- **Next.js (React)**
- **TypeScript**
- **TailwindCSS**
- **React Hooks**

### Backend:
- **Python (FastAPI/Flask)**
- **Natural Language Processing (NLP)**
- **REST API**

## Project Structure
```
|-- app/
|   |-- actions/
|   |   |-- analyze-sentiment.ts  # Calls backend API
|   |-- dashboard/
|   |   |-- page.tsx              # Sentiment analysis dashboard
|   |-- login/
|   |   |-- page.tsx              # Login page
|   |-- signup/
|   |   |-- page.tsx              # Signup page
|   |-- layout.tsx                # Layout component
|-- backend/
|   |-- api.py                     # Python API for sentiment analysis
|-- components/
|   |-- ui/
|   |   |-- theme-provider.tsx      # UI theme provider
|-- data/
|-- hooks/
|-- public/
|-- styles/
|-- .env.local                      # Environment variables
|-- package.json                     # Dependencies
|-- next.config.mjs                   # Next.js config
|-- tailwind.config.js                 # TailwindCSS config
|-- tsconfig.json                      # TypeScript config
```

## Setup & Installation
### 1. Clone the Repository
```sh
git clone https://github.com/yourusername/sentiment-analysis.git
cd sentiment-analysis
```

### 2. Install Dependencies
#### Frontend:
```sh
cd frontend
npm install
```

#### Backend:
```sh
cd backend
pip install -r requirements.txt
```

### 3. Run the Application
#### Start Backend (FastAPI/Flask)
```sh
cd backend
python api.py
```

#### Start Frontend (Next.js)
```sh
cd frontend
npm run dev
```

### 4. Access the App
Visit: [http://localhost:3000](http://localhost:3000)



## Contributors
-  – [GitHub Profile](https://github.com/shoukhathalikhan)

## Acknowledgements
- OpenAI's ChatGPT for assistance in documentation.
- Natural Language Processing (NLP) libraries for sentiment analysis.

