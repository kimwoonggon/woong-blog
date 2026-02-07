"use client"

import React from 'react'
import parse, { domToReact, HTMLReactParserOptions, Element } from 'html-react-parser'
import { ThreeJsScene } from './ThreeJsScene'

interface InteractiveRendererProps {
    html: string
}

export function InteractiveRenderer({ html }: InteractiveRendererProps) {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element) {
                if (domNode.name === 'three-js-block') {
                    const height = domNode.attribs.height ? parseInt(domNode.attribs.height) : 300
                    return <ThreeJsScene height={height} />
                }
                if (domNode.name === 'html-snippet') {
                    const htmlContent = domNode.attribs.html || ''
                    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                }
            }
        },
    }

    return <div className="prose prose-lg max-w-none dark:prose-invert">{parse(html, options)}</div>
}
