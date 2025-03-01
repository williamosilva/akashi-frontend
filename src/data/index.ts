import { Database, Layers, Zap, Lock } from "lucide-react";

export const features = [
  {
    name: "Advanced Data Management",
    description:
      "Centralize, organize, and optimize your data workflows with intuitive tools and powerful analytics.",
    icon: Database,
  },
  {
    name: "Scalable Architecture",
    description:
      "Flexible infrastructure that grows with your business, ensuring performance and reliability.",
    icon: Layers,
  },
  {
    name: "Instant Automation",
    description:
      "Streamline repetitive tasks and reduce manual intervention with smart, configurable workflows.",
    icon: Zap,
  },
  {
    name: "Enterprise Security",
    description: "Secure and Scalable Infrastructure for Your Applications.",
    icon: Lock,
  },
];

export const plans = [
  {
    name: "Free",
    price: "$0",
    type: "free",
    features: [
      "Create 1 project",
      "Basic Data Management",
      "Limited API access",
    ],
    notIncluded: ["Multiple projects", "API integration"],
    color: "emerald",
  },
  {
    name: "Basic",
    price: "$1",
    type: "basic",
    features: [
      "Create up to 5 projects",
      "Basic Data Management",
      "Limited API access",
      "Priority support",
    ],
    notIncluded: ["API integration"],
    color: "green",
  },
  {
    name: "Premium",
    price: "$4",
    type: "premium",
    features: [
      "Create up to 10 projects",
      "Advanced API Features",
      "API integration for all projects",
      "24/7 Premium support",
    ],
    notIncluded: [],
    color: "teal",
  },
];

export const featuresStep = [
  {
    step: "Step 1",
    title: "Easy to Use",
    content:
      "Design visual objects that automatically generate structured JSON.",
    image: "/images/first_step.png",
  },
  {
    step: "Step 2",
    title: "Advanced Integration",
    content:
      "Connect external APIs with support for dynamic filters and API Keys.",
    image: "/images/second_step.png",
  },
  {
    step: "Step 3",
    title: "Total Centralization",
    content: "Manage typing and integrations in a unified and efficient way.",
    image: "/images/third_step.png",
  },
];
