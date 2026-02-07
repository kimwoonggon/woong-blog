
"use client"

// unused useState removed
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { GripVertical, X, Image as ImageIcon, Type, Code } from 'lucide-react'
import { Block } from '@/components/content/BlockRenderer'
import { v4 as uuidv4 } from 'uuid'

interface BlockEditorProps {
    blocks: Block[]
    onChange: (blocks: Block[]) => void
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = blocks.findIndex((block) => block.id === active.id)
            const newIndex = blocks.findIndex((block) => block.id === over?.id)
            onChange(arrayMove(blocks, oldIndex, newIndex))
        }
    }

    const addBlock = (type: string) => {
        const newBlock: Block = {
            id: uuidv4(),
            type: type,
            text: '',
        }
        onChange([...blocks, newBlock])
    }

    const updateBlock = (id: string, updates: Partial<Block>) => {
        const newBlocks = blocks.map((block) =>
            block.id === id ? { ...block, ...updates } : block
        )
        onChange(newBlocks)
    }

    const removeBlock = (id: string) => {
        onChange(blocks.filter((block) => block.id !== id))
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 mb-4">
                <Button onClick={() => addBlock('p')} variant="outline" size="sm">
                    <Type className="mr-2 h-4 w-4" /> Paragraph
                </Button>
                <Button onClick={() => addBlock('h2')} variant="outline" size="sm">
                    <Type className="mr-2 h-4 w-4" /> Heading
                </Button>
                <Button onClick={() => addBlock('image')} variant="outline" size="sm">
                    <ImageIcon className="mr-2 h-4 w-4" /> Image
                </Button>
                <Button onClick={() => addBlock('code')} variant="outline" size="sm">
                    <Code className="mr-2 h-4 w-4" /> Code
                </Button>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-4">
                        {blocks.map((block) => (
                            <SortableBlock key={block.id} block={block} onUpdate={updateBlock} onRemove={removeBlock} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableBlock({ block, onUpdate, onRemove }: { block: Block, onUpdate: (id: string, updates: Partial<Block>) => void, onRemove: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} className="flex items-start gap-2 group bg-white p-4 rounded-md border border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <button {...attributes} {...listeners} className="mt-2 cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <GripVertical className="h-5 w-5" />
            </button>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase text-gray-400">{block.type}</span>
                </div>
                {block.type === 'image' ? (
                    <div className="space-y-2">
                        <Input
                            placeholder="Image URL"
                            value={block.src || ''}
                            onChange={(e) => onUpdate(block.id, { src: e.target.value })}
                        />
                        <Input
                            placeholder="Caption"
                            value={block.caption || ''}
                            onChange={(e) => onUpdate(block.id, { caption: e.target.value })}
                        />
                    </div>
                ) : (
                    <Textarea
                        className="min-h-[80px]"
                        placeholder={`Enter ${block.type} content...`}
                        value={block.text || ''}
                        onChange={(e) => onUpdate(block.id, { text: e.target.value })}
                    />
                )}
            </div>

            <button onClick={() => onRemove(block.id)} className="text-gray-400 hover:text-red-500">
                <X className="h-5 w-5" />
            </button>
        </div>
    )
}
