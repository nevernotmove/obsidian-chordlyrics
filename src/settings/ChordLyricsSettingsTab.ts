import {App, PluginSettingTab, Setting} from "obsidian";
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
			.setDesc("Use your own chord color instead of using the theme color")
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

		new Setting(containerEl)
			.setName("Customize background color")
			.setDesc("Use your own background color instead of using the theme color")
			.setTooltip("If you don't like how the background color looks with your theme, choose another color here")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCustomBackgroundColor ?? false)
				.onChange(async (value) => {
					this.plugin.settings.enableCustomBackgroundColor = value;
					await this.plugin.saveSettings();
				})
			)
			.addColorPicker(color => color
				.setValue(this.plugin.settings.customBackgroundColor ?? '#777777')
				.onChange(async (value) => {
					this.plugin.settings.customBackgroundColor = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Customize header color")
			.setDesc("Use your own header color instead of using the theme color")
			.setTooltip("If you don't like how the header color looks with your theme, choose another color here")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCustomHeaderColor ?? false)
				.onChange(async (value) => {
					this.plugin.settings.enableCustomHeaderColor = value;
					await this.plugin.saveSettings();
				})
			)
			.addColorPicker(color => color
				.setValue(this.plugin.settings.customHeaderColor ?? '#ffffff')
				.onChange(async (value) => {
					this.plugin.settings.customHeaderColor = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
