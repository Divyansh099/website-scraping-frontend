import React, { useState } from "react";
import axios from "axios";

const SitemapGenerator = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSitemap = async () => {
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "https://sitemap-generator-v8fa.onrender.com",
        { url },
        { responseType: "blob" }
      );
      
      const blob = new Blob([response.data], { type: "application/xml" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "sitemap.xml";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to generate sitemap. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-center mb-4">Sitemap Generator</h2>
        <input
          type="text"
          className="w-full p-2 border rounded-lg mb-4"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
          onClick={generateSitemap}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Sitemap"}
        </button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default SitemapGenerator;
