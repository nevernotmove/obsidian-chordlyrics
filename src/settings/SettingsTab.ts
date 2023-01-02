import {App, PluginSettingTab, Setting} from "obsidian";
import ChordLyrics from '../main';

export class SettingsTab extends PluginSettingTab {

	private plugin: ChordLyrics;

	public constructor(app: App, plugin: ChordLyrics) {
		super(app, plugin);
		this.plugin = plugin;
	}

	public display(): void {
		const add = (name: string, enable: boolean, setEnable: (e: boolean) => void, color: string, setColor: (c: string) => void) => {
			new Setting(containerEl)
				.setName(`Customize ${name} color`)
				.setDesc(`Use your own ${name} color instead of using the theme color`)
				.setTooltip(`If you don't like how the ${name} color looks with your theme, choose another color here.`)
				.addToggle(toggle => toggle
					.setValue(enable ?? false)
					.onChange(async (value) => {
						setEnable(value);
						await this.plugin.saveSettings();
					})
				)
				.addColorPicker(col => col
					.setValue(color ?? '#000000')
					.onChange(async (value) => {
						setColor(value);
						await this.plugin.saveSettings();
					})
				);
		};

		let {containerEl} = this;
		containerEl.empty();
		const s = this.plugin.getSettings().customColors;

		add('chord', s.enableChord, (e: boolean) => s.enableChord = e, s.chord, (c: string) => s.chord = c );
		add('background', s.enableBackground, (e: boolean) => s.enableBackground = e, s.background, (c: string) => s.background = c );
		add('header background', s.enableHeaderBackground, (e: boolean) => s.enableHeaderBackground = e, s.headerBackground, (c: string) => s.headerBackground = c );
		add('header text', s.enableHeaderText, (e: boolean) => s.enableHeaderText = e, s.headerText, (c: string) => s.headerText = c );
		add('lyrics', s.enableLyrics, (e: boolean) => s.enableLyrics = e, s.lyrics, (c: string) => s.lyrics = c );
	}
}
