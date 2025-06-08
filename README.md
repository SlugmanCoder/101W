# Vocabulary Trainer

This project contains a React frontend and an Express/MongoDB backend. Each part has its own `package.json` inside the `vocabulary-trainer-frontend` and `vocabulary-trainer-backend` folders.

## Prerequisites

- Node.js and npm
- MongoDB instance (local or remote)

## Installation

Install dependencies for the root project as well as both sub-projects:

```bash
# install root dependencies (provides the convenience scripts)
npm install

# install backend dependencies
cd vocabulary-trainer-backend
npm install

# install frontend dependencies
cd ../vocabulary-trainer-frontend
npm install
```

Create a `.env` file in `vocabulary-trainer-backend` with at least a `MONGODB_URI` pointing to your database.

## Starting the Backend

From the backend directory:

```bash
cd vocabulary-trainer-backend
npx nodemon index.js
```

This runs the Express server on port `5000` by default.

## Starting the Frontend

From the frontend directory:

```bash
cd vocabulary-trainer-frontend
npm start
```

The React app will start on [http://localhost:3000](http://localhost:3000).

## Running Both Together

After installing all dependencies you can run both the frontend and backend concurrently from the repository root using:

```bash
npm start
```

This command uses `concurrently` to start each part in parallel.
