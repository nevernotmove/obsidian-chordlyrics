import {Chunk} from "../parser/Chunk";
import {Parser} from "../parser/Parser";
import {Styler} from "../styler/Styler";

export class Processor {

	static get() {
		return function (text: string, html: HTMLElement) {
			
			// Parse text into chunks containing chords and text under it
			const chunks: Chunk[] = new Parser().parse(text);

			// Create a styled HTML representation
			const styled: HTMLElement = new Styler().style(chunks);

			// Insert into HTML
			html.appendChild(styled);
		};
	}
}
