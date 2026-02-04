"use client"

import React from "react"

import { useState, useCallback, useEffect, useRef } from "react"
import { X, Plus, FileText, Moon, Sun, Save, Menu, ChevronDown, ChevronRight, Folder, FolderOpen, Edit2, Trash2, Check, Wand2 } from "lucide-react"
import * as prettier from "prettier/standalone"
import prettierPluginBabel from "prettier/plugins/babel"
import prettierPluginEstree from "prettier/plugins/estree"
import prettierPluginHtml from "prettier/plugins/html"
import prettierPluginCss from "prettier/plugins/postcss"
import prettierPluginMarkdown from "prettier/plugins/markdown"
import prettierPluginYaml from "prettier/plugins/yaml"
import prettierPluginTypescript from "prettier/plugins/typescript"
import { cn } from "@/lib/utils"
import { Kbd } from "@/components/ui/kbd"
import hljs from "highlight.js/lib/core"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import python from "highlight.js/lib/languages/python"
import css from "highlight.js/lib/languages/css"
import xml from "highlight.js/lib/languages/xml"
import json from "highlight.js/lib/languages/json"
import markdown from "highlight.js/lib/languages/markdown"
import bash from "highlight.js/lib/languages/bash"
import sql from "highlight.js/lib/languages/sql"
import java from "highlight.js/lib/languages/java"
import cpp from "highlight.js/lib/languages/cpp"
import csharp from "highlight.js/lib/languages/csharp"
import go from "highlight.js/lib/languages/go"
import rust from "highlight.js/lib/languages/rust"
import php from "highlight.js/lib/languages/php"
import ruby from "highlight.js/lib/languages/ruby"
import swift from "highlight.js/lib/languages/swift"
import kotlin from "highlight.js/lib/languages/kotlin"
import yaml from "highlight.js/lib/languages/yaml"

// Register languages
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("python", python)
hljs.registerLanguage("css", css)
hljs.registerLanguage("html", xml)
hljs.registerLanguage("xml", xml)
hljs.registerLanguage("json", json)
hljs.registerLanguage("markdown", markdown)
hljs.registerLanguage("bash", bash)
hljs.registerLanguage("sql", sql)
hljs.registerLanguage("java", java)
hljs.registerLanguage("cpp", cpp)
hljs.registerLanguage("csharp", csharp)
hljs.registerLanguage("go", go)
hljs.registerLanguage("rust", rust)
hljs.registerLanguage("php", php)
hljs.registerLanguage("ruby", ruby)
hljs.registerLanguage("swift", swift)
hljs.registerLanguage("kotlin", kotlin)
hljs.registerLanguage("yaml", yaml)

const LANGUAGES = [
  { id: "plaintext", name: "Plain Text" },
  { id: "javascript", name: "JavaScript" },
  { id: "jsx", name: "JSX" },
  { id: "typescript", name: "TypeScript" },
  { id: "tsx", name: "TSX" },
  { id: "python", name: "Python" },
  { id: "html", name: "HTML" },
  { id: "css", name: "CSS" },
  { id: "json", name: "JSON" },
  { id: "markdown", name: "Markdown" },
  { id: "bash", name: "Bash" },
  { id: "sql", name: "SQL" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "csharp", name: "C#" },
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "php", name: "PHP" },
  { id: "ruby", name: "Ruby" },
  { id: "swift", name: "Swift" },
  { id: "kotlin", name: "Kotlin" },
  { id: "yaml", name: "YAML" },
  { id: "xml", name: "XML" },
]

interface Tab {
  id: string
  name: string
  content: string
  isModified: boolean
  folderId?: string | null
  language: string
}

interface FolderItem {
  id: string
  name: string
  isExpanded: boolean
}

let tabCounter = 1
let folderCounter = 0

