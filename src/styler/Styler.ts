import {Chunk} from "../chunk/Chunk";

export default function getHtml(chunks: Chunk[][]) {
	const root = document.createElement('pre')
	root.addClass('root');
	// TODO Make your class names unique

	let currentLineId = chunks[0].lineId;
	let line = newLine()
	
	chunks.forEach(chunk => {
		// TODO Don't create chord chunk if there is no chord (empty or only whitespace)
		
		// Line
		if (chunk.lineId != currentLineId) { // Create new line
			root.appendChild(line); // Add previous line to root
			line = newLine()
			currentLineId++;
		}
		if (chunk.header && chunk.header.length != 0) {
			const header = newHeader(chunk.header);
			line.appendChild(header);
		}
		else {
			const chord = newChord(chunk.chord);
			const text = newText(chunk.text);
			const stack = newStack(chord, text);
			line.appendChild(stack);
		}
		
	});
	// Add last line to root
	root.appendChild(line);
	
	return root;
}

function newHeader(content: string): HTMLElement {
	const header = createDiv();
	header.appendChild(document.createTextNode(content));
	header.addClass('header');
	return header;
}

function newChord(content: string): HTMLElement {
	const chord = createDiv();
	chord.appendChild(document.createTextNode(content));
	chord.addClass('chord');
	chord.addClass('cm-strong');
	return chord;
}

function newText(content: string): HTMLElement {
	const text = createDiv();
	text.appendChild(document.createTextNode(content));
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
