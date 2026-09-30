"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Code,
  Eye,
  Edit3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  UploadCloud,
  Maximize2,
  Minimize2,
  Undo,
  Redo,
} from "lucide-react";
import { api } from "@/lib/api";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your article story here...",
  minHeight = "360px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "html">("edit");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync incoming value to contentEditable when not focused
  useEffect(() => {
    if (editorRef.current && activeTab === "edit") {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, activeTab]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (activeTab !== "edit") setActiveTab("edit");
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInsertLink = () => {
    const url = prompt("Enter hyperlink URL (e.g. https://...):");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      const imageUrl = await api.uploadFile(file);

      // Insert image at cursor or append
      editorRef.current?.focus();
      const imgHtml = `<img src="${imageUrl}" alt="Blog illustration" class="rounded-2xl max-w-full my-6 shadow-sm mx-auto object-cover" />`;
      document.execCommand("insertHTML", false, imgHtml);
      handleInput();
    } catch (err: any) {
      setUploadError(err.message || "Image upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFormatBlock = (tag: string) => {
    executeCommand("formatBlock", tag);
  };

  return (
    <div
      className={`border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all shadow-xs flex flex-col ${
        isFullscreen ? "fixed inset-4 z-50 shadow-2xl max-h-none h-[calc(100vh-2rem)]" : "relative w-full"
      }`}
    >
      {/* Editor Top Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex flex-wrap items-center justify-between gap-1.5 text-gray-700 select-none">
        <div className="flex flex-wrap items-center gap-1">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-200/80 p-0.5 rounded-lg text-xs font-semibold mr-2">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                activeTab === "edit" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editor
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                activeTab === "preview" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("html")}
              className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                activeTab === "html" ? "bg-white text-gray-900 shadow-xs" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Code className="w-3.5 h-3.5 text-amber-600" />
              HTML
            </button>
          </div>

          {activeTab === "edit" && (
            <>
              {/* Headings */}
              <div className="flex items-center border-r border-gray-200 pr-1.5 mr-1 gap-0.5">
                <button
                  type="button"
                  onClick={() => handleFormatBlock("<h2>")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900"
                  title="Heading 2"
                >
                  <Heading1 className="w-4 h-4 text-[#558b1a]" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatBlock("<h3>")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900"
                  title="Heading 3"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatBlock("<h4>")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-900"
                  title="Heading 4"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatBlock("<p>")}
                  className="px-2 py-1 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600"
                  title="Normal Paragraph"
                >
                  P
                </button>
              </div>

              {/* Formatting buttons */}
              <div className="flex items-center border-r border-gray-200 pr-1.5 mr-1 gap-0.5">
                <button
                  type="button"
                  onClick={() => executeCommand("bold")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("italic")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("underline")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("strikeThrough")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>
              </div>

              {/* Alignment & Lists */}
              <div className="flex items-center border-r border-gray-200 pr-1.5 mr-1 gap-0.5">
                <button
                  type="button"
                  onClick={() => executeCommand("insertUnorderedList")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("insertOrderedList")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleFormatBlock("<blockquote>")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
              </div>

              {/* Links & Alignment */}
              <div className="flex items-center border-r border-gray-200 pr-1.5 mr-1 gap-0.5">
                <button
                  type="button"
                  onClick={handleInsertLink}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-emerald-700"
                  title="Insert Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("unlink")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Remove Link"
                >
                  <Unlink className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("justifyLeft")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Align Left"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("justifyCenter")}
                  className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Align Center"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
              </div>

              {/* Image Uploader */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Upload and insert image from Cloudinary"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>{isUploading ? "Uploading..." : "Insert Image"}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </>
          )}
        </div>

        {/* Right side tools */}
        <div className="flex items-center gap-1 ml-auto">
          {activeTab === "edit" && (
            <>
              <button
                type="button"
                onClick={() => executeCommand("undo")}
                className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600"
                title="Undo"
              >
                <Undo className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand("redo")}
                className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600"
                title="Redo"
              >
                <Redo className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="bg-red-50 text-red-700 px-4 py-1.5 text-xs border-b border-red-100">
          Upload Error: {uploadError}
        </div>
      )}

      {/* Editor Body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "edit" && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="p-5 focus:outline-none text-gray-900 leading-relaxed text-sm prose max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
          />
        )}

        {activeTab === "preview" && (
          <div className="p-6 bg-white min-h-[360px]">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 inline-block px-2.5 py-1 rounded-full mb-4">
              Article Preview Render
            </div>
            <div
              className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: value || "<p class='text-gray-400 italic'>No content written yet.</p>" }}
            />
          </div>
        )}

        {activeTab === "html" && (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            className="w-full p-4 font-mono text-xs text-gray-800 bg-gray-900/5 focus:outline-none resize-y"
            placeholder="<p>Raw HTML content...</p>"
          />
        )}
      </div>

      {/* Footer bar */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex items-center justify-between text-[11px] text-gray-500">
        <span>
          Word count:{" "}
          <strong className="text-gray-700">
            {value ? value.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length : 0}
          </strong>{" "}
          words
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          WYSIWYG Rich Editor Active
        </span>
      </div>
    </div>
  );
}
