import {Line} from "../line/Line";
import {Chunk} from "./Chunk";
import {ChunkType} from "./ChunkType";
import {LineType} from "../line/LineType";
import {text} from "stream/consumers";

export class ChunkDetector {

	public getChunks(lines: Line[]): Chunk[][] {
		const chunks: Chunk[][] = [];

		let lineNumber = 0;
		while (lineNumber < lines.length) {
			const group: Chunk[] = [];
			const line = lines[lineNumber];
			
			switch (line.lineType) {
				case LineType.Empty: group.push(new Chunk(ChunkType.Empty)); break;
				case LineType.Header: group.push(new Chunk(ChunkType.Header, line.content)); break;
				case LineType.Text: group.push(...this.getSingleLineWordChunks(line.content)); break;
				case LineType.Chord: {
					if (lineNumber + 1 < lines.length && lines[lineNumber + 1].lineType == LineType.Text) {
						group.push(...this.getChordWithTextChunks(line.content, lines[lineNumber + 1].content));
						lineNumber++;
					}
					else {
						group.push(...this.getSingleLineChordChunks(line.content));
					}
					break;
				}
			}	
			
			lineNumber++;
			chunks.push(group);
		}
		
		return chunks;
	}
	
	private getChordWithTextChunks(chordLine: string, textLine: string): Chunk[] {
		const chunks: Chunk[] = [];
		
		if (chordLine.length > textLine.length) {
			const diff = chordLine.length - textLine.length;
			textLine += " ".repeat(diff);
		}
		else if (textLine.length > chordLine.length) {
			const diff = textLine.length - chordLine.length;
			chordLine += " ".repeat(diff);
		}

		const chordMatches = chordLine.matchAll(/\S+/g);
		const wordMatches = textLine.matchAll(/\S+/g);

		let chordsLeft = true;
		let wordsLeft = true;
		let lastCut = 0;
		let chordIndex = chordMatches.next().value.index;
		let wordIndex = wordMatches.next().value.index;

		while (chordsLeft || wordsLeft) {
			if (chordsLeft && (chordIndex <= wordIndex || !wordsLeft)) {
				if (this.cutPossible(textLine, chordIndex)) {
					const chunk = this.cut(lastCut, chordIndex, chordLine, textLine);
					chunks.push(chunk);
					lastCut = chordIndex;
				}
				const chord = chordMatches.next().value;
				chord ? chordIndex = chord.index : chordsLeft = false;
			} else if (wordsLeft) {
				if (this.cutPossible(chordLine, wordIndex)) {
					const chunk = this.cut(lastCut, wordIndex, chordLine, textLine);
					chunks.push(chunk);
					lastCut = wordIndex;
				}
				const word = wordMatches.next().value;
				word ? wordIndex = word.index : wordsLeft = false;
			}
		}

		const chunk = this.cut(lastCut, chordLine.length, chordLine, textLine);
		chunks.push(chunk);
				
		return chunks;
	}

	private cutPossible(str: string, index: number): boolean {
		const charLeftOfCut = str.charAt(index - 1);
		const charRightOfCut = str.charAt(index);
		return index !== 0 && (charLeftOfCut === " " || charRightOfCut === " ");
	}

	private cut(beginning: number, end: number, chordLine: string, textLine: string): Chunk {
		const chordPart = chordLine.substring(beginning, end);
		const textPart = textLine.substring(beginning, end);
		console.log("Cut from " + beginning + " to " + end);
		console.log("Chord part: '" + chordPart + "'");
		console.log("Text  part: '" + textPart + "'");
		console.log("\n");
		return new Chunk(ChunkType.ChordWithText, chordPart, textPart);
	}
	
	private getSingleLineChordChunks(line: string): Chunk[] {
		return this.getSingleLineChunks(line, ChunkType.Chord);	
	}

	private getSingleLineWordChunks(line: string): Chunk[] {
		return this.getSingleLineChunks(line, ChunkType.Word);
	}
	
