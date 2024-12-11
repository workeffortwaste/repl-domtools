# repl-domtools

*A browser free DevTools playground for your command line.*

Use the DevTools console commands you're used to without the overhead of a browser, utilising the power of Node's REPL.

> **Support this project** <br/> Help support the work that goes into creating and maintaining my projects and sponsor me via [GitHub Sponsors](https://github.com/sponsors/workeffortwaste/).

## Contents

- [repl-domtools](#repl-domtools)
  - [Contents](#contents)
  - [What's New](#whats-new)
    - [1.1.0 🆕](#110-)
  - [Usage](#usage)
    - [Installation](#installation)
    - [Initialise an empty DOM](#initialise-an-empty-dom)
    - [Initialise DOM from a URL](#initialise-dom-from-a-url)
    - [Chrome DevTools Commands](#chrome-devtools-commands)
    - [Additional Commands](#additional-commands)
    - [Examples](#examples)
  - [Download all the images from a URL 🆕](#download-all-the-images-from-a-url-)
  - [Sponsors](#sponsors)
    - [Bonus](#bonus)
  - [Author](#author)

## What's New

### 1.1.0 🆕

* Bypass the REPL and execute a command on the DOM directly from the CLI with the `-script`,`-s` argument.
* Updated core dependencies to the latest versions

## Usage

### Installation 

```
npm install -g repl-domtools
```

### Initialise an empty DOM

Quickly create a very basic DOM for you to play around with.

```
domtools
```

### Initialise DOM from a URL

Initialise the DOM from any website, including parsing JavaScript and linked resources.

```
domtools --url https://defaced.dev/
```

### Chrome DevTools Commands

`$$()` is the equivalent of `[...document.querySelectorAll()]`.

`$()` is the equivalent of `document.querySelector()`.

Display an array as an ascii table.

```
table(array)
```

Copy a string to the OS clipboard.

```
copy(string)
```

### Additional Commands

Visualise the structure of the DOM for a given node.

```
dom.tree(document)
```

Save the modified DOM to a file.

```
dom.save('index.html')
```

Return the DOM as a string.

```
dom.raw()
```

## Examples

### Download all the images from a URL 🆕

```
domtools -u 'https://example.com/' -s '$$("img").forEach(e => console.log(e.src))' | xargs -n 1 curl -O
```

## Sponsors

If you find this project useful please considering sponsoring me on [GitHub Sponsors](https://github.com/sponsors/workeffortwaste/) and help support the work that goes into creating and maintaining my projects.

### Bonus

Sponsors are able to remove the project support message from all my CLI projects, as well as access other additional perks.

## Author

Chris Johnson - [defaced.dev](https://defaced.dev) - [@defaced.dev](https://bsky.app/profile/defaced.dev) (Bluesky)
            
