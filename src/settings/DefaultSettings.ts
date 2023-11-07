import Settings from './Settings';

export const DEFAULT_SETTINGS: Partial<Settings> = {
    customColors: {
        enableChord: false,
        chord: '#ffffff',
        enableBackground: false,
        background: '#000000',
        enableHeaderBackground: false,
        headerBackground: '#222222',
        enableHeaderText: false,
        headerText: '#eeeeee',
        enableLyrics: false,
        lyrics: '#dddddd'
    },
    chords: {
        lyricsOnly: true
    }
};
