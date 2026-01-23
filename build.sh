#!/bin/bash
npm run build
cp -r attached_assets dist/public/attached_assets
echo "Build complete! attached_assets copied."