	private getSingleLineChunks(line: string, chunkType: ChunkType): Chunk[] {
		const chunks: Chunk[] = [];
		const matches = line.match(/\s*\S+\s*/g)
		if (matches != null) {
			matches.forEach(str => chunks.push(new Chunk(chunkType, str)));
		}
		return chunks;
	}
	
	/*
	getChunks(lines: Line[]): Chunk[][] {
		const chunks: Chunk[][] = [];

		let i = 0;
		while (i < lines.length) {
			const line = lines[i];

			if (line.lineType == LineType.Header) {
				const chunk = new Chunk(ChunkType.Header, line.content);
				chunks.push(chunk);
				i++;
			} else if (line.lineType == LineType.Empty) {
				const chunk = new Chunk(ChunkType.Empty, line.content);
				chunks.push(chunk);
				i++;
			} else if (line.lineType == LineType.Text) {
				const chunk = new Chunk(ChunkType.Word, line.content);
				 TODO Word is not the same as text line
				chunks.push(chunk);
				i++;
			} else if (line.lineType == LineType.Chord && (i + 1) < lines.length && lines[i+1].lineType == LineType.Text) {
				const lineChunks: Chunk[] = this.getPairChunks(line.content, lines[i + 1].content);
				chunks.push(...lineChunks);
				i += 2;
			} else if (line.lineType == LineType.Chord) {
				const lineChunks: Chunk[] = this.getChordChunks(line.content);
				chunks.push(...lineChunks);
				i++;
			} else {
				i++;
			}
		}

		return chunks;
	}

	private getChordChunks(chordLine: string): Chunk[] {
		const chunks: Chunk[] = [];

		const regex = /\S+/g;
		const chords = [...chordLine.matchAll(regex)];

		// Create chord chunks
		for (let i = 0; i < chords.length; i++) {

			const chord = chords[i];
			if (chord.index == undefined) continue;
			const nextChord = chords[i + 1];

			let chunkEndIndex;
			const end = chordLine.length;
			if (nextChord && nextChord.index != undefined && nextChord.index <= end) {
				chunkEndIndex = nextChord.index;
			} else {
				chunkEndIndex = end;
			}
			
			const chordChunk = chordLine.substring(chord.index, chunkEndIndex);	
			this.addChunk(chunks, chordChunk, "", lineId, ChunkType.Chord);
		}

		return chunks;
	}

	private getPairChunks(chordLine: string, textLine: string): Chunk[] {
		const chunks: Chunk[] = [];

		// Add whitespaces to match chord line
		if (chordLine.length > textLine.length) {
			const diff = chordLine.length - textLine.length;
			textLine += " ".repeat(diff);
		}

		const regex = /\S+/g;
		const chords = [...chordLine.matchAll(regex)];

		// Create chunk without chord if first chord does not start at 0
		const firstChord = chords[0];
		if (firstChord.index != undefined && firstChord.index > 0) {
			// TODO Better use null for chord? How?
			this.addChunk(chunks, " ", textLine.substring(0, firstChord.index), ChunkType.Word);
		}

		// Create chord chunks
		const end = textLine.length;
		for (let i = 0; i < chords.length; i++) {

			const chord = chords[i];
			if (chord.index == undefined) continue;
			const nextChord = chords[i + 1];

			let chunkEndIndex;
			if (nextChord && nextChord.index != undefined && nextChord.index <= end) {
				chunkEndIndex = nextChord.index;
			} else {
				chunkEndIndex = end;
			}
			const textChunk = textLine.substring(chord.index, chunkEndIndex);

			this.addChunk(chunks, chord[0], textChunk, ChunkType.ChordWithText);
		}

		return chunks;
	}

	private addChunk(chunks: Chunk[], chord: string, text: string, chunkType: ChunkType) {
		const chunk: Chunk = {
			chunkType: chunkType,
			header: "",
			chord: chord,
			text: text,
			lineId: lineId
		};
		chunks.push(chunk);
	}
	*/
}
