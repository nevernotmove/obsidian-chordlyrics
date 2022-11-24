import {Chunk} from "./Chunk";
import {ChunkType} from "./ChunkType";

export default function getChordWithTextChunks(chordLine: string, textLine: string): Chunk[] {
	const chunks: Chunk[] = [];
	[chordLine, textLine] = matchLengths(chordLine, textLine);
	const chordMatches = chordLine.matchAll(/\S+/g);
	const wordMatches = textLine.matchAll(/\S+/g);
	let chordsLeft = true;
	let wordsLeft = true;
	let lastCut = 0;
	let chordIndex = chordMatches.next().value.index;
	let wordIndex = wordMatches.next().value.index;
	while (chordsLeft || wordsLeft) {
		if (chordsLeft && (chordIndex <= wordIndex || !wordsLeft)) {
			if (cutPossible(textLine, chordIndex)) {
				chunks.push(cut(lastCut, chordIndex, chordLine, textLine));
				lastCut = chordIndex;
			}
			const chord = chordMatches.next().value;
			chord ? chordIndex = chord.index : chordsLeft = false;
		} else if (wordsLeft) {
			if (cutPossible(chordLine, wordIndex)) {
				chunks.push(cut(lastCut, wordIndex, chordLine, textLine));
				lastCut = wordIndex;
			}
			const word = wordMatches.next().value;
			word ? wordIndex = word.index : wordsLeft = false;
		}
	}
	chunks.push(cut(lastCut, chordLine.length, chordLine, textLine));
	return chunks;
}

function matchLengths(chordLine: string, textLine: string)  {
	if (chordLine.length > textLine.length) {
		const diff = chordLine.length - textLine.length;
		textLine += " ".repeat(diff);
	} else if (textLine.length > chordLine.length) {
		const diff = textLine.length - chordLine.length;
		chordLine += " ".repeat(diff);
	}
	return [chordLine, textLine];
}

function cutPossible(str: string, index: number): boolean {
	const charLeftOfCut = str.charAt(index - 1);
	const charRightOfCut = str.charAt(index);
	return index !== 0 && (charLeftOfCut === " " || charRightOfCut === " ");
}

function cut(beginning: number, end: number, chordLine: string, textLine: string): Chunk {
	const chordPart = chordLine.substring(beginning, end);
	const textPart = textLine.substring(beginning, end);
	return new Chunk(ChunkType.ChordWithText, chordPart, textPart);
}
