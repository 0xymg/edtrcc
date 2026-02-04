import { Tab, FolderItem } from "../notepad"

export interface NotepadState {
    tabs: Tab[]
    activeTabId: string | null
    folders: FolderItem[]
    sidebarOpen: boolean
    theme: "light" | "dark"
}

export interface NotepadActions {
    setTabs: React.Dispatch<React.SetStateAction<Tab[]>>
    setActiveTabId: React.Dispatch<React.SetStateAction<string | null>>
    setFolders: React.Dispatch<React.SetStateAction<FolderItem[]>>
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    createNewTab: () => void
    closeTab: (tabId: string, e?: React.MouseEvent | KeyboardEvent) => void
    updateContent: (content: string) => void
    saveToLocalStorage: () => void
    toggleTheme: () => void
    formatCode: () => void
    createNewFolder: () => void
    toggleFolder: (folderId: string) => void
    handlePrint: () => void
}
