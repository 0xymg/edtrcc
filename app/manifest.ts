import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'EDTR',
        short_name: 'EDTR',
        description: 'An online Notepad++ for quick notes.',
        start_url: '/notepad',
        id: '/notepad',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/icon-light-32x32.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/apple-icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any',
            },
        ],
    }
}
