"use strict";

import { default as TurndownService } from "turndown";
import * as TurndownPluginGFM from "@joplin/turndown-plugin-gfm";
import * as FLT from "@ficlabapp/flt";
import { HTMLRendererPlugin } from "@ficlabapp/flt-html";

/**
 * Plugin to render FLT as markdown
 *
 * @since 1.0.0
 */
export class MarkdownRendererPlugin extends FLT.Plugin {
    /**
     * Register plugin
     *
     * @since 1.0.0
     *
     * @return string[]
     */
    static _register() {
        return ["toMarkdown"];
    }

    /**
     * Render to Markdown
     *
     * @since 1.0.0
     *
     * @param object userOptions User options
     * @return string
     */
    static toMarkdown(userOptions = {}) {
        this.use(HTMLRendererPlugin);
        let md = "";

        // options
        let options = {
            insertHeading: true, // whether to insert an h1 for the document title
            wrap: 80, // wrap lines this wide
        };
        for (let i in options) {
            if (userOptions.hasOwnProperty(i)) options[i] = userOptions[i];
        }

        // render heading
        let title;
        if (
            options.insertHeading &&
            this.features.DCMETA &&
            (title = this.getDC("title").join(", "))
        ) {
            let indent = Math.floor((options.wrap - title.length) / 2);
            md += `${"".padStart(indent, " ")}${title}\n`;
            md += `${"".padStart(indent, " ")}${"".padStart(title.length, "=")}\n\n`;
        }

        // body
        let document = this.toHTMLDOM({ insertHeading: false });
        document
            .querySelectorAll("a[href^='#'], a[name], img")
            .forEach((a) => a.parentNode.removeChild(a));
        let td = new TurndownService({ linkStyle: "referenced", emDelimiter: "*", hr: "   ---" });
        td.use(TurndownPluginGFM.gfm);
        td.addRule("wrap-paragraphs", {
            filter: ["p"],
            replacement: (content) =>
                content
                    .match(/.{1,78}(?:\s|$)/gsu)
                    .map((s) => s.trim())
                    .join("\n") + "\n\n",
        });
        md += td.turndown(document.body);
        return md;
    }
}
