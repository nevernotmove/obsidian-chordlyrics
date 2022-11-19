import {Chunk} from "../parser/Chunk";
import {Parser} from "../parser/Parser";
import {Styler} from "../styler/Styler";
import {MarkdownPostProcessorContext} from "obsidian";

export class Processor {

	static get() {
		return function (text: string, html: HTMLElement, ctx: MarkdownPostProcessorContext) {
			
			// Parse text into chunks containing chord and text under it
			const chunks: Chunk[] = new Parser().parse(text);

			const styled: HTMLElement = new Styler().style(chunks);

			// TODO Monospace or not?
			
			// Insert into HTML
			html.appendChild(styled);

			// TODO Second step: Wrap each word in span
		};
	}
}
