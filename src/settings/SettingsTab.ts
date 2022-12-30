import {App, PluginSettingTab, Setting} from "obsidian";
import ChordLyrics from '../../main';

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
				.setTooltip(`If you don't like how the ${name} color looks with your theme, choose another color here`)
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
		const s = this.plugin.getSettings();

		add('chord', s.enableCustomChordColor, (e: boolean) => s.enableCustomChordColor = e, s.customChordColor, (c: string) => s.customChordColor = c );
		add('background', s.enableCustomBackgroundColor, (e: boolean) => s.enableCustomBackgroundColor = e, s.customBackgroundColor, (c: string) => s.customBackgroundColor = c );
		add('header background', s.enableCustomHeaderBackgroundColor, (e: boolean) => s.enableCustomHeaderBackgroundColor = e, s.customHeaderBackgroundColor, (c: string) => s.customHeaderBackgroundColor = c );
		add('header text', s.enableCustomHeaderTextColor, (e: boolean) => s.enableCustomHeaderTextColor = e, s.customHeaderTextColor, (c: string) => s.customHeaderTextColor = c );
		add('lyrics', s.enableCustomLyricsColor, (e: boolean) => s.enableCustomLyricsColor = e, s.customLyricsColor, (c: string) => s.customLyricsColor = c );
	}
}
