#!/bin/bash

# Create the necessary files
touch manifest.json

# Install Kuromoji as a dependency
npm init -y
npm install kuromoji

# Create the manifest.json file
echo '{
  "manifest_version": 2,
  "name": "Furiganizer",
  "description": "This extension adds furigana to any Japanese kanji words on a webpage",
  "version": "1.0",
  "permissions": ["activeTab"],
  "background": {
    "scripts": ["background.js"]
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["node_modules/kuromoji/lib/kuromoji.js", "addFurigana.js"]
    }
  ],
  "browser_action": {
    "default_icon": "icon.png"
  }
}' > manifest.json