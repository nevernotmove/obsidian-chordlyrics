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
			.setName("Customize header background color")
			.setDesc("Use your own header background color instead of using the theme color")
			.setTooltip("If you don't like how the header background color looks with your theme, choose another color here")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCustomHeaderBackgroundColor ?? false)
				.onChange(async (value) => {
					this.plugin.settings.enableCustomHeaderBackgroundColor = value;
					await this.plugin.saveSettings();
				})
			)
			.addColorPicker(color => color
				.setValue(this.plugin.settings.customHeaderBackgroundColor ?? '#ffffff')
				.onChange(async (value) => {
					this.plugin.settings.customHeaderBackgroundColor = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Customize header text color")
			.setDesc("Use your own header text color instead of using the theme color")
			.setTooltip("If you don't like how the header text color looks with your theme, choose another color here")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCustomHeaderTextColor ?? false)
				.onChange(async (value) => {
					this.plugin.settings.enableCustomHeaderTextColor = value;
					await this.plugin.saveSettings();
				})
			)
			.addColorPicker(color => color
				.setValue(this.plugin.settings.customHeaderTextColor ?? '#ffffff')
				.onChange(async (value) => {
					this.plugin.settings.customHeaderTextColor = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Customize lyrics color")
			.setDesc("Use your own lyrics color instead of using the theme color")
			.setTooltip("If you don't like how the lyrics color looks with your theme, choose another color here")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.enableCustomLyricsColor ?? false)
				.onChange(async (value) => {
					this.plugin.settings.enableCustomLyricsColor = value;
					await this.plugin.saveSettings();
				})
			)
			.addColorPicker(color => color
				.setValue(this.plugin.settings.customLyricsColor ?? '#ffffff')
				.onChange(async (value) => {
					this.plugin.settings.customLyricsColor = value;
					await this.plugin.saveSettings();
				})
			);
	}
}
