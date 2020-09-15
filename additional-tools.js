
module.exports = function (dom) {
  const jsdom = dom

  return {
    // Save the DOM to a file
    save: (fname) => { require('fs').writeFileSync(fname, jsdom.serialize()) },

    // Display the raw DOM as a string
    raw: () => { return jsdom.serialize() },

    // Draw the DOM tree for a given node.
    tree: (node = jsdom.window.document) => {
      let indent = 0
      const drawTree = (node) => {
        let dom = ''

        for (var i = 0; i < indent; i++) dom += `${colors.dim}··${colors.reset}`

        if (node.nodeName.toLowerCase() === '#document'){
          dom += node.nodeName.toLowerCase()
        }
        else {
          dom += `<${node.nodeName.toLowerCase()}>`
        }

        if (node.id) dom += ` ${colors.dim}[${node.id}]${colors.reset}`
        if (node.className) { dom += ` ${colors.dim}(${node.className})${colors.reset}` }
        if (node.src) dom += ` ${colors.green}<${node.src}>${colors.reset}`
        if (node.href) dom += ` ${colors.green}<${node.href}>${colors.reset}`

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
