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

        let els = (k==='.' || k==='this')
            ? [dom]
            : dom.querySelectorAll(k)
        if (!els.length===0) return

        els.forEach(el => {
            // get config
            //
            let f = elems[k]
            let cfg = typeof(f)==='function'
                ? f.call(cmp, el)
                : {...f}
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
            Object.entries(cfg).forEach( ([key, fn]) => {
                let isFn = typeof fn==='function'

                if (key[0]=='$' && isFn) {
                    el.addEventListener(key.slice(1), fn.bind(cmp))
                    return
                }

                el[key] = isFn
                    ? fn.bind(cmp)
                    : fn // -- is a property
            })
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
