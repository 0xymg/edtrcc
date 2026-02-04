import React from "react"
import { FileText, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tab } from "../notepad"

interface TabBarProps {
    tabs: Tab[]
    activeTabId: string | null
    setActiveTabId: (id: string) => void
    handleTabBarDoubleClick: () => void
    handleTabDoubleClick: (e: React.MouseEvent, tab: Tab) => void
    editingTabId: string | null
    editingName: string
    setEditingName: (name: string) => void
    finishRenaming: (id: string) => void
    handleRenameKeyDown: (e: React.KeyboardEvent, id: string) => void
    createNewTab: () => void
    closeTab: (tabId: string, e?: React.MouseEvent | KeyboardEvent) => void
}

export const TabBar: React.FC<TabBarProps> = ({
    tabs,
    activeTabId,
    setActiveTabId,
    handleTabBarDoubleClick,
    handleTabDoubleClick,
    editingTabId,
    editingName,
    setEditingName,
    finishRenaming,
    handleRenameKeyDown,
    createNewTab,
    closeTab
}) => {
    return (
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
                            <span className="h-2 w-2 shrink-0 rounded-full bg-foreground" />
                        )}
                        <button
                            onClick={(e) => closeTab(tab.id, e)}
                            className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100"
                            title={`Close ${tab.name} (${typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'})`}
                            aria-label={`Close ${tab.name}`}
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </button>
                ))}
            </div>
            <button
                onClick={createNewTab}
                className="flex h-full items-center px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                title={`New file (${typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘J' : 'Ctrl+J'})`}
                aria-label="New tab"
            >
                <Plus className="h-4 w-4" />
            </button>
        </div>
    )
}
