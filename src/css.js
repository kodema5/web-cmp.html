
export let getCssText = (name) => {
    let { cssRules } = Array.from(document.styleSheets)
        .filter(a => a.href.indexOf(name)>=0 )[0]
        || {}

    if (!cssRules) return ''

    return Object.values(cssRules)
        .map (r => r.cssText)
        .join('\n')
}
