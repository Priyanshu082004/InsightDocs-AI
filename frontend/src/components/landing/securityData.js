import {
  ShieldCheck,
  User,
  ClipboardList,
  KeyRound,
  Brain,
  CloudUpload,
} from "lucide-react";

export const SECURITY_LEFT_ITEMS = [
  {
    title: "End-to-End Encryption",
    description: "All your data is encrypted in transit and at rest.",
    icon: ShieldCheck,
    color: "green",
  },
  {
    title: "Role-Based Access",
    description:
      "Granular permissions and roles to keep your data in the right hands.",
    icon: User,
    color: "orange",
  },
  {
    title: "Audit Logs",
    description: "Track every action with detailed audit logs.",
    icon: ClipboardList,
    color: "purple",
  },
];

export const SECURITY_RIGHT_ITEMS = [
  {
    title: "Secure Authentication",
    description: "JWT-based authentication with refresh token rotation.",
    icon: KeyRound,
    color: "orange",
  },
  {
    title: "AI Privacy First",
    description: "Your data is never used to train AI models. Period.",
    icon: Brain,
    color: "purple",
  },
  {
    title: "Secure Storage",
    description: "Documents are stored in encrypted, private storage.",
    icon: CloudUpload,
    color: "green",
  },
];