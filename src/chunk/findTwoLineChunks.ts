import {Chunk} from "./Chunk";
import {ChunkType} from "./ChunkType";

export default function findTwoLineChunks(line1: string, line2: string): Chunk[] {
	[line1, line2] = matchLengthWithWhitespace(line1, line2);
	return findChunks(line1, getWordIndices(line1), line2, getWordIndices(line2));
}

function getWordIndices(text: string): number[] {
	const indices: number[] = [];
	for (const word of text.matchAll(/\S+/g)) {
		if (word.index != null) indices.push(word.index);
	}
	return indices;
}

function findChunks(line1: string, line1Indices: number[], line2: string, line2Indices: number[]) {
	const chunks: Chunk[] = [];
	let lastCut = 0;
	let index1 = line1Indices.shift();
	let index2 = line2Indices.shift();
	while (index1 != undefined || index2 != undefined) {
		if (index1 != undefined && (index2 == undefined || index1 <= index2)) {
			if (cutPossible(line2, index1, lastCut)) {
				chunks.push(cut(lastCut, index1, line1, line2));
				lastCut = index1;
			}
			index1 = line1Indices.shift();
		} else if (index2 != undefined) {
			if (cutPossible(line1, index2, lastCut)) {
				chunks.push(cut(lastCut, index2, line1, line2));
				lastCut = index2;
			}
			index2 = line2Indices.shift();
		}
	}
	chunks.push(cut(lastCut, line1.length, line1, line2));
	return chunks;
}

function matchLengthWithWhitespace(chordLine: string, textLine: string) {
	const diff = Math.abs(chordLine.length - textLine.length);
	if (chordLine.length > textLine.length) textLine += " ".repeat(diff);
	else chordLine += " ".repeat(diff);
	return [chordLine, textLine];
}

function cutPossible(str: string, index: number, lastCutIndex: number): boolean {
	if (index === lastCutIndex) return false;
	const charLeftOfCut = str.charAt(index - 1);
	const charRightOfCut = str.charAt(index);
	return index !== 0 && (charLeftOfCut === " " || charRightOfCut === " ");
}

function cut(beginning: number, end: number, chordLine: string, textLine: string): Chunk {
	const chordPart = chordLine.substring(beginning, end);
	const textPart = textLine.substring(beginning, end);
	return new Chunk(ChunkType.ChordWithText, chordPart, textPart);
}
