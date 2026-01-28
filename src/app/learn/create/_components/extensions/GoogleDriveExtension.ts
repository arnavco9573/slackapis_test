import { Node, mergeAttributes } from '@tiptap/core'

export const GoogleDrive = Node.create({
    name: 'googleDrive',
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
                tag: 'div[data-google-drive-video] iframe',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            { 'data-google-drive-video': '', class: 'google-drive-video-wrapper' },
            [
                'iframe',
                mergeAttributes({
                    src: HTMLAttributes.src,
                    frameborder: '0',
                    allowfullscreen: 'true',
                    class: 'editor-google-drive',
                }),
            ],
        ]
    },

    addCommands() {
        return {
            setGoogleDrive:
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
        googleDrive: {
            /**
             * Set a Google Drive video
             */
            setGoogleDrive: (options: { src: string }) => ReturnType
        }
    }
}

