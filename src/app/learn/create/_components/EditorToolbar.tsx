'use client'

import { Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Image as ImageIcon,
    Video,
    Link as LinkIcon
} from 'lucide-react'
import { useState } from 'react'

interface EditorToolbarProps {
    editor: Editor
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
    const [showImageDialog, setShowImageDialog] = useState(false)
    const [showVideoDialog, setShowVideoDialog] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [videoUrl, setVideoUrl] = useState('')

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl('')
            setShowImageDialog(false)
        }
    }

    const addVideo = () => {
        if (videoUrl) {
            // Detect video type and insert accordingly
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                editor.chain().focus().setYoutubeVideo({ src: videoUrl }).run()
            } else if (videoUrl.includes('loom.com')) {
                const embedUrl = videoUrl.replace('/share/', '/embed/')
                editor.chain().focus().setLoom({ src: embedUrl }).run()
            } else if (videoUrl.includes('drive.google.com')) {
                const match = videoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
                if (match) {
                    const fileId = match[1]
                    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`
                    editor.chain().focus().setGoogleDrive({ src: embedUrl }).run()
                }
            }
            setVideoUrl('')
            setShowVideoDialog(false)
        }
    }

    return (
        <div className="border-b border-neutral-10 p-2 flex flex-wrap gap-1 text-text-high">
            {/* Text Formatting */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded transition-colors hover:bg-neutral-10 ${editor.isActive('bold') ? 'bg-neutral-15' : ''
                    }`}
                title="Bold"
            >
                <Bold size={18} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded transition-colors hover:bg-neutral-10 ${editor.isActive('italic') ? 'bg-neutral-15' : ''
                    }`}
                title="Italic"
            >
                <Italic size={18} />
            </button>

            <div className="w-px h-6 bg-neutral-10 mx-1" />

            {/* Headings */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded transition-colors hover:bg-neutral-10 ${editor.isActive('heading', { level: 1 }) ? 'bg-neutral-15' : ''
                    }`}
                title="Heading 1"
            >
                <Heading1 size={18} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded transition-colors hover:bg-neutral-10 ${editor.isActive('heading', { level: 2 }) ? 'bg-neutral-15' : ''
                    }`}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>

            <div className="w-px h-6 bg-neutral-10 mx-1" />

            {/* Lists */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded transition-colors hover:bg-neutral-10 ${editor.isActive('bulletList') ? 'bg-neutral-15' : ''
                    }`}
                title="Bullet List"
            >
                <List size={18} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded transition-colors hover:bg-neutral-10 ${editor.isActive('orderedList') ? 'bg-neutral-15' : ''
                    }`}
                title="Numbered List"
            >
                <ListOrdered size={18} />
            </button>

            <div className="w-px h-6 bg-neutral-10 mx-1" />

            {/* Media */}
            <button
                onClick={() => setShowImageDialog(!showImageDialog)}
                className={`p-2 rounded transition-colors hover:bg-neutral-10 ${showImageDialog ? 'bg-neutral-15' : ''}`}
                title="Insert Image"
            >
                <ImageIcon size={18} />
            </button>

            <button
                onClick={() => setShowVideoDialog(!showVideoDialog)}
                className={`p-2 rounded transition-colors hover:bg-neutral-10 ${showVideoDialog ? 'bg-neutral-15' : ''}`}
                title="Insert Video"
            >
                <Video size={18} />
            </button>

            {/* Image Dialog */}
            {showImageDialog && (
                <div className="absolute mt-10 p-4 bg-card border border-neutral-10 rounded-xl shadow-2xl z-20 backdrop-blur-sm">
                    <input
                        type="text"
                        placeholder="Paste image URL..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addImage()}
                        className="w-64 px-3 py-2 bg-neutral-05 border border-neutral-10 rounded-lg text-sm text-text-high placeholder:text-text-mid focus:border-neutral-20 outline-none"
                        autoFocus
                    />
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={addImage}
                            className="px-3 py-1.5 bg-neutral-90 text-background rounded-lg text-xs font-medium hover:bg-neutral-100 transition-colors"
                        >
                            Insert
                        </button>
                        <button
                            onClick={() => setShowImageDialog(false)}
                            className="px-3 py-1.5 bg-neutral-10 text-text-high rounded-lg text-xs hover:bg-neutral-15 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Video Dialog */}
            {showVideoDialog && (
                <div className="absolute mt-10 p-4 bg-card border border-neutral-10 rounded-xl shadow-2xl z-20 backdrop-blur-sm">
                    <input
                        type="text"
                        placeholder="Paste URL (YouTube, Loom, Drive)..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addVideo()}
                        className="w-80 px-3 py-2 bg-neutral-05 border border-neutral-10 rounded-lg text-sm text-text-high placeholder:text-text-mid focus:border-neutral-20 outline-none"
                        autoFocus
                    />
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={addVideo}
                            className="px-3 py-1.5 bg-neutral-90 text-background rounded-lg text-xs font-medium hover:bg-neutral-100 transition-colors"
                        >
                            Insert
                        </button>
                        <button
                            onClick={() => setShowVideoDialog(false)}
                            className="px-3 py-1.5 bg-neutral-10 text-text-high rounded-lg text-xs hover:bg-neutral-15 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
