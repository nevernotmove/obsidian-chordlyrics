import {Plugin} from 'obsidian';
import findLines from "./src/line/findLines";
import findChunks from "./src/chunk/findChunks";
import createHtml from "./src/output/createHtml";
import {ChordLyricsSettingsTab} from './src/settings/ChordLyricsSettingsTab';
import ChordLyricsSettings from './src/settings/ChordLyricsSettings';

const DEFAULT_SETTINGS: Partial<ChordLyricsSettings> = {
	enableCustomChordColor: false,
	customChordColor: '#000000',
};

export default class ChordLyrics extends Plugin {

	// TODO Fix
	settings: ChordLyricsSettings;

	private readonly CODE_BLOCK_TRIGGER = "chordlyrics";

	public async onload(): Promise<void> {
		await this.loadSettings();
		this.addSettingTab(new ChordLyricsSettingsTab(this.app, this));
		this.applySettings();
		this.registerMarkdownCodeBlockProcessor(this.CODE_BLOCK_TRIGGER, this.getProcessor());
	}

	private async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.applySettings();
	}

	private getProcessor(): (text: string, html: HTMLElement) => void {
		return function (text: string, html: HTMLElement) {
			const lines = findLines(text);
			const chunks = findChunks(lines);
			const styled = createHtml(chunks);
			html.appendChild(styled);
		};
	}

	private applySettings() {
		if (this.settings.enableCustomChordColor) {
			document.documentElement.style.setProperty('--chord-color', this.settings.customChordColor);
		}
		else {
			document.documentElement.style.removeProperty('--chord-color');
		}
	}
}
