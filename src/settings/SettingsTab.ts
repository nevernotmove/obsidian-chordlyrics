import {App, PluginSettingTab, Setting} from "obsidian";
import { text } from "stream/consumers";
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

        const {containerEl} = this;
        containerEl.empty();
        const s = this.plugin.getSettings();

        new Setting(containerEl)
                .setName(`Lyrics only`)
                .setDesc(`Hide the chords for better reading`)
                .setTooltip(`This can be useful when you already know the chords but not the lyrics.`)
                .addToggle(toggle => toggle
                    .setValue(s.chords.lyricsOnly ?? false)
                    .onChange(async (value) => {
                        s.chords.lyricsOnly = value;
                        await this.plugin.saveSettings();
                    })
                );

        add('chord', s.customColors.enableChord, (e: boolean) => s.customColors.enableChord = e, s.customColors.chord, (c: string) => s.customColors.chord = c);
        add('background', s.customColors.enableBackground, (e: boolean) => s.customColors.enableBackground = e, s.customColors.background, (c: string) => s.customColors.background = c);
        add('header background', s.customColors.enableHeaderBackground, (e: boolean) => s.customColors.enableHeaderBackground = e, s.customColors.headerBackground, (c: string) => s.customColors.headerBackground = c);
        add('header text', s.customColors.enableHeaderText, (e: boolean) => s.customColors.enableHeaderText = e, s.customColors.headerText, (c: string) => s.customColors.headerText = c);
        add('lyrics', s.customColors.enableLyrics, (e: boolean) => s.customColors.enableLyrics = e, s.customColors.lyrics, (c: string) => s.customColors.lyrics = c);
    }
}
