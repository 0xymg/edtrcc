"use client"

import { useState } from "react"
import { Editor } from "@hugerte/hugerte-react"

const initialContent = `<p>Wordpad sayfasina hos geldin.</p><p>Yazmaya baslamak icin burayi kullan.</p>`

export function HugerteEditor() {
    const [content, setContent] = useState(initialContent)

    return (
        <div className="wordpad-editor h-full w-full overflow-hidden bg-background">
            <div className="h-full w-full">
                <Editor
                    hugerteScriptSrc="/hugerte/hugerte.min.js"
                    value={content}
                    onEditorChange={setContent}
                    init={{
                        height: "100vh",
                        menubar: true,
                        toolbar_mode: "wrap",
                        plugins:
                            "accordion advlist anchor autolink autosave charmap code codesample directionality emoticons fullscreen help image importcss insertdatetime link lists media nonbreaking pagebreak preview quickbars save searchreplace table template visualblocks visualchars wordcount",
                        toolbar:
                            "undo redo restoredraft save | styles blocks fontfamily fontsize | bold italic underline strikethrough superscript subscript | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | removeformat | link anchor image media table accordion template | charmap emoticons codesample code | searchreplace visualblocks visualchars preview fullscreen | insertdatetime pagebreak nonbreaking | ltr rtl | help",
                        skin_url: "/hugerte/skins/ui/oxide",
                        content_css: "/hugerte/skins/content/default/content.css",
                        promotion: false,
                    }}
                />
            </div>
            <style jsx global>{`
                .wordpad-editor .tox.tox-tinymce {
                    height: 100% !important;
                    border: 0 !important;
                    box-shadow: none !important;
                }
                .wordpad-editor .tox-editor-container {
                    height: 100% !important;
                }
                .wordpad-editor .tox-edit-area {
                    height: 100% !important;
                }
                .wordpad-editor .tox-edit-area iframe {
                    height: 100% !important;
                }
            `}</style>
        </div>
    )
}
