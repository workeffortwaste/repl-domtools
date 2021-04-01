# repl-domtools

*A browser free DevTools playground for your command line.*

Use the DevTools console commands you're used to without the overhead of a browser, utilising the power of Node's REPL.

**Like this project? Help support my projects and buy me a coffee via [ko-fi](https://ko-fi.com/defaced)**.

---

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

