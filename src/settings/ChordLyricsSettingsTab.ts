import {App, ColorComponent, PluginSettingTab, Setting} from "obsidian";
import ChordLyrics from '../../main';

export class ChordLyricsSettingsTab extends PluginSettingTab {

	private plugin: ChordLyrics;

	public constructor(app: App, plugin: ChordLyrics) {
		super(app, plugin);
		this.plugin = plugin;
	}

	public display(): void {
		let {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Customize chord color")
			.setDesc("Use your own color instead of using the theme color")
			.setTooltip("If you don't like how the chord color looks with your theme, choose another color here")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCustomChordColor ?? false)
				.onChange(async (value) => {
					this.plugin.settings.enableCustomChordColor = value;
					await this.plugin.saveSettings();
				})
			)
			.addColorPicker(color => color
				.setValue(this.plugin.settings.customChordColor ?? '#000000')
				.onChange(async (value) => {
					this.plugin.settings.customChordColor = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
