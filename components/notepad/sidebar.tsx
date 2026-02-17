import React from "react"
import { Plus, X, Folder, FolderOpen, ChevronDown, ChevronRight, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tab, FolderItem } from "../notepad"

interface SidebarProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    tabs: Tab[]
    folders: FolderItem[]
    activeTabId: string | null
    setActiveTabId: (id: string) => void
    createNewTab: () => void
    createNewFolder: () => void
    toggleFolder: (id: string) => void
    deleteFolder: (id: string, e: React.MouseEvent) => void
    startRenamingFolder: (folder: FolderItem) => void
    editingFolderId: string | null
    editingFolderName: string
    setEditingFolderName: (name: string) => void
    finishRenamingFolder: (id: string) => void
    handleRenameFolderKeyDown: (e: React.KeyboardEvent, id: string) => void
    handleDragStart: (id: string) => void
    handleDragEnd: () => void
    handleDragOver: (e: React.DragEvent) => void
    handleDragOverTab: (id: string, e: React.DragEvent) => void
    handleDragLeaveTab: () => void
    handleDropOutsideFolder: (e: React.DragEvent) => void
    handleDropOnTab: (id: string, e: React.DragEvent) => void
    handleContextMenu: (e: React.MouseEvent, id: string) => void
    handleFolderContextMenu: (e: React.MouseEvent, id: string) => void
    handleDragEnterFolder: (id: string) => void
    handleDragLeaveFolder: () => void
    handleDropOnFolder: (id: string) => void
    handleFolderDragStart: (id: string) => void
    draggedFolder: string | null
    dragOverFolder: string | null
    dragOverTab: string | null
}

export const Sidebar: React.FC<SidebarProps> = ({
    sidebarOpen,
    setSidebarOpen,
    tabs,
    folders,
    activeTabId,
    setActiveTabId,
    createNewTab,
    createNewFolder,
    toggleFolder,
    deleteFolder,
    startRenamingFolder,
    editingFolderId,
    editingFolderName,
    setEditingFolderName,
    finishRenamingFolder,
    handleRenameFolderKeyDown,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragOverTab,
    handleDragLeaveTab,
    handleDropOutsideFolder,
    handleDropOnTab,
    handleContextMenu,
    handleFolderContextMenu,
    handleDragEnterFolder,
    handleDragLeaveFolder,
    handleDropOnFolder,
    handleFolderDragStart,
    draggedFolder,
    dragOverFolder,
    dragOverTab
}) => {
    const getFilesInFolder = (folderId: string | null) => {
        if (folderId === null) {
            return tabs.filter(tab => !tab.folderId)
        }
        return tabs.filter(tab => tab.folderId === folderId)
    }

    return (
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
                                title={`New file (${typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘J' : 'Ctrl+J'})`}
                                aria-label="New file"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="rounded p-1 transition-colors hover:bg-accent"
                                title={`Hide sidebar (${typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘L' : 'Ctrl+L'})`}
                                aria-label="Hide sidebar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-2">
                            <div className="space-y-1">
                                {/* Folders first */}
                                {folders.map(folder => (
                                    <div key={folder.id} className="space-y-1">
                                        <div
                                            draggable
                                            onDragStart={(e) => {
                                                e.stopPropagation()
                                                handleFolderDragStart(folder.id)
                                            }}
                                            onDragEnd={handleDragEnd}
                                            onClick={() => {
                                                if (editingFolderId !== folder.id) {
                                                    toggleFolder(folder.id)
                                                }
                                            }}
                                            onDoubleClick={(e) => {
                                                e.stopPropagation()
                                                startRenamingFolder(folder)
                                            }}
                                            onContextMenu={(e) => handleFolderContextMenu(e, folder.id)}
                                            onDragOver={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleDragEnterFolder(folder.id)
                                            }}
                                            onDragLeave={handleDragLeaveFolder}
                                            onDrop={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleDropOnFolder(folder.id)
                                            }}
                                            className={cn(
                                                "flex items-center justify-between gap-1 px-2 py-1.5 rounded text-sm transition-colors cursor-pointer group",
                                                "text-foreground hover:bg-accent",
                                                draggedFolder === folder.id && "opacity-50",
                                                dragOverFolder === folder.id && draggedFolder && "border-t-2 border-t-foreground",
                                                dragOverFolder === folder.id && !draggedFolder && "bg-muted ring-2 ring-border"
                                            )}
                                        >
                                            <div className="flex items-center gap-1 flex-1">
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
                                            </div>
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
                                                            dragOverTab === tab.id && "border-b-2 border-muted-foreground"
                                                        )}
                                                    >
                                                        <FileText className="h-4 w-4 shrink-0" />
                                                        <span className="truncate flex-1">{tab.name}</span>
                                                        {tab.isModified && (
                                                            <span className="h-2 w-2 shrink-0 rounded-full bg-foreground" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Root level files (no folder) */}
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
                                                dragOverTab === tab.id && "border-b-2 border-muted-foreground"
                                            )}
                                        >
                                            <FileText className="h-4 w-4 shrink-0" />
                                            <span className="truncate flex-1">{tab.name}</span>
                                            {tab.isModified && (
                                                <span className="h-2 w-2 shrink-0 rounded-full bg-foreground" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
