
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePage(id: string, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const content = formData.get('content') ? JSON.parse(formData.get('content') as string) : {}

    const { error } = await supabase
        .from('pages')
        .update({
            title,
            content,
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating page:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/pages')
    // We don't redirect here usually because it's an inline save or stays on the list
}
