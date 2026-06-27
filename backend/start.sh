#!/bin/bash
# Production start script for Render / Railway
# Runs DB migrations + seed, then starts the server

echo "Running database setup..."
python seed_data.py

echo "Starting server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
