'use client'

import { Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    Strikethrough,
    Quote,
    Code,
    List,
    ListOrdered,
    Minus,
    Undo,
    Redo,
    Image as ImageIcon,
    Video,
    Link as LinkIcon,
    ChevronDown,
    Type,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Table as TableIcon,
    Trash,
    Rows,
    Columns,
    Plus
} from 'lucide-react'
import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'
import InputField from '@/components/core/input-field'
import CopyLinkMiniSvg from '@/components/svg/copy-link-mini'
import EditorImage from '@/components/svg/editor-image'

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

    const headingOptions = [
        { label: 'Normal Text', value: 'paragraph', level: 0 },
        { label: 'Heading 1', value: 'heading', level: 1 },
        { label: 'Heading 2', value: 'heading', level: 2 },
        { label: 'Heading 3', value: 'heading', level: 3 },
        { label: 'Heading 4', value: 'heading', level: 4 },
        { label: 'Heading 5', value: 'heading', level: 5 },
        { label: 'Heading 6', value: 'heading', level: 6 },
    ]

    const getCurrentHeading = () => {
        if (editor.isActive('paragraph')) return 'Normal Text'
        for (let i = 1; i <= 6; i++) {
            if (editor.isActive('heading', { level: i })) return `Heading ${i}`
        }
        return 'Normal Text'
    }

    const renderRadioItem = (
        option: typeof headingOptions[0]
    ) => {
        const isSelected = option.value === 'paragraph'
            ? editor.isActive('paragraph')
            : editor.isActive('heading', { level: option.level })

        return (
            <div
                key={option.label}
                onClick={() => {
                    if (option.value === 'paragraph') {
                        editor.chain().focus().setParagraph().run()
                    } else {
                        editor.chain().focus().toggleHeading({ level: option.level as any }).run()
                    }
                }}
                className="flex items-center gap-3 cursor-pointer group py-2 px-1"
            >
                <div
                    className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center transition-all border",
                        isSelected
                            ? "border-(--Primary-500,#9C9C9C)"
                            : "border-(--Primary-700,#636363) group-hover:border-text-high"
                    )}
                >
                    {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                </div>
                <span className={cn(
                    "text-sm transition-colors",
                    isSelected ? "text-text-highest" : "text-text-high group-hover:text-text-highest"
                )}>
                    {option.label}
                </span>
            </div>
        )
    }

    const setAlignment = (align: 'left' | 'center' | 'right' | 'justify') => {
        editor.chain().focus().setTextAlign(align).run()
    }

    const getActiveAlignment = () => {
        if (editor.isActive({ textAlign: 'center' })) return <AlignCenter size={18} />
        if (editor.isActive({ textAlign: 'right' })) return <AlignRight size={18} />
        if (editor.isActive({ textAlign: 'justify' })) return <AlignJustify size={18} />
        return <AlignLeft size={18} />
    }

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {/* History */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    icon={Undo}
                    title="Undo"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    icon={Redo}
                    title="Redo"
                />
            </div>

            <ToolbarSeparator />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="h-9 px-3 flex items-center gap-2 rounded-lg border-[0.5px] border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm text-text-high outline-none">
                        <Type size={16} className="text-(--Primary-500,#9C9C9C)" />
                        <span className="min-w-[80px] text-left">{getCurrentHeading()}</span>
                        <ChevronDown size={14} className="text-(--Primary-500,#9C9C9C)" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[180px] p-3 border-0 z-30 flex flex-col"
                    align="start"
                    sideOffset={8}
                    style={{
                        borderRadius: '12px',
                        background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                        boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    {headingOptions.map(option => renderRadioItem(option))}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="h-9 px-3 flex items-center gap-2 rounded-lg border-[0.5px] border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm text-text-high outline-none">
                        {getActiveAlignment()}
                        <ChevronDown size={14} className="text-(--Primary-500,#9C9C9C)" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="min-w-16 w-fit p-1 border-0 z-30 flex flex-col gap-1 items-center"
                    align="start"
                    sideOffset={8}
                    style={{
                        borderRadius: '12px',
                        background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                        boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <ToolbarButton onClick={() => setAlignment('left')} active={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Left" />
                    <ToolbarButton onClick={() => setAlignment('center')} active={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Center" />
                    <ToolbarButton onClick={() => setAlignment('right')} active={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Right" />
                    <ToolbarButton onClick={() => setAlignment('justify')} active={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} title="Justify" />
                </DropdownMenuContent>
            </DropdownMenu>

            <ToolbarSeparator />

            {/* Formatting */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    icon={Bold}
                    title="Bold"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    icon={Italic}
                    title="Italic"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    icon={Strikethrough}
                    title="Strike"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive('code')}
                    icon={Code}
                    title="Code"
                />
            </div>

            <ToolbarSeparator />

            {/* Blocks */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    icon={Quote}
                    title="Blockquote"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    icon={Minus}
                    title="Horizontal Rule"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    icon={List}
                    title="Bullet List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    title="Numbered List"
                />
            </div>

            <ToolbarSeparator />

            {/* Table Controls */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className={cn(
                        "p-2 rounded-lg transition-all outline-none",
                        editor.isActive('table')
                            ? "bg-white/10 text-white"
                            : "text-text-mid hover:bg-white/5 hover:text-white disabled:opacity-30"
                    )} title="Table">
                        <TableIcon size={18} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-56 p-2 border-0 z-30 flex flex-col gap-1"
                    align="start"
                    sideOffset={8}
                    style={{
                        borderRadius: '12px',
                        background: 'var(--Neutral-Neutrals-01, rgba(255, 255, 255, 0.01))',
                        boxShadow: '6px 80px 80px 0 rgba(255, 255, 255, 0.01) inset, 0 -1px 1px 0 rgba(255, 255, 255, 0.10) inset, 0 1px 1px 0 rgba(255, 255, 255, 0.10) inset',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="text-text-high hover:text-white cursor-pointer">
                        <Plus size={14} className="mr-2" /> Insert Table
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()} data-disabled={!editor.can().addColumnBefore() ? true : undefined} className="text-text-high hover:text-white cursor-pointer">
                        <Columns size={14} className="mr-2" /> Add Column Before
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()} data-disabled={!editor.can().addColumnAfter() ? true : undefined} className="text-text-high hover:text-white cursor-pointer">
                        <Columns size={14} className="mr-2" /> Add Column After
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()} data-disabled={!editor.can().deleteColumn() ? true : undefined} className="text-text-high hover:text-white cursor-pointer">
                        <Trash size={14} className="mr-2" /> Delete Column
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()} data-disabled={!editor.can().addRowBefore() ? true : undefined} className="text-text-high hover:text-white cursor-pointer">
                        <Rows size={14} className="mr-2" /> Add Row Before
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()} data-disabled={!editor.can().addRowAfter() ? true : undefined} className="text-text-high hover:text-white cursor-pointer">
                        <Rows size={14} className="mr-2" /> Add Row After
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()} data-disabled={!editor.can().deleteRow() ? true : undefined} className="text-text-high hover:text-white cursor-pointer">
                        <Trash size={14} className="mr-2" /> Delete Row
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().deleteTable().run()} data-disabled={!editor.can().deleteTable() ? true : undefined} className="text-negative hover:text-negative cursor-pointer">
                        <Trash size={14} className="mr-2" /> Delete Table
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ToolbarSeparator />

            {/* Media */}
            <div className="flex items-center gap-0.5">
                <ToolbarButton
                    onClick={() => {
                        setShowImageDialog(!showImageDialog)
                        setShowVideoDialog(false)
                    }}
                    active={showImageDialog}
                    icon={EditorImage}
                    title="Image"
                />
                <ToolbarButton
                    onClick={() => {
                        setShowVideoDialog(!showVideoDialog)
                        setShowImageDialog(false)
                    }}
                    active={showVideoDialog}
                    icon={CopyLinkMiniSvg}
                    title="Video"
                />
                {/* <ToolbarButton
                    onClick={() => {
                        const url = window.prompt('URL')
                        if (url) editor.chain().focus().setLink({ href: url }).run()
                    }}
                    active={editor.isActive('link')}
                    icon={LinkIcon}
                    title="Link"
                /> */}
            </div>

            {/* Media Dialogs (Simplified) */}
            {showImageDialog && (
                <div className="absolute mt-36 p-3 bg-card border border-neutral-10 rounded-xl shadow-2xl z-20 backdrop-blur-md">
                    <InputField
                        id="image-url-input"
                        name="imageUrl"
                        type="text"
                        label='Image URL'
                        placeholder="Image URL..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addImage()}
                        inputClassName="w-60 px-3 py-1.5"
                    />
                </div>
            )}

            {showVideoDialog && (
                <div className="absolute mt-36 p-3 bg-card border border-neutral-10 rounded-xl shadow-2xl z-20 backdrop-blur-md">
                    <InputField
                        id="video-url-input"
                        name="videoUrl"
                        type="text"
                        label='Video URL'
                        placeholder="Video URL (YouTube, Loom, Drive)..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addVideo()}
                        inputClassName="w-72 px-3 py-1.5"
                    />
                </div>
            )}
        </div>
    )
}

function ToolbarButton({
    onClick,
    active,
    disabled,
    icon: Icon,
    title
}: {
    onClick: () => void,
    active?: boolean,
    disabled?: boolean,
    icon: any,
    title: string
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "p-2 rounded-lg transition-all outline-none",
                active
                    ? "bg-white/10 text-white"
                    : "text-text-mid hover:bg-white/5 hover:text-white disabled:opacity-30"
            )}
            title={title}
        >
            <Icon size={18} />
        </button>
    )
}

function ToolbarSeparator() {
    return <div className="w-px h-6 bg-white/5 mx-1" />
}
