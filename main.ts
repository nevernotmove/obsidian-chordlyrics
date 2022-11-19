import {Plugin} from 'obsidian';
import {Processor} from "./src/processor/Processor";

export default class SongBuddy extends Plugin {

	readonly CODE_BLOCK_TRIGGER = "songbuddy";

	onload() {
		this.registerMarkdownCodeBlockProcessor(this.CODE_BLOCK_TRIGGER, Processor.get());
	}
}
