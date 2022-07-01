// template is for rendering html
export class Template {

    static templateId = 0

    constructor (strings, keys) {
        this.strings = strings
        this.keys = keys

        this.templateId = 'web-cmp-' + (++Template.templateId)
        this.template = null
        this.dom = null // last dom

        this.fnId = 0
        this.functions = {}
    }

    get content() {
        return (this.template ?? this.build()).content
    }

    build() {
        let me = this
        let s = me.strings.map((s, i) => {

            let fn = me.keys[i]
            if (!fn) return s

            if (typeof fn!=='function') {
                return [s, fn]
            }

            // store reactive-functions
            //
            let id = this.getFnId()
            this.functions[id] = fn

            let a = fn.call(me.context, me.context)
            let content = a instanceof Template
                ? a.innerHTML
                : a

            return [
                s,
                // tag function output for refresh
                //
                '<!--', id, '-->',
                content,
                '<!--\\', id, '-->',
                ]
        })
        .flat()
        .filter(Boolean)
        .join('')


        let t = Template.create(s)
        this.template = t
        return t
    }

    getFnId() {
        return this.templateId + '-' + (++this.fnId)
    }

    get innerHTML() {
        let a = document.createElement('div')
        a.appendChild(this.content.cloneNode(true))
        return a.innerHTML
    }

    static create = (s) => {
        let t = document.createElement('template')
        t.innerHTML = s
        return t
    }

    refresh(ctx=null, dom) {
        dom = dom ?? this.dom

        let w = document.createTreeWalker(
            dom,
            NodeFilter.SHOW_COMMENT)

        var e
        while(e = w.nextNode()) {
            let id = w.currentNode.textContent
            if (!id) continue

            let fn = this.functions[id]
            if (!fn) continue

            let a = fn.call(ctx, ctx)
            let content = a instanceof Template
                ? a.content
                : a instanceof HTMLElement
                ? a
                : Template.create(a).content
            if (!content) continue

            // remove nodes between marker tags
            //
            let endText = '\\' + id
            var b
            while(b = e.nextSibling) {
                if (b.nodeType===8 && b.textContent===endText) {
                    break
                }
                b.remove()
            }
            if (!e) continue

            e.parentNode.insertBefore(content, e.nextSibling)
        }

    }
}

export let template = (strings, ...keys) => {
    return new Template(strings, keys)
}