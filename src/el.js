// utility functions for elemen
//
let Fns = {

    toggleClass: (el, cls) => {
        let cs = el.classList
        cs[cs.contains(cls) ? 'remove' : 'add'](cls)
    },

}

// cache prototype
//
let proto = Object.entries(Fns).reduce((proto, [name, fn]) => {
    proto[name] = function() {
        let e = this.el
        if (!e) throw new Error('element undefined')

        let a = fn.apply(
            this,
            [e].concat(Array.from(arguments)))
        return a ?? this
    }
    return proto
}, {})


export let El = (el) => Object.assign({...proto}, {el})
Object.assign(El, Fns)

