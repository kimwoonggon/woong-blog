import { ReactRenderer } from '@tiptap/react'
import tippy, { Instance as TippyInstance } from 'tippy.js'
import { CommandList } from './CommandList'

export const suggestion = {
    items: ({ query }: { query: string }) => {
        return [
            {
                title: 'Heading 1',
                description: 'Big section heading.',
                icon: 'h1',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run()
                },
            },
            {
                title: 'Heading 2',
                description: 'Medium section heading.',
                icon: 'h2',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run()
                },
            },
            {
                title: 'Heading 3',
                description: 'Small section heading.',
                icon: 'h3',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run()
                },
            },
            {
                title: 'Bullet List',
                description: 'Create a simple bulleted list.',
                icon: 'ul',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).toggleBulletList().run()
                },
            },
            {
                title: 'Numbered List',
                description: 'Create a list with numbering.',
                icon: 'ol',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).toggleOrderedList().run()
                },
            },
            {
                title: 'Blockquote',
                description: 'Capture a quotation.',
                icon: 'quote',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).toggleBlockquote().run()
                },
            },
            {
                title: 'Code Block',
                description: 'Insert code snippet (Javascript, HTML, CSS, etc.)',
                icon: 'code',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).toggleCodeBlock().run()
                },
            },
            {
                title: '3D Model',
                description: 'Insert an interactive 3D rotating cube.',
                icon: '3d',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).insertContent({ type: 'threeJsBlock' }).run()
                },
            },
            {
                title: 'HTML Widget',
                description: 'Insert custom HTML code.',
                icon: 'code',
                command: ({ editor, range }: any) => {
                    editor.chain().focus().deleteRange(range).insertContent({ type: 'htmlBlock' }).run()
                },
            },
        ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
    },

    render: () => {
        let component: ReactRenderer
        let popup: TippyInstance[]

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(CommandList, {
                    props,
                    editor: props.editor,
                })

                if (!props.clientRect) {
                    return
                }

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                })
            },

            onUpdate(props: any) {
                component.updateProps(props)

                if (!props.clientRect) {
                    return
                }

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                })
            },

            onKeyDown(props: any) {
                if (props.event.key === 'Escape') {
                    popup[0].hide()
                    return true
                }

                return (component.ref as any)?.onKeyDown(props)
            },

            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    },
}
