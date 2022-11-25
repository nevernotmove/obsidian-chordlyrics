import {Plugin} from 'obsidian';
import getLines from "./src/line/getLines";
import getChunks from "./src/chunk/getChunks";
import getHtml from "./src/styler/Styler";

export default class SongBuddy extends Plugin {

	readonly CODE_BLOCK_TRIGGER = "songbuddy";

	onload() {
		this.registerMarkdownCodeBlockProcessor(this.CODE_BLOCK_TRIGGER, this.getProcessor());
	}

	private getProcessor() {
		return function (text: string, html: HTMLElement) {
			const lines = getLines(text);
			const chunks = getChunks(lines);
			const styled = getHtml(chunks);
			html.appendChild(styled);
		};
	}
}
