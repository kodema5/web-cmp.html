export let webCmp = (
    tmpl,
    {
        formAssociated=true,

        elements={}, // properties and events
        connectedCallback=() => {}, // callback when loaded

        attributes={}, // attribute changes
        attributeChangedCallback=() => {}, // when attribute changed

        properties={},  // for computed properties
        ...overrides // other component overrides
    } = {}
) => {

    let Cmp = class extends HTMLElement {

        static formAssociated = formAssociated

        constructor () {
            super()
            this.template = tmpl

            // https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals
            //
            this.internals = this.attachInternals()

            let dom = this.attachShadow({ mode:'open' })
            dom.appendChild(tmpl.content.cloneNode(true))

            attachElements(this, dom, elements)
        }

        static get observedAttributes() {
            return Object.keys(attributes)
        }
        attributeChangedCallback(attr, oldVal, newVal) {
            let f = attributes[attr]
            if (f && typeof f ==='function') {
                f.call(this, newVal, oldVal)
            }
            attributeChangedCallback.call(this, attr, oldVal, newVal)
        }

        // to be called to refresh content
        //
        refresh() {
            this.template.refresh(this, this.shadowRoot)
        }
        connectedCallback() {
            setTimeout(() => {
                this.refresh()
                connectedCallback.call(this)
            })
        }
    }

    let cls = Cmp.prototype
    attachProperties(cls, properties)
    attachProperties(cls, overrides)
    return Cmp
}

let attachElements = (cmp, dom, elems) => {

    Object.keys(elems).forEach(k => {
        let el = (k==='.' || k==='this')
            ? dom
            : dom.querySelector(k)
        if (!el) return

        let cfg = {...elems[k]}
        let id = cfg.id || el.id
        delete cfg.id

        // attach element as properties
        //
        if (id && el!==dom) {
            if (cmp[id]) return
            cmp[id] = el
        }

        // attach listeners/properties to element
        // all functions' this refer to 'cmp'
        //
        Object.entries(cfg).forEach( ([n, fn]) => {
            let isFn = typeof fn==='function'
            if (n[0]=='$') {
                if (!isFn) return
                el.addEventListener(n.slice(1), fn.bind(cmp))
            }
            el[n] = isFn
                ? fn.bind(cmp)
                : fn
        })
    })
}


let attachProperties = (cls, props) => {

    Object.getOwnPropertyNames(props).forEach(n => {
        let d = Object.getOwnPropertyDescriptor(props, n)

        if (d.hasOwnProperty('value')) {
            cls[n] = d.value
        }
        else if ('get' in d || 'set' in d) {
            Object.defineProperty(cls, n, {
                get: d.get,
                set: d.set
            })
        }
    })
}
