import React, { RefObject } from "react"
import { Menu, Wand2, ChevronDown, Check, Save, Download, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tab } from "../notepad"

interface StatusBarProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    activeTab: Tab | undefined
    getWordCount: (content: string) => number
    saveStatus: "saved" | "saving" | null
    formatError: string | null
    isFormatting: boolean
    formatCode: () => void
    languageMenuOpen: boolean
    setLanguageMenuOpen: (open: boolean) => void
    languageButtonRef: RefObject<HTMLButtonElement | null>
    languages: { id: string; name: string }[]
    changeLanguage: (id: string) => void
    languageMenuRef: RefObject<HTMLDivElement | null>
    saveToLocalStorage: () => void
    downloadFile: () => void
    handlePrint: () => void
    toggleTheme: () => void
    theme: "light" | "dark"
}

export const StatusBar: React.FC<StatusBarProps> = ({
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    getWordCount,
    saveStatus,
    formatError,
    isFormatting,
    formatCode,
    languageMenuOpen,
    setLanguageMenuOpen,
    languageButtonRef,
    languages,
    changeLanguage,
    languageMenuRef,
    saveToLocalStorage,
    downloadFile,
    handlePrint,
    toggleTheme,
    theme
}) => {
    return (
        <div className="flex items-center justify-between border-t border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 sm:gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="rounded p-1 transition-colors hover:bg-accent"
                    title={`${sidebarOpen ? "Hide" : "Show"} sidebar (${typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘L' : 'Ctrl+L'})`}
                    aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                    <Menu className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 sm:gap-4">
                    <span>
                        L: {(activeTab?.content || "").split("\n").length}
                    </span>
                    <span className="hidden xs:inline sm:inline">
                        W: {getWordCount(activeTab?.content || "")}
                    </span>
                    <span className="hidden md:inline">
                        Len: {(activeTab?.content || "").length}
                    </span>
                </div>
            </div>
            <div className="hidden lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:flex items-center gap-1.5 font-semibold text-foreground">
                <img src="/icon.svg" alt="" className="h-3.5 w-3.5 rounded-sm" aria-hidden="true" />
                EDTR.CC
            </div>
            <div className="flex items-center gap-1.5 sm:gap-4">
                {saveStatus && (
                    <span className={cn(
                        "hidden sm:inline transition-colors text-[10px]",
                        saveStatus === "saved" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"
                    )}>
                        {saveStatus === "saved" ? "✓ Saved" : "Saving..."}
                    </span>
                )}
                {formatError && (
                    <span className="hidden sm:inline max-w-24 truncate text-destructive" title={formatError}>
                        Error
                    </span>
                )}
                <button
                    onClick={formatCode}
                    disabled={isFormatting || activeTab?.language === "plaintext"}
                    className={cn(
                        "flex items-center gap-1 rounded p-1 sm:px-2 sm:py-0.5 transition-colors hover:bg-accent",
                        (isFormatting || activeTab?.language === "plaintext") && "cursor-not-allowed opacity-50"
                    )}
                    title="Format code (Prettier)"
                    aria-label="Format code"
                >
                    <Wand2 className={cn("h-3.5 w-3.5", isFormatting && "animate-spin")} />
                    <span className="hidden md:inline">{isFormatting ? "Formatting..." : "Format"}</span>
                </button>
                <span className="hidden sm:inline">UTF-8</span>
                <div className="relative">
                    <button
                        ref={languageButtonRef}
                        onClick={(e) => {
                            e.stopPropagation()
                            setLanguageMenuOpen(!languageMenuOpen)
                        }}
                        className="flex items-center gap-1 rounded px-1 py-0.5 transition-colors hover:bg-accent"
                    >
                        <span className="max-w-[60px] truncate">{languages.find(l => l.id === activeTab?.language)?.name || "Text"}</span>
                        <ChevronDown className="h-3 w-3" />
                    </button>
                    {languageMenuOpen && (
                        <div
                            ref={languageMenuRef}
                            className="absolute bottom-full right-0 mb-1 max-h-64 w-40 overflow-y-auto rounded-none border border-border bg-popover p-1 shadow-lg z-[100]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {languages.map(lang => (
                                <button
                                    key={lang.id}
                                    onClick={() => changeLanguage(lang.id)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-none px-2 py-1.5 text-[10px] transition-colors hover:bg-accent",
                                        activeTab?.language === lang.id && "bg-accent"
                                    )}
                                >
                                    <span>{lang.name}</span>
                                    {activeTab?.language === lang.id && (
                                        <Check className="h-3 w-3" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                        onClick={saveToLocalStorage}
                        className="rounded p-1 transition-colors hover:bg-accent"
                        title="Save (Ctrl+S / Cmd+S)"
                        aria-label="Save document"
                    >
                        <Save className="h-4 w-4" />
                    </button>
                    <button
                        onClick={downloadFile}
                        className="rounded p-1 transition-colors hover:bg-accent"
                        title="Download file (Ctrl+Shift+S / Cmd+Shift+S)"
                        aria-label="Download file"
                    >
                        <Download className="h-4 w-4" />
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
