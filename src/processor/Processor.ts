import {ChunkDetector} from "../chunk/getChunks";
import {Styler} from "../styler/Styler";
import {LineDetector} from "../line/LineDetector";

export class Processor {

	static get() {
		return function (text: string, html: HTMLElement) {
			const lines = new LineDetector().getLines(text);
			const chunks = new ChunkDetector().getChunks(lines);
			const styled = new Styler().getHtml(chunks);
			html.appendChild(styled);
		};
	}
}
