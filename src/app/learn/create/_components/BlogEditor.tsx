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
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TextAlign from '@tiptap/extension-text-align'

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
                    levels: [1, 2, 3, 4, 5, 6],
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
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
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
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6',
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
        <div
            className="tiptap-editor-wrapper overflow-hidden"
            style={{
                borderRadius: '8px',
                border: '0.5px solid var(--System-GR-Neutral-5-01, rgba(255, 255, 255, 0.05))',
                background: 'var(--Neutral-Neutrals-03, rgba(255, 255, 255, 0.03))',
            }}
        >
            <div className="p-2">
                <EditorToolbar editor={editor} />
            </div>

            {/* Gradient Separator */}
            <div
                className="h-px w-full"
                style={{
                    background: 'linear-gradient(90deg, #1A1B1E 0%, #3F4042 50.25%, #1A1B1E 100%), #FFF'
                }}
            />

            <EditorContent editor={editor} />
        </div>
    )
}

