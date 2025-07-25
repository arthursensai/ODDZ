"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("error copying: ", err);
    }
  };

  return (
    <Copy
      onClick={handleCopy}
      className={`cursor-pointer transition-all duration-300 p-2 rounded !w-10 !h-10 ${
        copied ? "text-green-500 bg-green-100" : "text-blue-600 hover:bg-blue-100"
      }`}
    />
  );
};

export default CopyButton;