import fs from 'fs'

export default (dom) => {
  const jsdom = dom

  return {
    // Save the DOM to a file
    save: (fname) => { fs.writeFileSync(fname, jsdom.serialize()) },

    // Display the raw DOM as a string
    raw: () => { return jsdom.serialize() },

    // Draw the DOM tree for a given node.
    tree: (node = jsdom.window.document) => {
      let indent = 0
      const drawTree = (node) => {
        let dom = ''

        for (let i = 0; i < indent; i++) dom += `${global.colors.dim}··${global.colors.reset}`

        if (node.nodeName.toLowerCase() === '#document') {
          dom += node.nodeName.toLowerCase()
        } else {
          dom += `<${node.nodeName.toLowerCase()}>`
        }

        if (node.id) dom += ` ${global.colors.dim}[${node.id}]${global.colors.reset}`
        if (node.className) { dom += ` ${global.colors.dim}(${node.className})${global.colors.reset}` }
        if (node.src) dom += ` ${global.colors.green}<${node.src}>${global.colors.reset}`
        if (node.href) dom += ` ${global.colors.green}<${node.href}>${global.colors.reset}`

        process.stdout.write(`${dom}\n`)

        indent++;
        [].forEach.call(node.children, (node) => {
          drawTree(node)
        })
        indent--
      }
      drawTree(node)
    }
  }
}
