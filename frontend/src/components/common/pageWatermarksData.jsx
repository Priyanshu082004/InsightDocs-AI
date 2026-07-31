import {
  Sparkles,
  MessageSquare,
  Shield,
  Settings,
  FileText,
  LayoutGrid,
  Lock,
  Search,
  Cloud,
  BookOpen,
  Tag,
  Layers,
  Zap,
  ShieldCheck,
  Table,
} from "lucide-react";

// Barely-visible watermark icons that give the page its faint textured
// background, matching the reference design. Positions are percentages of
// the shared Navbar+Hero canvas (see PageBackground), so a couple of icons
// sit up near the nav row itself, just like the reference.
export const PAGE_WATERMARKS = [
  { icon: Sparkles, position: "top-[3%] left-[8%]" },
  { icon: MessageSquare, position: "top-[1%] left-[93%]" },
  { icon: Shield, position: "top-[13%] left-[78%]" },
  { icon: Settings, position: "top-[12%] left-[32%]" },
  { icon: FileText, position: "top-[34%] left-[93%]" },
  { icon: LayoutGrid, position: "top-[38%] left-[3%]" },
  { icon: Sparkles, position: "top-[56%] left-[68%]" },
  { icon: Lock, position: "top-[78%] left-[3%]" },
  { icon: Shield, position: "top-[80%] left-[81%]" },
  { icon: FileText, position: "top-[97%] left-[38%]" },
  { icon: Search, position: "top-[6%] left-[52%]" },
  { icon: Cloud, position: "top-[22%] left-[16%]" },
  { icon: BookOpen, position: "top-[28%] left-[60%]" },
  { icon: Tag, position: "top-[46%] left-[24%]" },
  { icon: Layers, position: "top-[48%] left-[85%]" },
  { icon: Zap, position: "top-[64%] left-[45%]" },
  { icon: ShieldCheck, position: "top-[68%] left-[14%]" },
  { icon: Table, position: "top-[72%] left-[92%]" },
  { icon: MessageSquare, position: "top-[88%] left-[60%]" },
  { icon: Settings, position: "top-[92%] left-[10%]" },
];