import {Plugin} from 'obsidian';
import findLines from "./src/line/findLines";
import findChunks from "./src/chunk/findChunks";
import createHtml from "./src/output/createHtml";

export default class SongBuddy extends Plugin {

	readonly CODE_BLOCK_TRIGGER = "songbuddy";

	onload(): void {
		this.registerMarkdownCodeBlockProcessor(this.CODE_BLOCK_TRIGGER, this.getProcessor());
	}

	private getProcessor(): (text: string, html: HTMLElement) => void {
		return function (text: string, html: HTMLElement) {
			const lines = findLines(text);
			const chunks = findChunks(lines);
			const styled = createHtml(chunks);
			html.appendChild(styled);
		};
	}
}
