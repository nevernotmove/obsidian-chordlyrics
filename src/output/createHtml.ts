import {Chunk} from "../chunk/Chunk";
import {ChunkType} from "../chunk/ChunkType";

const el = (tag: string, children: Node[], ...classes: string[]): HTMLElement => {
	const el = document.createElement(tag);
	el.append(...children);
	classes.forEach(c => el.classList.add(c));
	return el;
};

const div = (children: Node[], ...classes: string[]): HTMLElement => el('div', children, ...classes);

const text = (content: string): Text => document.createTextNode(content);

const stack = (chord: HTMLElement, text: HTMLElement): HTMLElement => div([chord, text], 'chordlyrics-stack');

const chord = (content: string): HTMLElement => div([text(content)], 'chordlyrics-chord', 'cm-strong');

const header = (content: string): HTMLElement => div([text(content)], 'chordlyrics-header');

const word = (content: string): HTMLElement => div([text(content)], 'chordlyrics-word');

const line = (children: HTMLElement[]): HTMLElement => div(children, 'chordlyrics-line');

const chordWithText = (c: string, t: string): HTMLElement => stack(chord(c), word(t));

const chunks = (chunk: Chunk): HTMLElement => {
	switch (chunk.chunkType) {
		case ChunkType.Empty: return word(chunk.content);
		case ChunkType.Header: return header(chunk.content);
		case ChunkType.Word: return word(chunk.content);
		case ChunkType.Chord: return chord(chunk.content);
		case ChunkType.ChordWithText: return chordWithText(chunk.content, chunk.content2);
	}
}

const lines = (group: Chunk[]): HTMLElement => line(group.map(c => chunks(c)));

const root = (lines: HTMLElement[]): HTMLElement => el('pre', lines, 'chordlyrics-root');

export default (groups: Chunk[][]): HTMLElement => root(groups.map(g => lines(g)));
