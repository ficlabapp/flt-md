flt-html
========

This library is a plugin for [@ficlabapp/flt](https://github.com/ficlabapp/flt).

## Usage

```javascript
import { Document } from "@ficlabapp/flt";
import { MarkdownRendererPlugin } from "@ficlabapp/flt-md";

// create a new document and register the plugin
let d = new Document();
d.use(MarkdownRendererPlugin);

// render to Markdown
var md = d.toMarkdown();
```