export function Notepad() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", name: "Untitled-1", content: "", isModified: false, language: "plaintext" }
  ])
  const [activeTabId, setActiveTabId] = useState<string | null>("1")
  const [editingTabId, setEditingTabId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingFolderName, setEditingFolderName] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [draggedTab, setDraggedTab] = useState<string | null>(null)
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null)
  const [dragOverTab, setDragOverTab] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ tabId: string; x: number; y: number } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [formatError, setFormatError] = useState<string | null>(null)
  const [deleteFolderDialog, setDeleteFolderDialog] = useState<{ folderId: string; folderName: string; fileCount: number } | null>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const languageButtonRef = useRef<HTMLButtonElement>(null)

  const createNewTab = useCallback(() => {
    tabCounter++
    const newTab: Tab = {
      id: String(tabCounter),
      name: `Untitled-${tabCounter}`,
      content: "",
      isModified: false,
      language: "plaintext"
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
  }, [])

  useEffect(() => {
    // Load tabs from localStorage on mount
    const savedTabs = localStorage.getItem("notepad-tabs")
    if (savedTabs) {
      try {
        const parsed = JSON.parse(savedTabs)
        if (parsed && parsed.length > 0) {
          // Ensure all tabs have a language property
          const tabsWithLanguage = parsed.map((tab: Tab) => ({
            ...tab,
            language: tab.language || "plaintext"
          }))
          setTabs(tabsWithLanguage)
          setActiveTabId(tabsWithLanguage[0].id)
        } else {
          // If saved tabs is empty, reset to default
          setTabs([{ id: "1", name: "Untitled-1", content: "", isModified: false, language: "plaintext" }])
          setActiveTabId("1")
        }
      } catch (e) {
        console.error("Failed to load tabs from localStorage")
      }
    }
    
    // Focus textarea on mount
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 0)
  }, [])

  const saveToLocalStorage = useCallback(() => {
    setSaveStatus("saving")
    try {
      localStorage.setItem("notepad-tabs", JSON.stringify(tabs))
      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId
          ? { ...tab, isModified: false }
          : tab
      ))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus(null), 2000)
    } catch (e) {
      console.error("Failed to save to localStorage", e)
    }
  }, [tabs, activeTabId])

  const updateTheme = useCallback((newTheme: "light" | "dark") => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("theme", newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    updateTheme(newTheme)
  }, [theme, updateTheme])

  const activeTab = tabs.find(tab => tab.id === activeTabId)

  const closeTab = useCallback((tabId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      if (newTabs.length === 0) {
        // Return empty array to show empty state
        setActiveTabId("")
        return []
      }
      if (activeTabId === tabId) {
        const closedIndex = prev.findIndex(tab => tab.id === tabId)
        const newActiveIndex = Math.min(closedIndex, newTabs.length - 1)
        setActiveTabId(newTabs[newActiveIndex].id)
      }
      return newTabs
    })
  }, [activeTabId])

  const updateContent = useCallback((content: string) => {
    setTabs(prev => prev.map(tab => {
      if (tab.id !== activeTabId) return tab
      
      // Auto-name file based on first word if still "Untitled-X"
      // Only rename when there's a space/newline (meaning first word is complete)
      let newName = tab.name
      if (tab.name.startsWith("Untitled-") && content.trim()) {
        const hasWordBreak = /[\s\n\r]/.test(content)
        if (hasWordBreak) {
          const firstWord = content.trim().split(/[\s\n\r]+/)[0]
          if (firstWord && firstWord.length > 0 && firstWord.length <= 30) {
            // Remove special characters that aren't good for file names
            const cleanWord = firstWord.replace(/[^a-zA-Z0-9_\-\.]/g, "")
            if (cleanWord.length > 0) {
              newName = cleanWord
            }
          }
        }
      }
      
      return { ...tab, content, isModified: true, name: newName }
    }))
  }, [activeTabId])

  const startRenaming = useCallback((tab: Tab) => {
    setEditingTabId(tab.id)
    setEditingName(tab.name)
  }, [])

  const finishRenaming = useCallback((tabId: string) => {
    if (editingName.trim()) {
      setTabs(prev => prev.map(tab =>
        tab.id === tabId
          ? { ...tab, name: editingName.trim() }
          : tab
      ))
    }
    setEditingTabId(null)
    setEditingName("")
  }, [editingName])

  const handleTabDoubleClick = useCallback((e: React.MouseEvent, tab: Tab) => {
    e.stopPropagation()
    startRenaming(tab)
  }, [startRenaming])

  const handleRenameKeyDown = useCallback((e: React.KeyboardEvent, tabId: string) => {
    if (e.key === "Enter") {
      finishRenaming(tabId)
    } else if (e.key === "Escape") {
      setEditingTabId(null)
      setEditingName("")
    }
  }, [finishRenaming])

  const handleTabBarDoubleClick = useCallback(() => {
    createNewTab()
  }, [createNewTab])

  const createNewFolder = useCallback(() => {
    folderCounter++
    const newFolder: FolderItem = {
      id: `folder-${folderCounter}`,
      name: `New Folder ${folderCounter}`,
      isExpanded: true
    }
    setFolders(prev => [...prev, newFolder])
  }, [])

  const toggleFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.map(folder =>
      folder.id === folderId
        ? { ...folder, isExpanded: !folder.isExpanded }
        : folder
    ))
  }, [])

  const handleDragStart = useCallback((tabId: string) => {
    setDraggedTab(tabId)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedTab(null)
    setDragOverFolder(null)
    setDragOverTab(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleDragEnterFolder = useCallback((folderId: string) => {
    setDragOverFolder(folderId)
  }, [])

  const handleDragLeaveFolder = useCallback(() => {
    setDragOverFolder(null)
  }, [])

  const handleDropOnFolder = useCallback((folderId: string) => {
    if (draggedTab) {
      setTabs(prev => prev.map(tab =>
        tab.id === draggedTab
          ? { ...tab, folderId }
          : tab
      ))
      setDraggedTab(null)
      setDragOverFolder(null)
    }
  }, [draggedTab])

  const handleDropOutsideFolder = useCallback(() => {
    if (draggedTab) {
      setTabs(prev => prev.map(tab =>
        tab.id === draggedTab
          ? { ...tab, folderId: null }
          : tab
      ))
      setDraggedTab(null)
      setDragOverTab(null)
    }
  }, [draggedTab])

  const handleDragOverTab = useCallback((tabId: string, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedTab && draggedTab !== tabId) {
      setDragOverTab(tabId)
    }
  }, [draggedTab])

  const handleDragLeaveTab = useCallback(() => {
    setDragOverTab(null)
  }, [])

  const handleDropOnTab = useCallback((targetTabId: string, e: React.DragEvent) => {
    e.stopPropagation()
    if (draggedTab && draggedTab !== targetTabId) {
      console.log("[v0] Dropping tab", draggedTab, "on", targetTabId)
      setTabs(prev => {
        const draggedIndex = prev.findIndex(t => t.id === draggedTab)
        const targetIndex = prev.findIndex(t => t.id === targetTabId)
        
        console.log("[v0] Dragged index:", draggedIndex, "Target index:", targetIndex)
        
        if (draggedIndex === -1 || targetIndex === -1) return prev
        
        const newTabs = [...prev]
        const [draggedItem] = newTabs.splice(draggedIndex, 1)
        const targetFolderId = prev[targetIndex].folderId
        
        console.log("[v0] Moving to folder:", targetFolderId)
        
        // Insert at target position with the same folderId as target
        newTabs.splice(targetIndex, 0, { ...draggedItem, folderId: targetFolderId })
        
        console.log("[v0] New tabs order:", newTabs.map(t => t.name))
        
        return newTabs
      })
    }
    setDraggedTab(null)
    setDragOverTab(null)
  }, [draggedTab])

  const getFilesInFolder = useCallback((folderId: string | null) => {
    return tabs.filter(tab => (folderId === null ? !tab.folderId : tab.folderId === folderId))
  }, [tabs])

  const deleteFolder = useCallback((folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // Move all files out of folder
    setTabs(prev => prev.map(tab =>
      tab.folderId === folderId
        ? { ...tab, folderId: null }
        : tab
    ))
    setFolders(prev => prev.filter(f => f.id !== folderId))
  }, [])

  const startRenamingFolder = useCallback((folder: FolderItem) => {
    setEditingFolderId(folder.id)
    setEditingFolderName(folder.name)
  }, [])

  const finishRenamingFolder = useCallback((folderId: string) => {
    if (editingFolderName.trim()) {
      setFolders(prev => prev.map(folder =>
        folder.id === folderId
          ? { ...folder, name: editingFolderName.trim() }
          : folder
      ))
    }
    setEditingFolderId(null)
    setEditingFolderName("")
  }, [editingFolderName])

  const handleRenameFolderKeyDown = useCallback((e: React.KeyboardEvent, folderId: string) => {
    if (e.key === "Enter") {
      finishRenamingFolder(folderId)
    } else if (e.key === "Escape") {
      setEditingFolderId(null)
      setEditingFolderName("")
    }
  }, [finishRenamingFolder])

  const handleContextMenu = useCallback((e: React.MouseEvent, tabId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ tabId, x: e.clientX, y: e.clientY })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  const changeLanguage = useCallback((languageId: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === activeTabId
        ? { ...tab, language: languageId }
        : tab
    ))
    setLanguageMenuOpen(false)
  }, [activeTabId])

  const getHighlightedCode = useCallback((content: string, language: string) => {
    if (language === "plaintext" || !content) {
      return content
    }
    try {
      const result = hljs.highlight(content, { language })
      return result.value
    } catch {
      return content
    }
  }, [])

  // Get comment syntax for each language
  const getCommentSyntax = useCallback((language: string): { start: string; end?: string } => {
    const commentMap: Record<string, { start: string; end?: string }> = {
      javascript: { start: "// " },
      jsx: { start: "// " },
      typescript: { start: "// " },
      tsx: { start: "// " },
      python: { start: "# " },
      bash: { start: "# " },
      ruby: { start: "# " },
      yaml: { start: "# " },
      html: { start: "<!-- ", end: " -->" },
      xml: { start: "<!-- ", end: " -->" },
      css: { start: "/* ", end: " */" },
      sql: { start: "-- " },
      java: { start: "// " },
      cpp: { start: "// " },
      csharp: { start: "// " },
      go: { start: "// " },
      rust: { start: "// " },
      php: { start: "// " },
      swift: { start: "// " },
      kotlin: { start: "// " },
    }
    return commentMap[language] || { start: "// " }
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const content = activeTab?.content || ""
      
      // Insert 2 spaces at cursor position
      const newContent = content.substring(0, start) + "  " + content.substring(end)
      updateContent(newContent)
      
      // Move cursor after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      }, 0)
    }
    
    // Cmd/Ctrl + / for toggle comment
    if ((e.metaKey || e.ctrlKey) && e.key === "/") {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const content = activeTab?.content || ""
      const language = activeTab?.language || "plaintext"
      
      if (language === "plaintext") return
      
      const { start: commentStart, end: commentEnd } = getCommentSyntax(language)
      
      // Find the start and end of the current line(s)
      const lineStart = content.lastIndexOf("\n", start - 1) + 1
      const lineEnd = content.indexOf("\n", end)
      const actualLineEnd = lineEnd === -1 ? content.length : lineEnd
      
      // Get selected lines
      const selectedText = content.substring(lineStart, actualLineEnd)
      const lines = selectedText.split("\n")
      
      // Check if all lines are already commented
      const allCommented = lines.every(line => {
        const trimmed = line.trimStart()
        if (commentEnd) {
          return trimmed.startsWith(commentStart.trim()) && line.trimEnd().endsWith(commentEnd.trim())
        }
        return trimmed.startsWith(commentStart.trim())
      })
      
      // Toggle comments
      const newLines = lines.map(line => {
        if (allCommented) {
          // Remove comment
          let newLine = line
          const leadingSpaces = line.match(/^\s*/)?.[0] || ""
          const trimmed = line.trimStart()
          
          if (commentEnd) {
            if (trimmed.startsWith(commentStart.trim())) {
              newLine = trimmed.substring(commentStart.trim().length)
            }
            if (newLine.trimEnd().endsWith(commentEnd.trim())) {
              newLine = newLine.substring(0, newLine.lastIndexOf(commentEnd.trim()))
            }
            return leadingSpaces + newLine.trim()
          } else {
            if (trimmed.startsWith(commentStart.trim())) {
              return leadingSpaces + trimmed.substring(commentStart.length)
            }
          }
          return line
        } else {
          // Add comment
          if (line.trim() === "") return line
          const leadingSpaces = line.match(/^\s*/)?.[0] || ""
          const trimmed = line.trimStart()
          if (commentEnd) {
            return leadingSpaces + commentStart + trimmed + commentEnd
          }
          return leadingSpaces + commentStart + trimmed
        }
      })
      
      const newContent = content.substring(0, lineStart) + newLines.join("\n") + content.substring(actualLineEnd)
      updateContent(newContent)
      
      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = lineStart
        textarea.selectionEnd = lineStart + newLines.join("\n").length
      }, 0)
    }
  }, [activeTab?.content, activeTab?.language, updateContent, getCommentSyntax])

  const formatCode = useCallback(async () => {
    if (!activeTab?.content || activeTab.language === "plaintext") {
      return
    }

    setIsFormatting(true)
    setFormatError(null)

    // Map language to Prettier parser
    const parserMap: Record<string, { parser: string; plugins: prettier.Plugin[] }> = {
      javascript: { parser: "babel", plugins: [prettierPluginBabel, prettierPluginEstree] },
      jsx: { parser: "babel", plugins: [prettierPluginBabel, prettierPluginEstree] },
      typescript: { parser: "typescript", plugins: [prettierPluginTypescript, prettierPluginEstree] },
      tsx: { parser: "typescript", plugins: [prettierPluginTypescript, prettierPluginEstree] },
      html: { parser: "html", plugins: [prettierPluginHtml] },
      css: { parser: "css", plugins: [prettierPluginCss] },
      json: { parser: "json", plugins: [prettierPluginBabel, prettierPluginEstree] },
      markdown: { parser: "markdown", plugins: [prettierPluginMarkdown] },
      yaml: { parser: "yaml", plugins: [prettierPluginYaml] },
      xml: { parser: "html", plugins: [prettierPluginHtml] },
    }

    const config = parserMap[activeTab.language]
    
    if (!config) {
      setFormatError(`Formatting not supported for ${LANGUAGES.find(l => l.id === activeTab.language)?.name || activeTab.language}`)
      setIsFormatting(false)
      setTimeout(() => setFormatError(null), 3000)
      return
    }

    try {
      const formatted = await prettier.format(activeTab.content, {
        parser: config.parser,
        plugins: config.plugins,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: false,
        trailingComma: "es5",
        printWidth: 80,
      })

      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId
          ? { ...tab, content: formatted, isModified: true }
          : tab
      ))
    } catch (error) {
      setFormatError(error instanceof Error ? error.message : "Failed to format code")
      setTimeout(() => setFormatError(null), 3000)
    } finally {
      setIsFormatting(false)
    }
  }, [activeTab, activeTabId])

  const deleteFile = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      if (activeTabId === tabId && newTabs.length > 0) {
        const closedIndex = prev.findIndex(tab => tab.id === tabId)
        const newActiveIndex = Math.min(closedIndex, newTabs.length - 1)
        setActiveTabId(newTabs[newActiveIndex].id)
      } else if (newTabs.length === 0) {
        setActiveTabId(null)
      }
      return newTabs
    })
    closeContextMenu()
  }, [activeTabId, closeContextMenu])

  const renameFileFromContext = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab) {
      startRenaming(tab)
    }
    closeContextMenu()
  }, [tabs, startRenaming, closeContextMenu])

  useEffect(() => {
    // Check system preference on mount
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const initialTheme = savedTheme || (isDark ? "dark" : "light")
    setTheme(initialTheme)
    updateTheme(initialTheme)
  }, [updateTheme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault()
        saveToLocalStorage()
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "j") {
        e.preventDefault()
        createNewTab()
      }
      // Format with Shift+Alt+F (like VS Code)
      if (e.shiftKey && e.altKey && e.key === "F") {
        e.preventDefault()
        formatCode()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [saveToLocalStorage, createNewTab, formatCode])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      closeContextMenu()
      // Close language menu if clicked outside
      if (
        languageMenuOpen &&
        languageMenuRef.current &&
        languageButtonRef.current &&
        !languageMenuRef.current.contains(e.target as Node) &&
        !languageButtonRef.current.contains(e.target as Node)
      ) {
        setLanguageMenuOpen(false)
      }
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [closeContextMenu, languageMenuOpen])

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border bg-card" onDoubleClick={handleTabBarDoubleClick}>
        <div className="flex flex-1 items-center overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              onDoubleClick={(e) => handleTabDoubleClick(e, tab)}
              className={cn(
                "group flex items-center gap-2 border-r border-border px-3 py-2 text-sm transition-colors",
                tab.id === activeTabId
                  ? "bg-background text-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
                  <FileText className="h-4 w-4 shrink-0" />
              {editingTabId === tab.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => finishRenaming(tab.id)}
                  onKeyDown={(e) => handleRenameKeyDown(e, tab.id)}
                  className="max-w-32 truncate bg-background px-1 text-foreground outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="max-w-32 truncate">{tab.name}</span>
              )}
              {tab.isModified && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              )}
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
                aria-label={`Close ${tab.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </button>
          ))}
        </div>
        <button
          onClick={createNewTab}
          className="flex h-full items-center px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="New tab"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Editor with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          "flex flex-col border-r border-border bg-card transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0"
        )}>
          {sidebarOpen && (
            <>
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <h2 className="text-sm font-semibold text-foreground">Files</h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={createNewFolder}
                    className="rounded p-1 transition-colors hover:bg-accent"
                    title="New folder"
                    aria-label="New folder"
                  >
                    <Folder className="h-4 w-4" />
                  </button>
                  <button
                    onClick={createNewTab}
                    className="rounded p-1 transition-colors hover:bg-accent"
                    title="New file"
                    aria-label="New file"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded p-1 transition-colors hover:bg-accent"
                    aria-label="Close sidebar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  <div className="space-y-1">
                    {/* Root level files */}
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={handleDropOutsideFolder}
                      className="min-h-[40px]"
                    >
                      {getFilesInFolder(null).map(tab => (
                        <button
                          key={tab.id}
                          draggable
                          onDragStart={() => handleDragStart(tab.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOverTab(tab.id, e)}
                          onDragLeave={handleDragLeaveTab}
                          onDrop={(e) => handleDropOnTab(tab.id, e)}
                          onClick={() => setActiveTabId(tab.id)}
                          onContextMenu={(e) => handleContextMenu(e, tab.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left cursor-pointer relative",
                            tab.id === activeTabId
                              ? "bg-secondary text-foreground"
                              : "text-foreground hover:bg-accent",
                            dragOverTab === tab.id && "border-b-2 border-primary"
                          )}
                        >
                          <FileText className="h-4 w-4 shrink-0" />
                          <span className="truncate flex-1">{tab.name}</span>
                          {tab.isModified && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-destructive" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Folders */}
                    {folders.map(folder => (
                      <div key={folder.id} className="space-y-1">
                        <div
                          onDragOver={handleDragOver}
                          onDragEnter={() => handleDragEnterFolder(folder.id)}
                          onDragLeave={handleDragLeaveFolder}
                          onDrop={() => handleDropOnFolder(folder.id)}
                          className={cn(
                            "flex items-center justify-between gap-1 px-2 py-1.5 rounded text-sm transition-colors cursor-pointer group",
                            "text-foreground hover:bg-accent",
                            dragOverFolder === folder.id && "bg-primary/20 ring-2 ring-primary"
                          )}
                        >
                          <button
                            onClick={() => {
                              if (editingFolderId !== folder.id) {
                                toggleFolder(folder.id)
                              }
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation()
                              startRenamingFolder(folder)
                            }}
                            className="flex items-center gap-1 flex-1 justify-start"
                          >
                            {folder.isExpanded ? (
                              <ChevronDown className="h-4 w-4 shrink-0" />
                            ) : (
                              <ChevronRight className="h-4 w-4 shrink-0" />
                            )}
                            {folder.isExpanded ? (
                              <FolderOpen className="h-4 w-4 shrink-0" />
                            ) : (
                              <Folder className="h-4 w-4 shrink-0" />
                            )}
                            {editingFolderId === folder.id ? (
                              <input
                                autoFocus
                                value={editingFolderName}
                                onChange={(e) => setEditingFolderName(e.target.value)}
                                onBlur={() => finishRenamingFolder(folder.id)}
                                onKeyDown={(e) => handleRenameFolderKeyDown(e, folder.id)}
                                className="flex-1 bg-background px-1 text-foreground outline-none rounded"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span className="truncate flex-1">{folder.name}</span>
                            )}
                          </button>
                          <button
                            onClick={(e) => deleteFolder(folder.id, e)}
                            className="opacity-0 group-hover:opacity-100 rounded p-0.5 hover:bg-destructive/10"
                            aria-label="Delete folder"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        
                        {folder.isExpanded && (
                          <div className="ml-4 space-y-1">
                            {getFilesInFolder(folder.id).map(tab => (
                              <button
                                key={tab.id}
                                draggable
                                onDragStart={() => handleDragStart(tab.id)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOverTab(tab.id, e)}
                                onDragLeave={handleDragLeaveTab}
                                onDrop={(e) => handleDropOnTab(tab.id, e)}
                                onClick={() => setActiveTabId(tab.id)}
                                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                                className={cn(
                                  "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left cursor-pointer relative",
                                  tab.id === activeTabId
                                    ? "bg-secondary text-foreground"
                                    : "text-foreground hover:bg-accent",
                                  dragOverTab === tab.id && "border-b-2 border-primary"
                                )}
                              >
                                <FileText className="h-4 w-4 shrink-0" />
                                <span className="truncate flex-1">{tab.name}</span>
                                {tab.isModified && (
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-destructive" />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main editor area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {tabs.length === 0 ? (
            /* Empty state */
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-6 text-center">
                <FileText className="h-16 w-16 text-muted-foreground/50" />
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">No files open</h2>
                  <p className="text-sm text-muted-foreground">Create a new file to get started</p>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={createNewTab}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Plus className="h-4 w-4" />
                    New File
                  </button>
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>Press</span>
                      <Kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
                      <span>+</span>
                      <Kbd>J</Kbd>
                      <span>to create a new file</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Press</span>
                      <Kbd>{navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
                      <span>+</span>
                      <Kbd>S</Kbd>
                      <span>to save</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Line numbers and editor */
            <div className="flex flex-1 overflow-hidden">
              <div className="w-12 shrink-0 select-none border-r border-border bg-card py-3 text-right font-mono text-xs text-muted-foreground">
                {(activeTab?.content || "").split("\n").map((_, i) => (
                  <div key={i} className="px-2 leading-6">
                    {i + 1}
                  </div>
                ))}
                {!(activeTab?.content) && (
                  <div className="px-2 leading-6">1</div>
                )}
              </div>

{/* Text area with syntax highlighting */}
  <div className="relative flex-1 overflow-auto">
  {/* Syntax highlighted background */}
  {activeTab?.language !== "plaintext" && activeTab?.content && (
  <pre
  className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre-wrap break-words p-3 font-mono text-sm leading-6"
  aria-hidden="true"
  // biome-ignore lint/security/noDangerouslySetInnerHtml: safe for syntax highlighting
  dangerouslySetInnerHTML={{
    __html: getHighlightedCode(activeTab.content, activeTab.language)
  }}
  />
  )}
  {/* Actual textarea for editing */}
  <textarea
  ref={textareaRef}
  value={activeTab?.content || ""}
  onChange={(e) => updateContent(e.target.value)}
  onKeyDown={handleKeyDown}
  className={cn(
    "absolute inset-0 h-full w-full resize-none bg-transparent p-3 font-mono text-sm leading-6 outline-none placeholder:text-muted-foreground",
    activeTab?.language !== "plaintext" && activeTab?.content
    ? "text-transparent caret-foreground"
    : "text-foreground"
  )}
  placeholder="Start typing..."
  spellCheck={false}
  />
  </div>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 min-w-[160px] rounded-md border border-border bg-popover p-1 shadow-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => renameFileFromContext(contextMenu.tabId)}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent"
          >
            <Edit2 className="h-4 w-4" />
            <span>Rename</span>
          </button>
          <button
            onClick={() => deleteFile(contextMenu.tabId)}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-border bg-card px-3 py-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded p-1 transition-colors hover:bg-accent"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <Menu className="h-4 w-4" />
          </button>
          <span>
            Lines: {(activeTab?.content || "").split("\n").length}
          </span>
          <span>
            Length: {(activeTab?.content || "").length}
          </span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-foreground">
          EDTR.CC
        </div>
        <div className="flex items-center gap-4">
          {saveStatus && (
            <span className={cn(
              "transition-colors",
              saveStatus === "saved" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
            )}>
              {saveStatus === "saved" ? "✓ Saved" : "Saving..."}
            </span>
          )}
{formatError && (
            <span className="max-w-48 truncate text-destructive" title={formatError}>
              Syntax Error
            </span>
          )}
          <button
            onClick={formatCode}
            disabled={isFormatting || activeTab?.language === "plaintext"}
            className={cn(
              "flex items-center gap-1 rounded px-2 py-0.5 transition-colors hover:bg-accent",
              (isFormatting || activeTab?.language === "plaintext") && "cursor-not-allowed opacity-50"
            )}
            title="Format code (Prettier)"
            aria-label="Format code"
          >
            <Wand2 className={cn("h-3.5 w-3.5", isFormatting && "animate-spin")} />
            <span className="hidden sm:inline">{isFormatting ? "Formatting..." : "Format"}</span>
          </button>
          <span>UTF-8</span>
  <div className="relative">
  <button
  ref={languageButtonRef}
  onClick={(e) => {
    e.stopPropagation()
    setLanguageMenuOpen(!languageMenuOpen)
  }}
  className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-accent"
  >
  <span>{LANGUAGES.find(l => l.id === activeTab?.language)?.name || "Plain Text"}</span>
  <ChevronDown className="h-3 w-3" />
  </button>
  {languageMenuOpen && (
  <div
  ref={languageMenuRef}
  className="absolute bottom-full right-0 mb-1 max-h-64 w-48 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg"
  onClick={(e) => e.stopPropagation()}
  >
  {LANGUAGES.map(lang => (
    <button
    key={lang.id}
    onClick={() => changeLanguage(lang.id)}
    className={cn(
      "flex w-full items-center justify-between rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent",
      activeTab?.language === lang.id && "bg-accent"
    )}
    >
    <span>{lang.name}</span>
    {activeTab?.language === lang.id && (
      <Check className="h-4 w-4" />
    )}
    </button>
  ))}
  </div>
  )}
  </div>
  <button
            onClick={saveToLocalStorage}
            className="rounded p-1 transition-colors hover:bg-accent"
            title="Save (Ctrl+S / Cmd+S)"
            aria-label="Save document"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={toggleTheme}
            className="rounded p-1 transition-colors hover:bg-accent"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
