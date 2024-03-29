import type { HtmlExtension } from "micromark-extension-gfm";
import { gfmTableHtml } from "micromark-extension-gfm-table";

export const gfmTableClassHtml: HtmlExtension = {
  enter: {
    table(token) {
      if (!gfmTableHtml.enter?.table) throw "Failed to import micromark GFM table";
      gfmTableHtml.enter?.table.call(this, token);
      this.tag('<table class="table table-no-outer-padding">');
    },
  },
};
