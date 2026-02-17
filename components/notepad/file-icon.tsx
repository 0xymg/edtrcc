import React from "react"
import { FileText } from "lucide-react"
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiHtml5,
  SiCss3,
  SiJson,
  SiMarkdown,
  SiGnubash,
  SiMysql,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiGo,
  SiRust,
  SiCplusplus,
  SiDotnet,
  SiYaml,
} from "react-icons/si"
import { DiJava } from "react-icons/di"
import { VscFileCode } from "react-icons/vsc"
import { cn } from "@/lib/utils"

interface FileIconProps {
  language: string
  className?: string
}

const ICON_MAP: Record<string, { icon: React.ElementType; color: string }> = {
  javascript: { icon: SiJavascript, color: "text-yellow-400" },
  jsx: { icon: SiJavascript, color: "text-yellow-400" },
  typescript: { icon: SiTypescript, color: "text-blue-500" },
  tsx: { icon: SiTypescript, color: "text-blue-500" },
  python: { icon: SiPython, color: "text-[#3776AB]" },
  html: { icon: SiHtml5, color: "text-orange-500" },
  css: { icon: SiCss3, color: "text-blue-400" },
  json: { icon: SiJson, color: "text-yellow-600 dark:text-yellow-400" },
  markdown: { icon: SiMarkdown, color: "text-sky-500" },
  bash: { icon: SiGnubash, color: "text-emerald-500" },
  sql: { icon: SiMysql, color: "text-blue-600 dark:text-blue-400" },
  java: { icon: DiJava, color: "text-red-500" },
  c: { icon: VscFileCode, color: "text-blue-400" },
  cpp: { icon: SiCplusplus, color: "text-blue-600" },
  csharp: { icon: SiDotnet, color: "text-violet-500" },
  go: { icon: SiGo, color: "text-cyan-500" },
  rust: { icon: SiRust, color: "text-orange-600 dark:text-orange-400" },
  php: { icon: SiPhp, color: "text-indigo-400" },
  ruby: { icon: SiRuby, color: "text-red-600 dark:text-red-400" },
  swift: { icon: SiSwift, color: "text-orange-500" },
  kotlin: { icon: SiKotlin, color: "text-purple-500" },
  yaml: { icon: SiYaml, color: "text-rose-500" },
  xml: { icon: SiHtml5, color: "text-orange-400" },
  plaintext: { icon: FileText, color: "text-muted-foreground" },
}

export const FileIcon: React.FC<FileIconProps> = ({ language, className }) => {
  const mapping = ICON_MAP[language] || ICON_MAP.plaintext
  const Icon = mapping.icon

  return <Icon className={cn("h-4 w-4 shrink-0", mapping.color, className)} />
}
