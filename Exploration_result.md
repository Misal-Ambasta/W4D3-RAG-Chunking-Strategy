# Chunking Strategy Exploration Report

This document explores the various chunking strategies implemented in the RAG Chunking Strategy Visualizer, detailing their use cases, trade-offs, and the impact of parameters like chunk size and overlap on retrieval performance.

---

## 1. Fixed-Size Chunking (Character & Recursive)

These are the simplest methods, splitting text based on a fixed character count.

-   **When to use:** Best for structured text (like code or logs) or as a baseline when semantic structure is unknown or irrelevant. `RecursiveCharacterTextSplitter` is slightly more advanced as it tries to split on common separators first (like `\n\n`, `\n`, ` `) before resorting to a hard character cut.
-   **Trade-offs:**
    -   **Pros:** Simple, fast, and predictable chunk sizes.
    -   **Cons:** High risk of breaking sentences or words mid-thought, leading to semantically incomplete chunks that are difficult for retrieval models to understand.
-   **Overlap:** A larger overlap is often necessary to stitch together context that was broken by an arbitrary split. However, too much overlap increases redundancy and storage costs.

---

## 2. Token-Based Chunking (Spacy)

This method splits text based on a fixed number of tokens, which are words or sub-words.

-   **When to use:** Useful when the language model has a strict token limit for its context window. It provides more semantically aware splits than character-based methods since it respects word boundaries.
-   **Trade-offs:**
    -   **Pros:** Aligns well with model context limits and avoids breaking words.
    -   **Cons:** Can still split sentences or ideas, as it doesn't understand sentence structure.
-   **Overlap:** Similar to fixed-size chunking, overlap helps maintain context across chunks. The ideal overlap size depends on the document's sentence length and complexity.

---

## 3. Sentence-Based Chunking (NLTK)

This strategy splits text into individual sentences, respecting grammatical boundaries.

-   **When to use:** Excellent for prose, articles, and documents where each sentence represents a complete thought. It ensures that chunks are semantically coherent units.
-   **Trade-offs:**
    -   **Pros:** High semantic coherence, as full sentences are preserved.
    -   **Cons:** Chunk sizes can be highly variable. Some sentences may be very long (exceeding token limits), while others are very short (lacking context).
-   **Overlap:** Not typically used, as the goal is to have one sentence per chunk. Grouping multiple sentences together is a more common approach to ensure sufficient context.

---

## 4. Semantic Chunking

This advanced method uses sentence embeddings to group related sentences into chunks.

-   **When to use:** Ideal for dense, informational documents where topics shift gradually. It creates chunks that are both semantically coherent and self-contained, making it highly effective for Q&A tasks.
-   **Trade-offs:**
    -   **Pros:** Produces the most semantically relevant chunks, leading to better retrieval quality.
    -   **Cons:** Computationally expensive due to the need to generate embeddings for each sentence. The `similarity_threshold` is a critical parameter that requires tuning.
-   **Overlap:** Not needed. The semantic grouping process naturally creates distinct, coherent chunks. The concept of overlap is replaced by the similarity threshold, which determines when a new chunk should begin.

---

## 5. Hierarchical Chunking

This strategy creates multiple layers of chunks, often starting with larger parent chunks and breaking them down into smaller child chunks.

-   **When to use:** Best for complex, structured documents with sections, subsections, and paragraphs (e.g., textbooks, legal documents, long reports). It allows the RAG system to first retrieve a small, relevant chunk and then fetch the larger parent chunk for more context.
-   **Trade-offs:**
    -   **Pros:** Preserves the document's structure, enabling more sophisticated retrieval strategies (e.g., small-to-large retrieval).
    -   **Cons:** More complex to implement and manage. Requires careful selection of `level_sizes` to match the document's natural structure.
-   **Overlap:** Can be applied at each level of the hierarchy, but the primary mechanism for context preservation is the parent-child relationship between chunks.
