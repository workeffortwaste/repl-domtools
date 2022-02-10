#!/usr/bin/env node
import repl from 'repl'
import jsdom from 'jsdom'

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import Table from 'cli-table3'
import readline from 'readline'
import ncp from 'copy-paste-win32fix'
import Table from 'cli-table3'

import jquery from 'jquery'
import additionalTools from './additional-tools.js'

const virtualConsole = new jsdom.VirtualConsole() // Init virtual console.
virtualConsole.sendTo(console, { omitJSDOMErrors: true }) // Send the virtual console to the Node console.
const { JSDOM } = jsdom

const resourceLoader = new jsdom.ResourceLoader({
  strictSSL: false, // Disable requirement for valid SSL certificate.
  userAgent: 'DOMTools/1.0.0' // Set a user agent, req. for many websites.
})

// Command line options.
const options = yargs(hideBin(process.argv))
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
  cleanOutput(`${global.colors.red}${error}${global.colors.reset}`)
}

// Initialise the DOM
const getDOM = async (url) => {
  console.log(`${global.colors.dim}REPL DOMTools v1.0.0 - Chris Johnson / @defaced${global.colors.reset}`)
  if (url) {
    console.log(`Initialising DOM from ${global.colors.blue}${url}${global.colors.reset}`)
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
    const _context = repl.start({ prompt: '> ' }).context
    // Hand the DOM to the REPL context.
    _context.location = new URL(options.url)
    _context.window = e.window
    _context.document = e.window.document
    _context.jQuery = jquery(e.window)
    _context.copy = (e) => ncp.copy(e)
    _context.table = (e) => { let a = new Table(); a = a.concat(e); _context.console.log(a.toString()) }
    _context.$ = (e) => _context.document.querySelector(e)
    _context.$$ = (e) => [..._context.document.querySelectorAll(e)]
    _context.dom = additionalTools(e)
  })
  .catch(e => {
    console.error(`${global.colors.red}${e.message}${global.colors.reset}`)
  })
