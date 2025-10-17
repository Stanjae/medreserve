'use client';
import { useState } from "react";
import { toast } from "sonner";

const useHandleCopyToClipBoard = () => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (text: string): Promise<boolean> => {
      try {
        // Modern Clipboard API (preferred)
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          return true;
        } else {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = text;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          const successful = document.execCommand("copy");
          textArea.remove();
          return successful;
        }
      } catch (err) {
        console.error("Failed to copy:", err);
        return false;
      }
    };

    const handleCopyToClipboard = async (text: string) => {
      const success = await copyToClipboard(text);
        if (success) {
           setCopied(true);
           setTimeout(() => setCopied(false), 2000);
        toast.success("Copied to clipboard:");
      } else {
        toast.error("Failed to copy to clipboard:");
      }
    };
 return {handleCopyToClipboard, copied}
}

export default useHandleCopyToClipBoard