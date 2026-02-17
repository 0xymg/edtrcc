"use client"

import React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import hljs from "highlight.js/lib/core"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import python from "highlight.js/lib/languages/python"
import css from "highlight.js/lib/languages/css"
import xml from "highlight.js/lib/languages/xml"
import json from "highlight.js/lib/languages/json"
import bash from "highlight.js/lib/languages/bash"
import sql from "highlight.js/lib/languages/sql"
import markdown from "highlight.js/lib/languages/markdown"
import c from "highlight.js/lib/languages/c"
import cpp from "highlight.js/lib/languages/cpp"
import csharp from "highlight.js/lib/languages/csharp"
import java from "highlight.js/lib/languages/java"
import go from "highlight.js/lib/languages/go"
import rust from "highlight.js/lib/languages/rust"
import php from "highlight.js/lib/languages/php"
import ruby from "highlight.js/lib/languages/ruby"
import swift from "highlight.js/lib/languages/swift"
import kotlin from "highlight.js/lib/languages/kotlin"
import yaml from "highlight.js/lib/languages/yaml"
import { Edit2, Trash2, Download } from "lucide-react"
import JSZip from "jszip"

// Import subcomponents
import { Sidebar } from "./notepad/sidebar"
import { TabBar } from "./notepad/tab-bar"
import { EditorArea } from "./notepad/editor-area"
import { StatusBar } from "./notepad/status-bar"

// Types
export interface Tab {
  id: string
  name: string
  content: string
  isModified: boolean
  folderId?: string | null
  language: string
}

export interface FolderItem {
  id: string
  name: string
  isExpanded: boolean
}

// Register languages
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("python", python)
hljs.registerLanguage("css", css)
hljs.registerLanguage("html", xml)
hljs.registerLanguage("xml", xml)
hljs.registerLanguage("json", json)
hljs.registerLanguage("bash", bash)
hljs.registerLanguage("sql", sql)
hljs.registerLanguage("markdown", markdown)
hljs.registerLanguage("c", c)
hljs.registerLanguage("cpp", cpp)
hljs.registerLanguage("csharp", csharp)
hljs.registerLanguage("java", java)
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
  { id: "css", name: "CSS" },
  { id: "html", name: "HTML" },
  { id: "json", name: "JSON" },
  { id: "markdown", name: "Markdown" },
  { id: "bash", name: "Bash" },
  { id: "sql", name: "SQL" },
  { id: "java", name: "Java" },
  { id: "c", name: "C" },
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

const EXTENSION_MAP: Record<string, string> = {
  plaintext: "txt", javascript: "js", jsx: "jsx", typescript: "ts", tsx: "tsx",
  python: "py", css: "css", html: "html", xml: "xml", json: "json",
  markdown: "md", bash: "sh", sql: "sql", java: "java", c: "c",
  cpp: "cpp", csharp: "cs", go: "go", rust: "rs", php: "php",
  ruby: "rb", swift: "swift", kotlin: "kt", yaml: "yaml",
}

function getFilename(tab: Tab): string {
  const ext = EXTENSION_MAP[tab.language] || "txt"
  return tab.name.includes(".") ? tab.name : `${tab.name}.${ext}`
}

let tabCounter = 1
let folderCounter = 0

