'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { Loom } from './extensions/LoomExtension'
import { GoogleDrive } from './extensions/GoogleDriveExtension'
import EditorToolbar from './EditorToolbar'

interface BlogEditorProps {
    value: string
    onChange: (html: string) => void
}

export default function BlogEditor({ value, onChange }: BlogEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'editor-image',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'editor-link',
                },
            }),
            Youtube.configure({
                controls: true,
                nocookie: true,
                HTMLAttributes: {
                    class: 'editor-youtube',
                },
            }),
            Loom,
            GoogleDrive,
            Placeholder.configure({
                placeholder: 'Start writing your blog... Paste image or video URLs to embed them.',
            }),
        ],
        content: value,
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
            },
        },
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [editor, value])

    if (!editor) return null

    return (
        <div className="tiptap-editor-wrapper">
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

