#!/bin/bash
set -e

echo "Building Mental Health API..."
cd backend

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

echo "Build complete!"
