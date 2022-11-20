import {Line} from "../line/Line";
import {Chunk} from "./Chunk";
import {LineType} from "../line/LineType";

export class ChunkDetector {

	getChunks(lines: Line[]): Chunk[] {
		const chunks: Chunk[] = [];

		let lineId = 0;
		let i = 0;
		while (i < lines.length) {
			const line = lines[i];

			if (line.lineType == LineType.Header) {
				const chunk: Chunk = {
					header: line.content,
					chord: "",
					text: "",
					lineId: lineId
				};
				chunks.push(chunk);
				i++;
			} else if (line.lineType == LineType.Empty) {
				const chunk: Chunk = {
					header: "",
					chord: "",
					text: " ",
					lineId: lineId
				};
				chunks.push(chunk);
				i++;
			} else if (line.lineType == LineType.Text) {
				const chunk: Chunk = {
					header: "",
					chord: "",
					text: line.content,
					lineId: lineId
				};
				chunks.push(chunk);
				i++;
			} else if (line.lineType == LineType.Chord && (i + 1) < lines.length && lines[i+1].lineType == LineType.Text) {
				const lineChunks: Chunk[] = this.getPairChunks(line.content, lines[i + 1].content, lineId);
				chunks.push(...lineChunks);
				i += 2;
			} else if (line.lineType == LineType.Chord) {
				const lineChunks: Chunk[] = this.getChordChunks(line.content, lineId);
				chunks.push(...lineChunks);
				i++;
			} else {
				i++;
			}
			lineId++;
		}

		return chunks;
	}

	private getChordChunks(chordLine: string, lineId: number): Chunk[] {
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
			this.addChunk(chunks, chordChunk, "", lineId);
		}

		return chunks;
	}

	private getPairChunks(chordLine: string, textLine: string, lineId: number): Chunk[] {
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
			this.addChunk(chunks, " ", textLine.substring(0, firstChord.index), lineId);
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

			this.addChunk(chunks, chord[0], textChunk, lineId);
		}

		return chunks;
	}

	private addChunk(chunks: Chunk[], chord: string, text: string, lineId: number) {
		const chunk: Chunk = {
			header: "",
			chord: chord,
			text: text,
			lineId: lineId
		};
		chunks.push(chunk);
	}
}
