#!/bin/bash
# Build script that copies attached_assets to dist/public

# Run vite build
npm run build

# Copy attached_assets to dist/public
echo "Copying attached_assets to dist/public..."
cp -r attached_assets dist/public/attached_assets

echo "Build complete!"
