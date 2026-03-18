#!/bin/bash

# BuySimply Backend Startup Script

echo "🚀 Starting BuySimply Backend..."
echo "=================================="

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  .env file not found. Creating from .env.example..."
  cp .env.example .env
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please check the errors above."
  exit 1
fi

echo "✅ Build successful!"
echo ""
echo "Starting server..."
npm run start
