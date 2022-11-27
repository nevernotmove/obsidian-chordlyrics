import {Chunk} from "../chunk/Chunk";
import {ChunkType} from "../chunk/ChunkType";

const el = (tag: string, content: string | null, ...classes: string[]): HTMLElement => {
	const el = document.createElement(tag);
	if (content != null) el.appendChild(document.createTextNode(content));
	el.addClasses(classes);
	return el;
};

const div = (content: string | null, ...classes: string[]): HTMLElement => el('div', content, ...classes);
const pre = (...classes: string[]): HTMLElement => el('pre', null, ...classes);

const stack = (chord: HTMLElement, text: HTMLElement): HTMLElement => {
	const stack = div(null, 'stack');
	stack.append(chord, text);
	return stack;
};

const header = (content: string | null): HTMLElement => div(content, 'header');
const chord = (content: string | null): HTMLElement => div(content, 'chord', 'cm-strong');
const text = (content: string | null): HTMLElement => div(content, 'text');
const line = (): HTMLElement => div(null, 'line');
const chordWithText = (c: string| null, t: string | null): HTMLElement => stack(chord(c), text(t));

const mapChunk = (chunk: Chunk): HTMLElement => {
	switch (chunk.chunkType) {
		case ChunkType.Empty: return text(chunk.content);
		case ChunkType.Header: return header(chunk.content);
		case ChunkType.Word: return text(chunk.content);
		case ChunkType.Chord: return chord(chunk.content);
		case ChunkType.ChordWithText: return chordWithText(chunk.content, chunk.content2);
	}	
}
const mapGroup = (group: Chunk[]): HTMLElement => {
	let l = line()
	group.forEach(chunk => l.append(mapChunk(chunk)));
	return l;
}

export default (groups: Chunk[][]): HTMLElement => {
	const root = pre('root');
	root.append(...groups.map(g => mapGroup(g)));
	return root;
}
