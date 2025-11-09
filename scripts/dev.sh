#!/bin/bash

# DATAVA Development Startup Script
# Starts all services and the frontend for local development

set -e # Exit on any error

# Get the root directory of the project, assuming the script is in a 'scripts' folder
PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

# Create a logs directory if it doesn't exist
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"

echo "🚀 Starting DATAVA Development Environment..."

cd "$PROJECT_ROOT"

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "❌ Port $port is already in use!"
        echo "Please stop the service using that port and try again."
        exit 1
    fi
}

# Check required ports
echo "🔍 Checking required ports..."
check_port 3000  # Next.js frontend
check_port 5051  # Ingestion service
check_port 5052  # Inference service

echo "✅ All ports are available, proceeding with startup..."

# Function to wait for a port to become active
wait_for_port() {
    local port=$1
    local service_name=$2
    echo -n "⏳ Waiting for $service_name on port $port to be ready..."
    while ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        echo -n "."
        sleep 1
    done
    echo " ✅ Ready!"
}

# Array to hold PIDs of background processes
pids=()

# Cleanup function to stop all background services
cleanup() {
    echo -e "\n\n🛑 Shutting down services..."
    if [ ${#pids[@]} -gt 0 ]; then
        kill "${pids[@]}" 2>/dev/null
        echo "✅ All services stopped."
    else
        echo "ℹ️ No background services were running."
    fi
}

# Set up the trap to call the cleanup function on exit
trap cleanup EXIT

# Start the services in background
echo "📦 Starting Ingestion Service on port 5051..."
(cd services/ingestion && pnpm dev > "$LOG_DIR/ingestion.log" 2>&1) &
pids+=($!)

echo "🤖 Starting Inference Service on port 5052..."
(cd services/inference && pnpm dev > "$LOG_DIR/inference.log" 2>&1) &
pids+=($!)

# Wait for backend services to be ready
sleep 2 # Give services a moment to start processes
wait_for_port 5051 "Ingestion Service"
wait_for_port 5052 "Inference Service"

# Start the frontend
echo "🌐 Starting Frontend on port 3000..."
cd apps/web && pnpm dev