import React, { RefObject, useState } from "react"
import { Menu, Wand2, ChevronDown, Check, Save, Download, Moon, Sun, Palette, RotateCcw } from "lucide-react"
import { HexColorPicker } from "react-colorful"
import { cn } from "@/lib/utils"
import { Tab } from "../notepad"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

const PRESETS = [
    { name: "VS Code Blue", bg: "#007acc", text: "#ffffff" },
    { name: "VS Code Dark", bg: "#1f1f1f", text: "#cccccc" },
    { name: "Dracula", bg: "#282a36", text: "#f8f8f2" },
    { name: "Monokai", bg: "#272822", text: "#f8f8f2" },
    { name: "Solarized Dark", bg: "#002b36", text: "#839496" },
    { name: "Solarized Light", bg: "#eee8d5", text: "#586e75" },
    { name: "Nord", bg: "#2e3440", text: "#d8dee9" },
    { name: "Gruvbox Dark", bg: "#282828", text: "#ebdbb2" },
    { name: "Gruvbox Light", bg: "#fbf1c7", text: "#3c3836" },
    { name: "One Dark", bg: "#21252b", text: "#abb2bf" },
    { name: "GitHub Dark", bg: "#24292e", text: "#e1e4e8" },
    { name: "GitHub Light", bg: "#f6f8fa", text: "#24292e" },
    { name: "Catppuccin Mocha", bg: "#1e1e2e", text: "#cdd6f4" },
    { name: "Tokyo Night", bg: "#1a1b26", text: "#a9b1d6" },
    { name: "Rose Pine", bg: "#191724", text: "#e0def4" },
    { name: "Ayu Dark", bg: "#0d1017", text: "#bfbdb6" },
    { name: "Purple", bg: "#5b21b6", text: "#f5f3ff" },
    { name: "Deep Purple", bg: "#2d1b69", text: "#c4b5fd" },
    { name: "Pink", bg: "#db2777", text: "#fdf2f8" },
    { name: "Hot Pink", bg: "#831843", text: "#f9a8d4" },
    { name: "Fuchsia", bg: "#a21caf", text: "#fae8ff" },
    { name: "Violet", bg: "#6d28d9", text: "#ede9fe" },
    { name: "Indigo", bg: "#3730a3", text: "#e0e7ff" },
    { name: "Magenta", bg: "#86198f", text: "#f5d0fe" },
]

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
    statusBarColor: string
    setStatusBarColor: (color: string) => void
    statusBarTextColor: string
    setStatusBarTextColor: (color: string) => void
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
    theme,
    statusBarColor,
    setStatusBarColor,
    statusBarTextColor,
    setStatusBarTextColor
}) => {
    const [pickerTarget, setPickerTarget] = useState<"bg" | "text">("bg")
    const activePickerColor = pickerTarget === "bg" ? statusBarColor : statusBarTextColor
    const setActivePickerColor = pickerTarget === "bg" ? setStatusBarColor : setStatusBarTextColor

    const hasCustomColors = statusBarColor || statusBarTextColor
    const resetAll = () => {
        setStatusBarColor("")
        setStatusBarTextColor("")
    }

    const customStyle: React.CSSProperties = {}
    if (statusBarColor) customStyle.backgroundColor = statusBarColor
    if (statusBarTextColor) customStyle.color = statusBarTextColor

    return (
        <div
            className="flex items-center justify-between border-t border-border bg-card px-3 py-1 text-xs text-muted-foreground"
            style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
        >
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
            <div
                className="hidden lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:flex items-center gap-1.5 font-semibold"
                style={statusBarTextColor ? { color: statusBarTextColor } : undefined}
            >
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
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className="relative rounded p-1 transition-colors hover:bg-accent"
                                title="Status bar colors"
                                aria-label="Customize status bar colors"
                            >
                                <Palette className="h-4 w-4" />
                                {hasCustomColors && (
                                    <span
                                        className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-current/20"
                                        style={{ backgroundColor: statusBarColor || statusBarTextColor }}
                                    />
                                )}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent side="top" align="end" className="w-64 p-0">
                            <div className="p-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-foreground">Status Bar Colors</span>
                                    {hasCustomColors && (
                                        <button
                                            onClick={resetAll}
                                            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            Reset
                                        </button>
                                    )}
                                </div>

                                {/* Presets */}
                                <div className="space-y-1.5">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Presets</span>
                                    <div className="grid grid-cols-2 gap-1">
                                        {PRESETS.map((preset) => (
                                            <button
                                                key={preset.name}
                                                onClick={() => {
                                                    setStatusBarColor(preset.bg)
                                                    setStatusBarTextColor(preset.text)
                                                }}
                                                className={cn(
                                                    "flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium transition-colors hover:ring-1 hover:ring-primary/50",
                                                    statusBarColor === preset.bg && statusBarTextColor === preset.text && "ring-1 ring-primary"
                                                )}
                                                style={{ backgroundColor: preset.bg, color: preset.text }}
                                            >
                                                <span className="truncate">{preset.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-border" />

                                {/* Custom picker toggle */}
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => setPickerTarget("bg")}
                                            className={cn(
                                                "flex-1 rounded px-2 py-1.5 text-xs font-semibold transition-colors",
                                                pickerTarget === "bg"
                                                    ? "bg-black text-white"
                                                    : "bg-white text-black border border-border hover:bg-neutral-100"
                                            )}
                                        >
                                            Background
                                        </button>
                                        <button
                                            onClick={() => setPickerTarget("text")}
                                            className={cn(
                                                "flex-1 rounded px-2 py-1.5 text-xs font-semibold transition-colors",
                                                pickerTarget === "text"
                                                    ? "bg-black text-white"
                                                    : "bg-white text-black border border-border hover:bg-neutral-100"
                                            )}
                                        >
                                            Text
                                        </button>
                                    </div>
                                    <HexColorPicker
                                        color={activePickerColor || (pickerTarget === "bg" ? "#1e1e2e" : "#cccccc")}
                                        onChange={setActivePickerColor}
                                        style={{ width: "100%", height: "120px" }}
                                    />
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-6 w-6 shrink-0 rounded border border-border"
                                            style={{ backgroundColor: activePickerColor || "transparent" }}
                                        />
                                        <input
                                            type="text"
                                            value={activePickerColor || ""}
                                            onChange={(e) => {
                                                const val = e.target.value
                                                if (val === "" || /^#[0-9a-fA-F]{0,6}$/.test(val)) {
                                                    setActivePickerColor(val)
                                                }
                                            }}
                                            placeholder={pickerTarget === "bg" ? "#1e1e2e" : "#cccccc"}
                                            className="flex-1 rounded border border-border bg-background px-2 py-0.5 text-[11px] text-foreground font-mono outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                {/* Live preview */}
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Preview</span>
                                    <div
                                        className="flex items-center justify-between rounded px-2 py-1 text-[10px] border border-border"
                                        style={{
                                            backgroundColor: statusBarColor || "var(--card)",
                                            color: statusBarTextColor || "var(--muted-foreground)"
                                        }}
                                    >
                                        <span>L: 42  W: 128</span>
                                        <span>EDTR.CC</span>
                                        <span>UTF-8  JavaScript</span>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
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
