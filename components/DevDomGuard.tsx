"use client"

import { useEffect } from 'react'

export default function DevDomGuard() {
  useEffect(() => {
    const origInsertBefore = Node.prototype.insertBefore
    const origRemoveChild = Node.prototype.removeChild

    function describeNode(n: Node | null) {
      try {
        if (!n) return null
        if (n instanceof Element) {
          return {
            nodeName: n.nodeName,
            id: n.id || null,
            className: n.className || null,
            outerHTML: (n.outerHTML && n.outerHTML.slice(0, 300)) || null,
          }
        }
        return { nodeType: n.nodeType, nodeName: n.nodeName }
      } catch {
        return { nodeName: n && n.nodeName }
      }
    }

    function safeInsertBefore(this: Node, newNode: Node, referenceNode: Node | null) {
      try {
        return origInsertBefore.call(this, newNode, referenceNode)
      } catch (err) {
        // Log helpful debug info when HMR or Ionic router tries invalid inserts
        // eslint-disable-next-line no-console
        console.error('[DevDomGuard] insertBefore threw', {
          parent: describeNode(this),
          newNode: describeNode(newNode),
          referenceNode: describeNode(referenceNode),
          error: String(err),
          stack: new Error().stack,
        })
        try {
          return (this as Node).appendChild(newNode)
        } catch (err2) {
          // eslint-disable-next-line no-console
          console.error('[DevDomGuard] appendChild fallback failed', String(err2))
        }
      }
    }

    function safeRemoveChild(this: Node, child: Node) {
      try {
        return origRemoveChild.call(this, child)
      } catch (err) {
        // Log helpful debug info when HMR or Ionic router tries invalid removes
        // eslint-disable-next-line no-console
        console.error('[DevDomGuard] removeChild threw', {
          parent: describeNode(this),
          child: describeNode(child),
          error: String(err),
          stack: new Error().stack,
        })
        // swallow in dev to avoid noisy runtime crash during HMR; return the child
        return child
      }
    }

    // Patch
    // @ts-ignore
    Node.prototype.insertBefore = safeInsertBefore
    // @ts-ignore
    Node.prototype.removeChild = safeRemoveChild

    return () => {
      // restore originals
      // @ts-ignore
      Node.prototype.insertBefore = origInsertBefore
      // @ts-ignore
      Node.prototype.removeChild = origRemoveChild
    }
  }, [])

  return null
}
