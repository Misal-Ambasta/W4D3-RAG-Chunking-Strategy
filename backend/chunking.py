from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    CharacterTextSplitter,
    TokenTextSplitter,
    NLTKTextSplitter,
    SpacyTextSplitter,
)
from typing import List

class ChunkingService:
    def __init__(self):
        pass

    def recursive_character_split(self, text: str, chunk_size=500, chunk_overlap=50) -> List[str]:
        splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        return splitter.split_text(text)

    def character_split(self, text: str, chunk_size=500, chunk_overlap=50) -> List[str]:
        splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        return splitter.split_text(text)

    def token_split(self, text: str, chunk_size=500, chunk_overlap=50) -> List[str]:
        splitter = TokenTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        return splitter.split_text(text)

    def nltk_split(self, text: str, chunk_size=500, chunk_overlap=50) -> List[str]:
        splitter = NLTKTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        return splitter.split_text(text)

    def spacy_split(self, text: str, chunk_size=500, chunk_overlap=50) -> List[str]:
        splitter = SpacyTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        return splitter.split_text(text)

    def semantic_chunking(self, text: str, similarity_threshold: float = 0.7, max_chunk_size: int = None):
        """
        Chunk text based on semantic similarity between adjacent sentences.
        Uses sentence-transformers ('all-MiniLM-L6-v2') and cosine similarity.
        Returns chunks and metadata (similarity_scores, chunk_count, avg_similarity).
        """
        from sentence_transformers import SentenceTransformer
        from scipy.spatial.distance import cosine
        import nltk
        if not text or not text.strip():
            return [], {"similarity_scores": [], "chunk_count": 0, "avg_similarity": None}
        sentences = nltk.sent_tokenize(text)
        if len(sentences) == 1:
            return [sentences[0]], {"similarity_scores": [], "chunk_count": 1, "avg_similarity": None}
        model = SentenceTransformer('all-MiniLM-L6-v2')
        embeddings = model.encode(sentences)
        similarity_scores = []
        boundaries = [0]
        for i in range(1, len(sentences)):
            sim = 1 - cosine(embeddings[i-1], embeddings[i])
            similarity_scores.append(sim)
            if sim < similarity_threshold:
                boundaries.append(i)
        boundaries.append(len(sentences))
        chunks = []
        for i in range(len(boundaries)-1):
            chunk = " ".join(sentences[boundaries[i]:boundaries[i+1]])
            if max_chunk_size and len(chunk) > max_chunk_size:
                # Further split if chunk exceeds max_chunk_size
                for j in range(0, len(chunk), max_chunk_size):
                    chunks.append(chunk[j:j+max_chunk_size])
            else:
                chunks.append(chunk)
        # Convert all numpy types to Python types for FastAPI compatibility
        similarity_scores_py = [float(s) for s in similarity_scores]
        avg_similarity_py = float(sum(similarity_scores)/len(similarity_scores)) if similarity_scores else None
        meta = {
            "similarity_scores": similarity_scores_py,
            "chunk_count": int(len(chunks)),
            "avg_similarity": avg_similarity_py
        }
        return chunks, meta

    def hierarchical_chunking(self, text: str, level_sizes: list = [1000, 500], merge_strategy: str = "concat"):
        """
        Hierarchical chunking: chunk at multiple levels, e.g., paragraphs then sentences.
        level_sizes: list of chunk sizes for each level.
        merge_strategy: how to merge sub-chunks ("concat" or "join").
        Returns chunks and metadata.
        """
        import nltk
        if not text or not text.strip():
            return [], {"levels": [], "chunk_count": 0}
        # Level 1: Paragraph split
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        all_chunks = []
        for para in paragraphs:
            sents = nltk.sent_tokenize(para)
            # Level 2: Sentence grouping
            for i in range(0, len(sents), level_sizes[1]//100):
                chunk = " ".join(sents[i:i+(level_sizes[1]//100)])
                all_chunks.append(chunk)
        # Merge if needed
        if merge_strategy == "concat":
            pass  # already concatenated
        elif merge_strategy == "join":
            all_chunks = ["\n".join(all_chunks)]
        meta = {"levels": [len(paragraphs), len(all_chunks)], "chunk_count": len(all_chunks)}
        return all_chunks, meta
