#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install -f

# Step 2: Build the project
echo -e "${GREEN}Building the project...${NC}"
npm run build

# Step 3: Success message
echo -e "${GREEN}Build complete!${NC}"