export function Notepad() {
  // State
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
  const [draggedFolder, setDraggedFolder] = useState<string | null>(null)
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null)
  const [dragOverTab, setDragOverTab] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ type: "tab" | "folder"; id: string; x: number; y: number } | null>(null)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [formatError, setFormatError] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const languageMenuRef = useRef<HTMLDivElement>(null)
  const languageButtonRef = useRef<HTMLButtonElement>(null)
  const editingNameRef = useRef("")
  const editingFolderNameRef = useRef("")

  // Actions
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
    // Auto-start rename mode for new file (open sidebar if needed)
    setSidebarOpen(true)
    editingNameRef.current = newTab.name
    setEditingTabId(newTab.id)
    setEditingName(newTab.name)
  }, [])

  const saveToLocalStorage = useCallback(() => {
    setSaveStatus("saving")
    try {
      localStorage.setItem("notepad-tabs", JSON.stringify(tabs))
      localStorage.setItem("notepad-folders", JSON.stringify(folders))
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
  }, [tabs, folders, activeTabId])

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

  const closeTab = useCallback((tabId: string, e?: React.MouseEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation()
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      if (newTabs.length === 0) {
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
      let newName = tab.name
      if (tab.name.startsWith("Untitled-") && content.trim()) {
        const hasWordBreak = /[\s\n\r]/.test(content)
        if (hasWordBreak) {
          const firstWord = content.trim().split(/[\s\n\r]+/)[0]
          if (firstWord && firstWord.length > 0 && firstWord.length <= 30) {
            const cleanWord = firstWord.replace(/[^a-zA-Z0-9_\-\.]/g, "")
            if (cleanWord.length > 0) newName = cleanWord
          }
        }
      }
      return { ...tab, content, isModified: true, name: newName }
    }))
  }, [activeTabId])

  const startRenaming = useCallback((tab: Tab) => {
    editingNameRef.current = tab.name
    setEditingTabId(tab.id)
    setEditingName(tab.name)
  }, [])

  const updateEditingName = useCallback((name: string) => {
    editingNameRef.current = name
    setEditingName(name)
  }, [])

  const finishRenaming = useCallback((tabId: string) => {
    const name = editingNameRef.current
    if (name === "" && !editingNameRef.current) return
    if (name.trim()) {
      setTabs(prev => prev.map(tab =>
        tab.id === tabId ? { ...tab, name: name.trim() } : tab
      ))
    }
    editingNameRef.current = ""
    setEditingTabId(null)
    setEditingName("")
  }, [])

  const handleRenameKeyDown = useCallback((e: React.KeyboardEvent, tabId: string) => {
    e.stopPropagation()
    if (e.key === "Enter") finishRenaming(tabId)
    else if (e.key === "Escape") {
      editingNameRef.current = ""
      setEditingTabId(null)
      setEditingName("")
    }
  }, [finishRenaming])

  const createNewFolder = useCallback(() => {
    folderCounter++
    const newFolder: FolderItem = {
      id: `folder-${folderCounter}`,
      name: `New Folder`,
      isExpanded: true
    }
    setFolders(prev => [...prev, newFolder])
    editingFolderNameRef.current = newFolder.name
    setEditingFolderId(newFolder.id)
    setEditingFolderName(newFolder.name)
  }, [])

  const toggleFolder = useCallback((folderId: string) => {
    setFolders(prev => prev.map(folder =>
      folder.id === folderId ? { ...folder, isExpanded: !folder.isExpanded } : folder
    ))
  }, [])

  const deleteFolder = useCallback((folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setTabs(prev => prev.map(tab =>
      tab.folderId === folderId ? { ...tab, folderId: null } : tab
    ))
    setFolders(prev => prev.filter(f => f.id !== folderId))
  }, [])

  const startRenamingFolder = useCallback((folder: FolderItem) => {
    editingFolderNameRef.current = folder.name
    setEditingFolderId(folder.id)
    setEditingFolderName(folder.name)
  }, [])

  const updateEditingFolderName = useCallback((name: string) => {
    editingFolderNameRef.current = name
    setEditingFolderName(name)
  }, [])

  const finishRenamingFolder = useCallback((folderId: string) => {
    const name = editingFolderNameRef.current
    if (name.trim()) {
      setFolders(prev => prev.map(folder =>
        folder.id === folderId ? { ...folder, name: name.trim() } : folder
      ))
    }
    editingFolderNameRef.current = ""
    setEditingFolderId(null)
    setEditingFolderName("")
  }, [])

  const handleRenameFolderKeyDown = useCallback((e: React.KeyboardEvent, folderId: string) => {
    e.stopPropagation()
    if (e.key === "Enter") finishRenamingFolder(folderId)
    else if (e.key === "Escape") {
      editingFolderNameRef.current = ""
      setEditingFolderId(null)
      setEditingFolderName("")
    }
  }, [finishRenamingFolder])

  // Drag & Drop
  const dragRef = useRef<{ type: "tab" | "folder"; id: string } | null>(null)

  const handleDragStart = useCallback((tabId: string) => {
    dragRef.current = { type: "tab", id: tabId }
    setDraggedTab(tabId)
  }, [])

  const handleFolderDragStart = useCallback((folderId: string) => {
    dragRef.current = { type: "folder", id: folderId }
    setDraggedFolder(folderId)
  }, [])

  const handleDragEnd = useCallback(() => {
    dragRef.current = null
    setDraggedTab(null)
    setDraggedFolder(null)
    setDragOverFolder(null)
    setDragOverTab(null)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => e.preventDefault(), [])
  const handleDragEnterFolder = useCallback((folderId: string) => setDragOverFolder(folderId), [])
  const handleDragLeaveFolder = useCallback(() => setDragOverFolder(null), [])

  const handleDropOnFolder = useCallback((folderId: string) => {
    const drag = dragRef.current
    if (!drag) return
    if (drag.type === "folder" && drag.id !== folderId) {
      const dragId = drag.id
      setFolders(prev => {
        const draggedIndex = prev.findIndex(f => f.id === dragId)
        const targetIndex = prev.findIndex(f => f.id === folderId)
        if (draggedIndex === -1 || targetIndex === -1) return prev
        const newFolders = [...prev]
        const [dragged] = newFolders.splice(draggedIndex, 1)
        newFolders.splice(targetIndex, 0, dragged)
        return newFolders
      })
    } else if (drag.type === "tab") {
      const tabId = drag.id
      setTabs(prev => prev.map(tab => tab.id === tabId ? { ...tab, folderId } : tab))
    }
    dragRef.current = null
    setDraggedTab(null)
    setDraggedFolder(null)
    setDragOverFolder(null)
  }, [])

  const handleDropOutsideFolder = useCallback(() => {
    const drag = dragRef.current
    if (drag?.type === "tab") {
      const tabId = drag.id
      setTabs(prev => prev.map(tab => tab.id === tabId ? { ...tab, folderId: null } : tab))
    }
    dragRef.current = null
    setDraggedTab(null)
    setDraggedFolder(null)
    setDragOverTab(null)
  }, [])

  const handleDragOverTab = useCallback((tabId: string, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const drag = dragRef.current
    if (drag?.type === "tab" && drag.id !== tabId) setDragOverTab(tabId)
  }, [])

  const handleDragLeaveTab = useCallback(() => setDragOverTab(null), [])

  const handleDropOnTab = useCallback((targetTabId: string, e: React.DragEvent) => {
    e.stopPropagation()
    const drag = dragRef.current
    if (drag?.type === "tab" && drag.id !== targetTabId) {
      const tabId = drag.id
      setTabs(prev => {
        const draggedIndex = prev.findIndex(t => t.id === tabId)
        const targetIndex = prev.findIndex(t => t.id === targetTabId)
        if (draggedIndex === -1 || targetIndex === -1) return prev
        const newTabs = [...prev]
        const [draggedItem] = newTabs.splice(draggedIndex, 1)
        const targetFolderId = prev[targetIndex].folderId
        newTabs.splice(targetIndex, 0, { ...draggedItem, folderId: targetFolderId })
        return newTabs
      })
    }
    dragRef.current = null
    setDraggedTab(null)
    setDraggedFolder(null)
    setDragOverTab(null)
  }, [])

  const handleContextMenu = useCallback((e: React.MouseEvent, tabId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ type: "tab", id: tabId, x: e.clientX, y: e.clientY })
  }, [])

  const handleFolderContextMenu = useCallback((e: React.MouseEvent, folderId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({ type: "folder", id: folderId, x: e.clientX, y: e.clientY })
  }, [])

  const closeContextMenu = useCallback(() => setContextMenu(null), [])

  const changeLanguage = useCallback((languageId: string) => {
    setTabs(prev => prev.map(tab =>
      tab.id === activeTabId ? { ...tab, language: languageId } : tab
    ))
    setLanguageMenuOpen(false)
  }, [activeTabId])

  const getHighlightedCode = useCallback((content: string, language: string) => {
    if (language === "plaintext" || !content) return content
    try {
      return hljs.highlight(content, { language }).value
    } catch {
      return content
    }
  }, [])

  const getWordCount = useCallback((content: string) => {
    if (!content.trim()) return 0
    return content.trim().split(/\s+/).length
  }, [])

  const triggerDownload = useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const downloadFile = useCallback(() => {
    const activeTab = tabs.find(t => t.id === activeTabId)
    if (!activeTab) return
    const blob = new Blob([activeTab.content], { type: "text/plain;charset=utf-8" })
    triggerDownload(blob, getFilename(activeTab))
  }, [tabs, activeTabId, triggerDownload])

  const downloadFileById = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (!tab) return
    const blob = new Blob([tab.content], { type: "text/plain;charset=utf-8" })
    triggerDownload(blob, getFilename(tab))
    closeContextMenu()
  }, [tabs, triggerDownload, closeContextMenu])

  const downloadFolderAsZip = useCallback(async (folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    if (!folder) return
    const folderTabs = tabs.filter(t => t.folderId === folderId)
    const zip = new JSZip()
    folderTabs.forEach(tab => {
      zip.file(getFilename(tab), tab.content)
    })
    const blob = await zip.generateAsync({ type: "blob" })
    triggerDownload(blob, `${folder.name}.zip`)
    closeContextMenu()
  }, [folders, tabs, triggerDownload, closeContextMenu])

  const handlePrint = useCallback(() => {
    const activeTab = tabs.find(t => t.id === activeTabId)
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>EDTR - ${activeTab?.name || 'Untitled'}</title>
            <style>body { font-family: monospace; white-space: pre-wrap; padding: 20px; }</style>
          </head>
          <body>${activeTab?.content || ''}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }, [tabs, activeTabId])

  const getCommentSyntax = useCallback((language: string): { start: string; end?: string } => {
    const commentMap: Record<string, { start: string; end?: string }> = {
      javascript: { start: "// " }, jsx: { start: "// " }, typescript: { start: "// " }, tsx: { start: "// " },
      python: { start: "# " }, bash: { start: "# " }, ruby: { start: "# " }, yaml: { start: "# " },
      html: { start: "<!-- ", end: " -->" }, xml: { start: "<!-- ", end: " -->" },
      css: { start: "/* ", end: " */" }, sql: { start: "-- " }, java: { start: "// " },
      cpp: { start: "// " }, csharp: { start: "// " }, go: { start: "// " }, rust: { start: "// " },
      php: { start: "// " }, swift: { start: "// " }, kotlin: { start: "// " },
    }
    return commentMap[language] || { start: "// " }
  }, [])

  const formatCode = useCallback(() => {
    const activeTab = tabs.find(t => t.id === activeTabId)
    if (!activeTab?.content || activeTab.language === "plaintext") return
    setIsFormatting(true)
    setFormatError(null)
    try {
      let formatted = activeTab.content
      if (activeTab.language === "json") {
        try { formatted = JSON.stringify(JSON.parse(activeTab.content), null, 2) }
        catch {
          setFormatError("Invalid JSON")
          setIsFormatting(false)
          setTimeout(() => setFormatError(null), 3000)
          return
        }
      } else {
        formatted = formatted.split('\n').map(l => l.trimEnd()).join('\n').replace(/\n{3,}/g, '\n\n').trim()
      }
      setTabs(prev => prev.map(tab =>
        tab.id === activeTabId ? { ...tab, content: formatted, isModified: true } : tab
      ))
    } catch (error) {
      setFormatError("Failed to format code")
      setTimeout(() => setFormatError(null), 3000)
    } finally { setIsFormatting(false) }
  }, [tabs, activeTabId])

  const deleteFile = useCallback((tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId)
      if (activeTabId === tabId && newTabs.length > 0) {
        const closedIndex = prev.findIndex(tab => tab.id === tabId)
        setActiveTabId(newTabs[Math.min(closedIndex, newTabs.length - 1)].id)
      } else if (newTabs.length === 0) setActiveTabId(null)
      return newTabs
    })
    closeContextMenu()
  }, [activeTabId, closeContextMenu])

  const renameFileFromContext = useCallback((tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (tab) startRenaming(tab)
    closeContextMenu()
  }, [tabs, startRenaming, closeContextMenu])

  const renameFolderFromContext = useCallback((folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    if (folder) startRenamingFolder(folder)
    closeContextMenu()
  }, [folders, startRenamingFolder, closeContextMenu])

  const deleteFolderFromContext = useCallback((folderId: string) => {
    setTabs(prev => prev.map(tab =>
      tab.folderId === folderId ? { ...tab, folderId: null } : tab
    ))
    setFolders(prev => prev.filter(f => f.id !== folderId))
    closeContextMenu()
  }, [closeContextMenu])

  // Effects
  useEffect(() => {
    const savedTabs = localStorage.getItem("notepad-tabs")
    const savedFolders = localStorage.getItem("notepad-folders")
    if (savedFolders) {
      try { setFolders(JSON.parse(savedFolders)) } catch (e) { }
    }
    if (savedTabs) {
      try {
        const parsed = JSON.parse(savedTabs)
        if (parsed?.length > 0) {
          const tabsWithLanguage = parsed.map((tab: Tab) => ({
            ...tab, language: tab.language || "plaintext", isModified: false
          }))
          setTabs(tabsWithLanguage)
          setActiveTabId(tabsWithLanguage[0].id)
        }
      } catch (e) { }
    }
    setTimeout(() => textareaRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const initialTheme = savedTheme || (isDark ? "dark" : "light")
    setTheme(initialTheme)
    updateTheme(initialTheme)
  }, [updateTheme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.ctrlKey || e.metaKey
      if (isCmd && e.shiftKey && e.key === "s") { e.preventDefault(); downloadFile(); return }
      if (isCmd && e.key === "s") { e.preventDefault(); saveToLocalStorage() }
      if (isCmd && e.key === "j") { e.preventDefault(); createNewTab() }
      if (isCmd && e.key === "k") { e.preventDefault(); if (activeTabId) closeTab(activeTabId, e) }
      if (isCmd && e.key === "l") { e.preventDefault(); setSidebarOpen(prev => !prev) }
      if (e.shiftKey && e.altKey && e.key === "F") { e.preventDefault(); formatCode() }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [saveToLocalStorage, createNewTab, formatCode, activeTabId, closeTab, downloadFile])

  useEffect(() => {
    const handleClick = () => {
      closeContextMenu()
      setLanguageMenuOpen(false)
    }
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [closeContextMenu])

  useEffect(() => {
    if (!tabs.some(tab => tab.isModified)) return
    const timer = setTimeout(() => saveToLocalStorage(), 5000)
    return () => clearTimeout(timer)
  }, [tabs, saveToLocalStorage])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const activeTab = tabs.find(t => t.id === activeTabId)
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const content = activeTab?.content || ""
      updateContent(content.substring(0, start) + "  " + content.substring(e.currentTarget.selectionEnd))
      setTimeout(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2 }, 0)
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "/") {
      e.preventDefault()
      const language = activeTab?.language || "plaintext"
      if (language === "plaintext") return
      const { start: commentStart, end: commentEnd } = getCommentSyntax(language)
      const content = activeTab?.content || ""
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const lineStart = content.lastIndexOf("\n", start - 1) + 1
      const lineEnd = content.indexOf("\n", end)
      const actualLineEnd = lineEnd === -1 ? content.length : lineEnd
      const selectedText = content.substring(lineStart, actualLineEnd)
      const lines = selectedText.split("\n")
      const allCommented = lines.every(line => line.trimStart().startsWith(commentStart.trim()))
      const newLines = lines.map(line => {
        if (allCommented) {
          const lSpaces = line.match(/^\s*/)?.[0] || ""
          let nLine = line.trimStart().substring(commentStart.trim().length)
          if (commentEnd && nLine.trimEnd().endsWith(commentEnd.trim())) {
            nLine = nLine.substring(0, nLine.lastIndexOf(commentEnd.trim()))
          }
          return lSpaces + nLine.trim()
        }
        return line.trim() === "" ? line : (line.match(/^\s*/)?.[0] || "") + commentStart + line.trimStart() + (commentEnd || "")
      })
      updateContent(content.substring(0, lineStart) + newLines.join("\n") + content.substring(actualLineEnd))
    }
  }, [tabs, activeTabId, updateContent, getCommentSyntax])

  const activeTab = tabs.find(t => t.id === activeTabId)

  return (
    <div className="flex h-full flex-col bg-background">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        setActiveTabId={setActiveTabId}
        handleTabBarDoubleClick={() => createNewTab()}
        createNewTab={createNewTab}
        closeTab={closeTab}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          tabs={tabs}
          folders={folders}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
          createNewTab={createNewTab}
          createNewFolder={createNewFolder}
          toggleFolder={toggleFolder}
          deleteFolder={deleteFolder}
          startRenamingFolder={startRenamingFolder}
          editingFolderId={editingFolderId}
          editingFolderName={editingFolderName}
          setEditingFolderName={updateEditingFolderName}
          finishRenamingFolder={finishRenamingFolder}
          handleRenameFolderKeyDown={handleRenameFolderKeyDown}
          editingTabId={editingTabId}
          editingName={editingName}
          setEditingName={updateEditingName}
          finishRenaming={finishRenaming}
          handleRenameKeyDown={handleRenameKeyDown}
          startRenaming={startRenaming}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          handleDragOver={handleDragOver}
          handleDragOverTab={handleDragOverTab}
          handleDragLeaveTab={handleDragLeaveTab}
          handleDropOutsideFolder={handleDropOutsideFolder}
          handleDropOnTab={handleDropOnTab}
          handleContextMenu={handleContextMenu}
          handleFolderContextMenu={handleFolderContextMenu}
          handleDragEnterFolder={handleDragEnterFolder}
          handleDragLeaveFolder={handleDragLeaveFolder}
          handleDropOnFolder={handleDropOnFolder}
          handleFolderDragStart={handleFolderDragStart}
          draggedFolder={draggedFolder}
          dragOverFolder={dragOverFolder}
          dragOverTab={dragOverTab}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <EditorArea
            activeTab={activeTab}
            tabs={tabs}
            textareaRef={textareaRef}
            updateContent={updateContent}
            handleKeyDown={handleKeyDown}
            getHighlightedCode={getHighlightedCode}
            createNewTab={createNewTab}
          />
        </div>
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 min-w-[160px] rounded-md border border-border bg-popover p-1 shadow-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === "tab" ? (
            <>
              <button onClick={() => renameFileFromContext(contextMenu.id)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent"><Edit2 className="h-4 w-4" /><span>Rename</span></button>
              <button onClick={() => downloadFileById(contextMenu.id)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent"><Download className="h-4 w-4" /><span>Download</span></button>
              <button onClick={() => deleteFile(contextMenu.id)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"><Trash2 className="h-4 w-4" /><span>Delete</span></button>
            </>
          ) : (
            <>
              <button onClick={() => renameFolderFromContext(contextMenu.id)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent"><Edit2 className="h-4 w-4" /><span>Rename</span></button>
              <button onClick={() => downloadFolderAsZip(contextMenu.id)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent"><Download className="h-4 w-4" /><span>Download (.zip)</span></button>
              <button onClick={() => deleteFolderFromContext(contextMenu.id)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"><Trash2 className="h-4 w-4" /><span>Delete</span></button>
            </>
          )}
        </div>
      )}

      <StatusBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        getWordCount={getWordCount}
        saveStatus={saveStatus}
        formatError={formatError}
        isFormatting={isFormatting}
        formatCode={formatCode}
        languageMenuOpen={languageMenuOpen}
        setLanguageMenuOpen={setLanguageMenuOpen}
        languageButtonRef={languageButtonRef}
        languages={LANGUAGES}
        changeLanguage={changeLanguage}
        languageMenuRef={languageMenuRef}
        saveToLocalStorage={saveToLocalStorage}
        downloadFile={downloadFile}
        handlePrint={handlePrint}
        toggleTheme={toggleTheme}
        theme={theme}
      />
    </div>
  )
}
