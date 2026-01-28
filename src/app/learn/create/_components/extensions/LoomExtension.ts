import { Node, mergeAttributes } from '@tiptap/core'

export const Loom = Node.create({
    name: 'loom',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-loom-video] iframe',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            { 'data-loom-video': '', class: 'loom-video-wrapper' },
            [
                'iframe',
                mergeAttributes({
                    src: HTMLAttributes.src,
                    frameborder: '0',
                    allowfullscreen: 'true',
                    webkitallowfullscreen: 'true',
                    mozallowfullscreen: 'true',
                    class: 'editor-loom',
                }),
            ],
        ]
    },

    addCommands() {
        return {
            setLoom:
                (options: { src: string }) =>
                    ({ commands }: any) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        })
                    },
        }
    },
})

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        loom: {
            /**
             * Set a Loom video
             */
            setLoom: (options: { src: string }) => ReturnType
        }
    }
}

