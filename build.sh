#!/bin/bash
# Build script with asset copying
npm run build
cp -r attached_assets dist/public/attached_assets
echo "Build complete! $(ls dist/public/attached_assets | wc -l) assets copied."
