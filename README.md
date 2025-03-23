# HackUNCP

A browser extension project with a Flask backend that processes web content using Google's Gemini AI model. The system allows for interactive chat and HTML content processing through a browser extension interface.

## Project Structure

```
HackUNCP/
├── Backend/
│   ├── Server/        # Flask server implementation
│   ├── Util/          # Utility functions including Gemini AI integration
│   └── env.yml        # Conda environment configuration
├── Extension/
│   ├── src/           # Extension source code
│   ├── dist/          # Compiled extension files
│   └── manifest.json  # Extension configuration
```

## Backend Setup

1. Create and activate the conda environment:
```bash
conda env create -f Backend/env.yml
conda activate hackuncp
```

2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

3. Start the Flask server:
```bash
cd Backend/Server
python server.py
```

The server will run on `http://localhost:5002`

## Extension Setup

1. Install dependencies:
```bash
cd Extension
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `Extension/dist` directory


## Requirements

- Backend:
  - Python 3.x
  - Flask
  - Google Gemini AI API key
- Extension:
  - Node.js
  - npm
  - Chrome browser

## License
This project is licensed under the MIT License - see below for details:

MIT License

Copyright (c) 2024 Julia Grove, Matt Linder, Matt Fowler, Arshia Eslami

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Authors

- [Julia Grove](https://github.com/juliagrove)
- [Matt Linder](https://github.com/mlinder10)
- [Matt Fowler](https://github.com/fowlermatt)
- [Arshia Eslami](https://github.com/arshiaesll)