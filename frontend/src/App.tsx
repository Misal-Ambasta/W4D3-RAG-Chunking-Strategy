import React, { useState } from "react";
import { FileUpload } from "./components/FileUpload";
import { StrategySelector } from "./components/StrategySelector";
import { ChunkList } from "./components/ChunkList";
import { ChunkChart } from "./components/ChunkChart";
import { ParameterPreview } from "./components/ParameterPreview";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ChunkMeta {
  index: number;
  size: number;
  overlap: number;
}

const API_URL = "http://localhost:8000";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [strategies, setStrategies] = useState<string[]>([]);
  const [strategy, setStrategy] = useState<string>("");
  const [chunkSize, setChunkSize] = useState<number>(500);
  const [chunkOverlap, setChunkOverlap] = useState<number>(50);
  const [chunks, setChunks] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  // New params for advanced strategies
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.7);
  const [maxSemanticChunkSize, setMaxSemanticChunkSize] = useState<number | undefined>(undefined);
  const [levelSizes, setLevelSizes] = useState<string>("1000,500");
  const [mergeStrategy, setMergeStrategy] = useState<string>("concat");

  React.useEffect(() => {
    fetch(`${API_URL}/strategies/`)
      .then((res) => res.json())
      .then((data) => {
        setStrategies(data.strategies);
        setStrategy(data.strategies[0]);
        setChunkSize(data.default_params.chunk_size);
        setChunkOverlap(data.default_params.chunk_overlap);
      });
  }, []);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setFilename("");
    setChunks([]);
    setMetadata([]);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_URL}/upload/`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFilename(data.filename);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChunk = async () => {
    if (!filename) {
      setError("Please upload a PDF first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        filename,
        strategy,
        chunk_size: chunkSize.toString(),
        chunk_overlap: chunkOverlap.toString(),
      });
      // Add advanced strategy params
      if (strategy === "semantic_chunking") {
        params.set("similarity_threshold", similarityThreshold.toString());
        if (maxSemanticChunkSize) params.set("max_chunk_size", maxSemanticChunkSize.toString());
      }
      if (strategy === "hierarchical_chunking") {
        params.set("level_sizes", levelSizes);
        params.set("merge_strategy", mergeStrategy);
      }
      const res = await fetch(`${API_URL}/chunk/?${params.toString()}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Chunking failed");
      const data = await res.json();
      setChunks(data.chunks);
      setMetadata(data.metadata);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">RAG Chunking Strategy Visualizer</h1>
      <div className="mb-4">
        <FileUpload onFileSelect={handleFileSelect} />
        <Button className="mt-2" onClick={handleUpload} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
        {filename && <div className="text-xs text-muted-foreground mt-1">Uploaded: {filename}</div>}
      </div>
      <div className="mb-4 w-full flex flex-col gap-4">
        <div className="w-full flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label htmlFor="strategySelector" className="text-sm font-medium mb-1">Chunking Strategy</label>
            <StrategySelector
              id="strategySelector"
              strategies={strategies}
              value={strategy}
              onChange={setStrategy}
            />
          </div>
          {/* Standard params (only for non-advanced strategies) */}
          {strategy !== "semantic_chunking" && strategy !== "hierarchical_chunking" && (
            <>
              <div className="flex flex-col flex-1 min-w-[140px]">
                <label htmlFor="chunkSize" className="text-sm font-medium mb-1 flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">Chunk Size</span>
                    </TooltipTrigger>
                    <TooltipContent>Controls the number of tokens or characters in each chunk.</TooltipContent>
                  </Tooltip>
                </label>
                <input
                  id="chunkSize"
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={chunkSize}
                  min={1}
                  max={5000}
                  onChange={e => setChunkSize(Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col flex-1 min-w-[140px]">
                <label htmlFor="chunkOverlap" className="text-sm font-medium mb-1 flex items-center gap-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">Overlap</span>
                    </TooltipTrigger>
                    <TooltipContent>Controls the number of tokens or characters shared between adjacent chunks.</TooltipContent>
                  </Tooltip>
                </label>
                <input
                  id="chunkOverlap"
                  type="number"
                  className="border rounded px-2 py-1 w-full"
                  value={chunkOverlap}
                  min={0}
                  max={1000}
                  onChange={e => setChunkOverlap(Number(e.target.value))}
                />
              </div>
            </>
          )}
          {/* Semantic Chunking Params */}
          {strategy === "semantic_chunking" && (
            <div className="flex flex-col flex-1 min-w-[180px]">
              <label htmlFor="similarityThreshold" className="text-sm font-medium mb-1 flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">Similarity Threshold</span>
                  </TooltipTrigger>
                  <TooltipContent>Threshold for semantic similarity between sentences (0.1-0.9, default 0.7).</TooltipContent>
                </Tooltip>
              </label>
              <input
                id="similarityThreshold"
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={similarityThreshold}
                min={0.1}
                max={0.9}
                step={0.01}
                onChange={e => setSimilarityThreshold(Number(e.target.value))}
              />
              <label htmlFor="maxSemanticChunkSize" className="text-xs text-muted-foreground mt-1">Max Chunk Size (optional)</label>
              <input
                id="maxSemanticChunkSize"
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={maxSemanticChunkSize ?? ""}
                min={1}
                max={5000}
                onChange={e => setMaxSemanticChunkSize(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          )}
          {/* Hierarchical Chunking Params */}
          {strategy === "hierarchical_chunking" && (
            <div className="flex flex-col flex-1 min-w-[180px]">
              <label htmlFor="levelSizes" className="text-sm font-medium mb-1 flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">Level Sizes</span>
                  </TooltipTrigger>
                  <TooltipContent>Comma-separated chunk sizes for each level (e.g., 1000,500).</TooltipContent>
                </Tooltip>
              </label>
              <input
                id="levelSizes"
                type="text"
                className="border rounded px-2 py-1 w-full"
                value={levelSizes}
                onChange={e => setLevelSizes(e.target.value)}
              />
              <label htmlFor="mergeStrategy" className="text-xs text-muted-foreground mt-1">Merge Strategy</label>
              <select
                id="mergeStrategy"
                className="border rounded px-2 py-1 w-full"
                value={mergeStrategy}
                onChange={e => setMergeStrategy(e.target.value)}
              >
                <option value="concat">concat</option>
                <option value="join">join</option>
              </select>
            </div>
          )}
          <div className="flex flex-row gap-2 mt-4 md:mt-0">
            <Button onClick={handleChunk} disabled={!filename || loading}>
              {loading ? "Processing..." : "Chunk & Visualize"}
            </Button>
            <Button variant="outline" type="button" onClick={() => {
              setFile(null);
              setFilename("");
              setChunks([]);
              setMetadata([]);
              setError("");
            }}>
              Reset
            </Button>
          </div>
        </div>
      </div>
      {/* Parameter Preview for advanced strategies */}
      {strategy === "semantic_chunking" && (
        <>
          <ParameterPreview param="similarity_threshold" value={similarityThreshold} />
          {maxSemanticChunkSize && <ParameterPreview param="max_chunk_size" value={maxSemanticChunkSize} />}
        </>
      )}
      {strategy === "hierarchical_chunking" && (
        <>
          <ParameterPreview param="level_sizes" value={levelSizes} />
          <ParameterPreview param="merge_strategy" value={mergeStrategy} />
        </>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {chunks.length > 0 && (
        <>
          {/* Only show ChunkChart if metadata is an array of objects with index/size */}
          {Array.isArray(metadata) && metadata.length > 0 && metadata[0]?.index !== undefined && metadata[0]?.size !== undefined ? (
            <ChunkChart metadata={metadata} />
          ) : strategy === "hierarchical_chunking" ? (
            <div className="text-sm text-muted-foreground my-2">No chunk chart available for hierarchical_chunking (metadata: {JSON.stringify(metadata)})</div>
          ) : null}
          <ChunkList chunks={chunks} metadata={metadata} />
        </>
      )}
    </div>
  );
}

export default App;
