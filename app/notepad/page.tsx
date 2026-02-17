import { Metadata } from "next"
import { Notepad } from "@/components/notepad"

export const metadata: Metadata = {
    title: {
        absolute: "EDTR",
    },
}

export default function Page() {
    return (
        <main className="h-screen bg-background">
            <Notepad />
        </main>
    )
}
