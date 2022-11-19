import {Line} from "./Line";
import {Chunk} from "./Chunk";
import {LineTypeDetector} from "./LineTypeDetector";
import {LineType} from "./LineType";

export class Parser {

	parse(text: string): Chunk[] {
		const lines: Line[] = new LineTypeDetector().getLines(text);
		console.log("Lines:");
		console.log(lines);

		const chunks: Chunk[] = [];
		// TODO Actually group lines dynamically before chunking

		let lineId = 0;
		let i = 0;
		while (i < lines.length) {
			// TODO Check line types and adjust behaviour
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
				const lineChunks: Chunk[] = this.getChunks(line.content, lines[i + 1].content, lineId);
				chunks.push(...lineChunks);
				i += 2;
			} else if (line.lineType == LineType.Chord) {
				const lineChunks: Chunk[] = this.getChordChunks(line.content, lineId);
				chunks.push(...lineChunks);
				i++;
			} else {
				// TODO add dangling line based on type
				console.log("What?")
				i++;
			}
			lineId++;
		}

		console.log("Detected chunks:(" + chunks.length + ")");
		console.log(chunks);

		return chunks;
	}

	private getChordChunks(chordLine: string, lineId: number): Chunk[] {
		const chunks: Chunk[] = [];

		const regex = /\S+/g;
		const chords = [...chordLine.matchAll(regex)];

		// TODO Check if chords array is empty
		// TODO handle only chord or only text line

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

	private getChunks(chordLine: string, textLine: string, lineId: number): Chunk[] {
		const chunks: Chunk[] = [];

		// Add whitespaces to match chord line
		if (chordLine.length > textLine.length) {
			const diff = chordLine.length - textLine.length;
			textLine += " ".repeat(diff);
		}

		const regex = /\S+/g;
		const chords = [...chordLine.matchAll(regex)];

		// TODO Check if chords array is empty
		// TODO handle only chord or only text line

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
