import React, { RefObject } from "react"
import { Menu, Wand2, ChevronDown, Check, Save, Printer, Moon, Sun } from "lucide-react"
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
    handlePrint,
    toggleTheme,
    theme
}) => {
    return (
        <div className="flex items-center justify-between border-t border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="rounded p-1 transition-colors hover:bg-accent"
                    title={`${sidebarOpen ? "Hide" : "Show"} sidebar (${typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘L' : 'Ctrl+L'})`}
                    aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                    <Menu className="h-4 w-4" />
                </button>
                <span>
                    Lines: {(activeTab?.content || "").split("\n").length}
                </span>
                <span>
                    Words: {getWordCount(activeTab?.content || "")}
                </span>
                <span>
                    Length: {(activeTab?.content || "").length}
                </span>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-semibold text-foreground">
                <img src="/icon.svg" alt="" className="h-3.5 w-3.5 rounded-sm" aria-hidden="true" />
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
                        <span>{languages.find(l => l.id === activeTab?.language)?.name || "Plain Text"}</span>
                        <ChevronDown className="h-3 w-3" />
                    </button>
                    {languageMenuOpen && (
                        <div
                            ref={languageMenuRef}
                            className="absolute bottom-full right-0 mb-1 max-h-64 w-48 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {languages.map(lang => (
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
                    onClick={handlePrint}
                    className="rounded p-1 transition-colors hover:bg-accent"
                    title="Print (Ctrl+P)"
                    aria-label="Print document"
                >
                    <Printer className="h-4 w-4" />
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
    )
}
