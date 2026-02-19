import type { Metadata } from "next"
import { HugerteEditor } from "@/components/wordpad/hugerte-editor"

export const metadata: Metadata = {
    title: "Wordpad | EDTR",
}

export default function WordpadPage() {
    return (
        <main className="fixed inset-0 bg-background">
            <HugerteEditor />
        </main>
    )
}
