import {
  UploadCloud,
  FileCode2,
  Brain,
  Search,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "Upload Document",
    description: "Upload your PDFs, DOCX, or images securely.",
    icon: UploadCloud,
    color: "green",
  },
  {
    number: 2,
    title: "Extract Content",
    description: "We extract text, tables, and metadata using OCR.",
    icon: FileCode2,
    color: "orange",
  },
  {
    number: 3,
    title: "AI Understands",
    description: "Our AI analyzes and understands the content deeply.",
    icon: Brain,
    color: "purple",
  },
  {
    number: 4,
    title: "Smart Retrieval",
    description: "Relevant information is retrieved using vector search.",
    icon: Search,
    color: "green",
  },
  {
    number: 5,
    title: "Ask Anything",
    description: "Chat naturally and ask questions about your docs.",
    icon: MessageCircle,
    color: "blue",
  },
  {
    number: 6,
    title: "Get Insights",
    description: "Get accurate, cited answers with insights.",
    icon: Sparkles,
    color: "orange",
  },
];