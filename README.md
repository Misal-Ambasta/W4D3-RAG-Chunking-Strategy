# Chunking Strategy Web App

A full-stack web application for uploading PDFs and visualizing different text chunking strategies. Use this tool to experiment with and compare chunking methods for downstream NLP or information retrieval tasks.

---

## Features
- **PDF Upload:** Drag-and-drop interface for uploading PDF files.
- **Chunking Strategies:**
  - **Standard:** RecursiveCharacter, Character, Token, NLTK, Spacy
  - **Advanced:**
    - **Semantic Chunking:** Uses the Sentence Transformers model `'all-MiniLM-L6-v2'` for sentence embeddings and cosine similarity for chunk boundaries.
    - **Hierarchical Chunking:** Multi-level chunking (e.g., paragraph then sentence) using NLTK sentence tokenizer and custom logic.
- **Parameter Tuning:**
  - Standard: Chunk size, overlap
  - Semantic: Similarity threshold (0.1-0.9), optional max chunk size
  - Hierarchical: Level sizes (comma-separated), merge strategy (concat/join)
- **Visualization:**
  - Interactive charts for chunk size and overlap (where applicable)
  - Parameter preview for advanced strategies
- **Advanced UI:** Dynamic controls for each strategy, tooltips, parameter info
- **Debugging:** Logging via uvicorn for backend, clear error messages in frontend

---

## Tech Stack
- **Backend:** FastAPI, LangChain, PyPDF2, pdfplumber, NLTK, Spacy, sentence-transformers, scipy
- **Frontend:** React (Vite, TypeScript), Tailwind CSS, shadcn/ui, Recharts

---

## Setup Instructions

### Backend
1. `cd backend`
2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Download required NLTK and Spacy data/models:
   ```sh
   python -m spacy download en_core_web_sm
   python -c "import nltk; nltk.download('punkt')"
   ```
5. Run the FastAPI server:
   ```sh
   uvicorn main:app --reload --log-level info
   ```
   - Logs will appear in the terminal for debugging (uses `uvicorn` logger).

### Frontend
1. `cd frontend`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Usage
- Open the frontend in your browser (usually at [http://localhost:5173](http://localhost:5173))
- Upload a PDF file.
- Select a chunking strategy:
  - Standard strategies show chunk size and overlap controls.
  - **Semantic Chunking:** Shows similarity threshold and optional max chunk size.
  - **Hierarchical Chunking:** Shows level sizes and merge strategy controls.
- Adjust parameters as needed. Parameter previews are shown for advanced strategies.
- Click "Chunk & Visualize" to see results and metadata.
- If a strategy does not support charts, a message will appear instead of a chart.

---

## Debugging & Notes
- Backend logs (including errors and parameter values) appear in the terminal where you run `uvicorn`.
- For advanced strategies, metadata returned may not be suitable for all charts. The UI handles this gracefully.
- If you see a 500 error for semantic chunking, ensure all dependencies are installed and the backend is returning only native Python types (not numpy types) in its JSON.

---

## Progress
- **Phases 1-6:** Complete (Backend, Frontend, Integration, Visualizations, Help, Performance)
- **Phase 7:** Testing (in progress)
- **Phase 8:** Integration Features (external APIs, webhooks, auth, etc.)

See `todo.md` for detailed progress tracking.

---

## License
MIT