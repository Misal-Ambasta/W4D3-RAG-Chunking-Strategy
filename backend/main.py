import logging
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
from pdf_processing import PDFProcessor
from chunking import ChunkingService

# Use uvicorn logger for consistent output in uvicorn console
logger = logging.getLogger("uvicorn")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

chunking_service = ChunkingService()

@app.get("/")
def root():
    return {"message": "RAG Chunking Backend Running"}

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_location, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"filename": file.filename}

@app.get("/strategies/")
def get_strategies():
    return {
        "strategies": [
            "recursive_character",
            "character",
            "token",
            "nltk",
            "spacy",
            "semantic_chunking",
            "hierarchical_chunking"
        ],
        "default_params": {
            "chunk_size": 500,
            "chunk_overlap": 50
        }
    }

@app.post("/chunk/")
def chunk_pdf(
    filename: str = Query(..., description="PDF filename in upload dir"),
    strategy: str = Query("recursive_character", description="Chunking strategy"),
    chunk_size: int = Query(500, ge=1, le=5000),
    chunk_overlap: int = Query(50, ge=0, le=1000),
    similarity_threshold: Optional[float] = Query(None, description="Semantic chunking threshold (0.1-0.9)"),
    max_chunk_size: Optional[int] = Query(None, description="Max chunk size for semantic_chunking"),
    level_sizes: Optional[str] = Query(None, description="Comma-separated list of sizes for hierarchical_chunking, e.g. '1000,500'"),
    merge_strategy: Optional[str] = Query(None, description="Merge strategy for hierarchical_chunking (concat/join)"),
    method: Optional[str] = Query("pdfplumber", description="pdfplumber or pypdf2")
):
    # Validate file
    logger.info(f"Processing file")
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        logger.error(f"File not found: {file_path}")
        raise HTTPException(status_code=404, detail="File not found.")
    # Extract text
    try:
        if method == "pdfplumber":
            text = PDFProcessor.extract_text_pdfplumber(file_path)
        else:
            text = PDFProcessor.extract_text_pypdf2(file_path)
        text = PDFProcessor.clean_text(text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF extraction failed: {str(e)}")
    # Chunking
    try:
        if strategy == "recursive_character":
            chunks = chunking_service.recursive_character_split(text, chunk_size, chunk_overlap)
            chunk_metadata = [
                {
                    "index": i,
                    "size": len(chunk),
                    "overlap": chunk_overlap if i > 0 else 0
                } for i, chunk in enumerate(chunks)
            ]
        elif strategy == "character":
            chunks = chunking_service.character_split(text, chunk_size, chunk_overlap)
            chunk_metadata = [
                {
                    "index": i,
                    "size": len(chunk),
                    "overlap": chunk_overlap if i > 0 else 0
                } for i, chunk in enumerate(chunks)
            ]
        elif strategy == "token":
            chunks = chunking_service.token_split(text, chunk_size, chunk_overlap)
            chunk_metadata = [
                {
                    "index": i,
                    "size": len(chunk),
                    "overlap": chunk_overlap if i > 0 else 0
                } for i, chunk in enumerate(chunks)
            ]
        elif strategy == "nltk":
            chunks = chunking_service.nltk_split(text, chunk_size, chunk_overlap)
            chunk_metadata = [
                {
                    "index": i,
                    "size": len(chunk),
                    "overlap": chunk_overlap if i > 0 else 0
                } for i, chunk in enumerate(chunks)
            ]
        elif strategy == "spacy":
            chunks = chunking_service.spacy_split(text, chunk_size, chunk_overlap)
            chunk_metadata = [
                {
                    "index": i,
                    "size": len(chunk),
                    "overlap": chunk_overlap if i > 0 else 0
                } for i, chunk in enumerate(chunks)
            ]
        elif strategy == "semantic_chunking":
            logger.info(f"Using semantic_chunking with threshold: {similarity_threshold} (type: {type(similarity_threshold)}), max_chunk_size: {max_chunk_size} (type: {type(max_chunk_size)})")
            try:
                st = similarity_threshold if similarity_threshold is not None else 0.7
                chunks, meta = chunking_service.semantic_chunking(text, similarity_threshold=st, max_chunk_size=max_chunk_size)
                chunk_metadata = meta
                logger.info(f"Generated {len(chunks)} chunks using semantic_chunking")
            except Exception as e:
                import traceback
                logger.error(f"Exception in semantic_chunking: {e}\n{traceback.format_exc()}")
                raise HTTPException(status_code=500, detail=f"semantic_chunking failed: {str(e)}")
        elif strategy == "hierarchical_chunking":
            logger.info(f"Using hierarchical_chunking with level_sizes: {level_sizes}, merge_strategy: {merge_strategy}")
            sizes = [int(x) for x in level_sizes.split(",")] if level_sizes else [1000, 500]
            ms = merge_strategy if merge_strategy else "concat"
            chunks, meta = chunking_service.hierarchical_chunking(text, level_sizes=sizes, merge_strategy=ms)
            chunk_metadata = meta
        else:
            raise HTTPException(status_code=400, detail="Invalid strategy.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chunking failed: {str(e)}")
    # Metadata (for legacy)
    if not isinstance(chunk_metadata, list):
        # semantic/hierarchical return dicts
        return {"chunks": chunks, "metadata": chunk_metadata}
    return {
        "chunks": chunks,
        "metadata": chunk_metadata
    }

    return {
        "num_chunks": len(chunks),
        "chunks": chunks,
        "metadata": chunk_metadata
    }
