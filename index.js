#!/usr/bin/env node
import repl from 'repl'
import jsdom from 'jsdom'
import fs from 'fs'

/* CLI helpers */
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Table from 'cli-table3'
import readline from 'readline'
import ncp from 'copy-paste-win32fix'

/* Additional libraries */
import jquery from 'jquery'
import additionalTools from './additional-tools.js'

/* Initialise the virtual console */
const virtualConsole = new jsdom.VirtualConsole()

/* Send the virtual console to the Node REPL */
virtualConsole.sendTo(console, { omitJSDOMErrors: true })
const { JSDOM } = jsdom

/* Get version number */
const { version } = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)))

/* JSDOM settings */
const resourceLoader = new jsdom.ResourceLoader({
  strictSSL: false, /* Be less strict about SSL issues */
  userAgent: 'repl-domtools/' + version /* Custom user agent */
})

/* Command line options */
const options = yargs(hideBin(process.argv))
  .usage('Usage: --url <url> ')
  .example('domtools --url https://blacklivesmatter.com/')
  .describe('u', 'URL to use to init. DOM')
  .alias('u', 'url')
  .argv

/* Our global colours object for pretty output */
global.colors = {
  dim: '\x1b[2m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  reset: '\x1b[0m',
  underscore: '\x1b[4m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m'
}

/**
 * Clears the current line and prints the output, then shows the prompt
 * @param {string} msg Message to display on the console
 */
const cleanOutput = (msg) => {
  readline.clearLine(process.stdout)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(msg + '\n> ')
  readline.cursorTo(process.stdout, 2)
}

/* Overrides console.log() for the JSDOM context to use the clean output, not the REPL context */
console.log = console.warn = (msg) => { cleanOutput(msg) }
console.error = (error) => {
  cleanOutput(`${global.colors.red}${error}${global.colors.reset}`)
}

/**
 * Initialises and returns a JSDOM environment
 * @param {string} url URL to use to init. DOM
 * @returns 
 */
const getDOM = async (url) => {
  if (url) {
    console.log(`Initialising DOM from ${global.colors.blue}${url}${global.colors.reset}`)
    return await JSDOM.fromURL(url, { runScripts: 'dangerously', pretendToBeVisual: true, resources: resourceLoader, virtualConsole })
  } else {
    console.log('Initialising blank DOM')
    return new JSDOM('<!DOCTYPE html><head></head><body></body></html>', { pretendToBeVisual: true, virtualConsole })
  }
}

/**
 * Prints an array as a table for the console.
 * @param {array} obj Array to parse
 */
const printTable = (obj) => {
  /* If string just print the string */
  if (typeof obj === 'string') return obj

  /* Format object with index to match devtools output */
  let data
  if (Array.isArray(obj)) {
    data = Array.isArray(obj[0]) ? obj.map((e, i) => [i, ...e]) : obj.map((e, i) => [i, e])
  } else {
    data = obj
  }

  /* Init. a new cli-table. */
  let table = new Table()

  /* Add our multi-dimensional array to the table obj */
  table = table.concat(data)

  /* Return the table as a formatted string for the console */
  return table.toString()
}

/* CLI welcome message */
console.log(`repl-domtools ${version} / ${colors.blue}@defaced${colors.reset}`)

/* Support */
if (!process.env.WORKEFFORTWASTE_SUPPORTER) {
  console.log(`${colors.magenta}
┃
┃ ${colors.underscore}Support this project! ${colors.reset}${colors.magenta}
┃
┃ Help support the work that goes into creating and maintaining my projects
┃ and buy me a coffee via Ko-fi or sponsor me on GitHub Sponsors.
┃
┃ Ko-fi: https://ko-fi.com/defaced
┃ GitHub Sponsors: https://github.com/sponsors/workeffortwaste/
┃${colors.reset}
  `)
}

/* Get an interactive DOM from the given URLand init. the REPL */
getDOM(options.url)
  .then(e => {
    console.log(`${global.colors.green}OK${global.colors.reset}`)
    const _context = repl.start({ prompt: '> ', ignoreUndefined: true}).context
    /* Hand the DOM over to the REPL context */
    _context.location = options.url ? new URL(options.url) : null
    _context.window = e.window
    _context.document = e.window.document
    _context.jQuery = jquery(e.window)
    _context.copy = (e) => ncp.copy(e)
    _context.table = (e) => { _context.console.log(printTable(e)) }
    _context.$ = (e) => _context.document.querySelector(e)
    _context.$$ = (e) => [..._context.document.querySelectorAll(e)]
    _context.dom = additionalTools(e)
    /* Handle the unhandled rejections from jsdom */
    process.on('unhandledRejection', (error) => { console.error(`${global.colors.red}${error}${global.colors.reset}`) })
  })
  .catch(e => {
    console.error(`${global.colors.red}${e.message}${global.colors.reset}`)
  })
