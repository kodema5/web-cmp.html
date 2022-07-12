// npx esbuild --bundle src/index.js --sourcemap --outfile=web-cmp.js --format=esm --minify --watch

export { template, Template } from './template.js'
export { webCmp, } from './web-cmp.js'
export { getCssText, } from './css.js'
export { El, } from './el.js'

import * as Ajax from '../ajax.js/mod.js'
export { pubsub, PubSub }  from '../pubsub.js/mod.js'
export * as waaf from '../waaf.js/mod.js'
import { Store } from '../store.js/mod.js'

// a local store
let store = new Store('web-cmp')
store.load()

// init ajax-headers
let AJAX_AUTH_ID = 'ajax.headers.Authorization'
{
    let a = store.get(AJAX_AUTH_ID, null)
    if (a) {
        Ajax.ajax.headers.Authorization = a
    }
}

export { Ajax, store, Store }
