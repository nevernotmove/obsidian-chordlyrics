import {Plugin} from 'obsidian';
import findLines from "./line/findLines";
import findChunks from "./chunk/findChunks";
import createHtml from "./output/createHtml";
import {SettingsTab} from './settings/SettingsTab';
import Settings from './settings/Settings';
import {DEFAULT_SETTINGS} from './settings/DefaultSettings';

export default class ChordLyrics extends Plugin {

    private settings: Settings = Object.assign({});
    private readonly CODE_BLOCK_TRIGGER = "chordlyrics";

    public async onload(): Promise<void> {
        await this.loadSettings();
        this.addSettingTab(new SettingsTab(this.app, this));
        this.applySettings();
        this.registerMarkdownCodeBlockProcessor(this.CODE_BLOCK_TRIGGER, this.getProcessor());
        console.log(`Chord Lyrics: version ${this.manifest.version} (requires obsidian ${this.manifest.minAppVersion})`);
    }

    public getSettings(): Settings {
        return this.settings;
    }

    public async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
        this.applySettings();
    }

    private async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    private getProcessor(): (text: string, html: HTMLElement) => void {
        return function (text: string, html: HTMLElement) {
            const lines = findLines(text);
            const chunks = findChunks(lines);
            const styled = createHtml(chunks);
            html.appendChild(styled);
        };
    }

    private applySettings(): void {
        const addProp = (name: string, val: string) => document.documentElement.style.setProperty(name, val);
        const delProp = (name: string) => document.documentElement.style.removeProperty(name);
        const apply = (enable: boolean, name: string, val: string) => enable ? addProp(name, val) : delProp(name);
        const s = this.settings.customColors;
        apply(s.enableChord, '--chordlyrics-chord-color', s.chord);
        apply(s.enableBackground, '--chordlyrics-background-color', s.background);
        apply(s.enableHeaderBackground, '--chordlyrics-header-background-color', s.headerBackground);
        apply(s.enableHeaderText, '--chordlyrics-header-text-color', s.headerText);
        apply(s.enableLyrics, '--chordlyrics-lyrics-color', s.lyrics);
        const cs = this.settings.chords;
        apply(cs.lyricsOnly, '--chord-display', "none");
    }
}
