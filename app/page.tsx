"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleClick = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await res.json();

      setResult(data.response);

      await fetchHistory();
    } catch (error) {
      console.error(error);
      setResult("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">
        DevOps AI Assistant
      </h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Generate Dockerfile for Flask App..."
        className="border p-4 rounded-lg w-full max-w-3xl h-40"
      />

      <button
        onClick={handleClick}
        className="mt-4 bg-black text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      <div className="mt-6 w-full max-w-3xl">
        <h2 className="font-bold text-xl mb-2">
          Output
        </h2>

        <pre className="bg-white text-black border p-4 rounded-lg overflow-auto whitespace-pre-wrap">
          {result}
        </pre>
      </div>

      <div className="mt-8 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">
          Previous Generations
        </h2>

        {history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          history.map((item: any, index: number) => (
            <div
              key={index}
              className="border rounded-lg p-4 mb-3"
            >
              <p>
                <strong>Prompt:</strong> {item.prompt}
              </p>

              <pre className="bg-gray-100 text-black p-3 rounded mt-2 whitespace-pre-wrap">
                {item.response}
              </pre>
            </div>
          ))
        )}
      </div>
    </main>
  );
}