# popup url extension

[Firefox extension link](https://addons.mozilla.org/addon/popup-url)

Quick popup. Select a text, and then pop up a window in current page not a new tab immediately, with content based on your selection and configured url. Particularly useful for translating, dictionary looking up, wiki searching.

![popup](https://addons.cdn.mozilla.net/user-media/previews/full/241/241359.png)

Before using this extension, click this extension toolbar button to edit the configuration, fill the url parameter with your wanted url.

Place the string: "????" to the variable part of the url. For example, with the url configured to "https://cn.bing.com/dict/search?q=????", after I selected a text: "vocabulary" in a page, this extension will open "https://cn.bing.com/dict/search?q=vocabulary" in this page automatically.

You can fully customized the appearance and position using CSS in configuration.

Note:

* Some website may restrict external connection using Content Security Policy (CSP). This would cause the extension displaying a blank page.
* Firefox extension only, for now.



