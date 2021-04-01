#!/usr/bin/env node
const Table = require('cli-table3')
const jsdom = require('jsdom')
const virtualConsole = new jsdom.VirtualConsole() // Init virtual console.
virtualConsole.sendTo(console, { omitJSDOMErrors: true }) // Send the virtual console to the Node console.

const { JSDOM } = jsdom
const yargs = require('yargs')
const readline = require('readline') // Used for easier output control.
const ncp = require('copy-paste')

const resourceLoader = new jsdom.ResourceLoader({
  strictSSL: false, // Disable requirement for valid SSL certificate.
  userAgent: 'DOMTools/0.0.1' // Set a user agent, req. for many websites.
})

// Command line options.
const options = yargs
  .usage('Usage: --url <url> ')
  .example('domtools --url https://blacklivesmatter.com/')
  .describe('url', 'URL to use to init. DOM')
  .argv

// Colours for console output.
global.colors = {
  dim: '\x1b[2m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  reset: '\x1b[0m'
}

// Clean the current line, print the output, and show the prompt.
const cleanOutput = (msg) => {
  readline.clearLine(process.stdout)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(msg + '\n> ')
  readline.cursorTo(process.stdout, 2)
}

// Override the console.log for the JSDOM context only to use the clean output, not the REPL context.
console.log = console.warn = function (msg) { cleanOutput(msg) }
console.error = function (error) {
  cleanOutput(`${colors.red}${error}${colors.reset}`)
}

// Initialise the DOM
const getDOM = async (url) => {
  console.log(`${colors.dim}REPL DOMTools v0.0.1 - Chris Johnson / @defaced${colors.reset}`)
  if (url) {
    console.log(`Initialising DOM from ${colors.blue}${url}${colors.reset}`)
    return await JSDOM.fromURL(url, { runScripts: 'dangerously', pretendToBeVisual: true, resources: resourceLoader, virtualConsole })
  } else {
    console.log('Initialising blank DOM')
    return new JSDOM('<!DOCTYPE html><head></head><body></body></html>', { pretendToBeVisual: true, virtualConsole })
  }
}

// Fetch the DOM and start REPL
getDOM(options.url)
  .then(e => {
    console.log('DOM initialised')
    const _context = require('repl').start({ prompt: '> ' }).context
    // Hand the DOM to the REPL context.
    _context.window = e.window
    _context.document = e.window.document
    _context.jQuery = require('jquery')(e.window)
    _context.copy = (e) => ncp.copy(e)
    _context.table = (e) => { let a = new Table(); a = a.concat(e); _context.console.log(a.toString()) }
    _context.dom = require('./additional-tools')(e)
  })
  .catch(e => {
    console.error(`${colors.red}${e.message}${colors.reset}`)
  })
