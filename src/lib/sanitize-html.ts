/**
 * Sanitizes HTML content by removing or replacing problematic iframes
 * Specifically handles Google Drive embeds that cause 401 errors
 */
export function sanitizeBlogContent(html: string): string {
    if (!html) return ''

    // Create a temporary div to parse HTML
    const temp = document.createElement('div')
    temp.innerHTML = html

    // Find all iframes
    const iframes = temp.querySelectorAll('iframe')

    iframes.forEach((iframe) => {
        const src = iframe.getAttribute('src') || ''

        // Check if it's a Google Drive embed
        if (src.includes('drive.google.com')) {
            // Extract file ID from Google Drive URL
            const fileIdMatch = src.match(/\/file\/d\/([^\/]+)/)
            const fileId = fileIdMatch ? fileIdMatch[1] : null

            if (fileId) {
                // Create a link instead of iframe
                const link = document.createElement('a')
                link.href = `https://drive.google.com/file/d/${fileId}/view`
                link.target = '_blank'
                link.rel = 'noopener noreferrer'
                link.className = 'inline-flex items-center gap-2 px-4 py-2 bg-neutral-05 border border-neutral-10 rounded-lg hover:bg-neutral-10 transition-colors text-text-high'
                link.innerHTML = `
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                    View Google Drive File
                `

                // Replace iframe with link
                iframe.parentNode?.replaceChild(link, iframe)
            } else {
                // If we can't extract file ID, just remove the iframe
                iframe.remove()
            }
        }
        // You can add more conditions here for other problematic embeds
    })

    return temp.innerHTML
}
