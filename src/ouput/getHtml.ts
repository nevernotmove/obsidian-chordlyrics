import {Chunk} from "../chunk/Chunk";
import {ChunkType} from "../chunk/ChunkType";

export default function getHtml(chunks: Chunk[][]) {
	const root = document.createElement('pre')
	root.addClass('root');

	chunks.forEach(group => {
		let line = newLine()
		group.forEach(chunk => {
			switch (chunk.chunkType) {
				case ChunkType.Empty: line.appendChild(newText(chunk.content)); break;
				case ChunkType.Header: line.appendChild(newHeader(chunk.content)); break;
				case ChunkType.Word: line.appendChild(newText(chunk.content)); break;
				case ChunkType.Chord: line.appendChild(newChord(chunk.content)); break;
				case ChunkType.ChordWithText: line.appendChild(newChordWithText(chunk.content, chunk.content2)); break;
			}
		})
		root.appendChild(line);
	});

	return root;
}

function newChordWithText(chordContent: string | null, textContent: string | null): HTMLElement {
	const chord = newChord(chordContent);
	const text = newText(textContent);
	const stack = newStack(chord, text);
	return stack;
}

function newHeader(content: string | null): HTMLElement {
	const header = createDiv();
	header.appendChild(document.createTextNode(content || ""));
	header.addClass('header');
	return header;
}

function newChord(content: string | null): HTMLElement {
	const chord = createDiv();
	chord.appendChild(document.createTextNode(content || ""));
	chord.addClass('chord');
	chord.addClass('cm-strong');
	return chord;
}

function newText(content: string | null): HTMLElement {
	const text = createDiv();
	text.appendChild(document.createTextNode(content || ""));
	text.addClass('text');
	return text;
}

function newStack(chord: HTMLElement, text: HTMLElement): HTMLElement {
	const stack = createDiv();
	stack.appendChild(chord);
	stack.appendChild(text);
	stack.addClass('stack');
	return stack;
}

function newLine(): HTMLElement {
	const line = createDiv();
	line.addClass('line');
	return line;
}
