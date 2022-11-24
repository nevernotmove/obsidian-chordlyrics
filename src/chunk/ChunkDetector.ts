import {Line} from "../line/Line";
import {Chunk} from "./Chunk";
import {ChunkType} from "./ChunkType";
import {LineType} from "../line/LineType";
import getChordWithTextChunks from "./getChordWithTextChunks";

export class ChunkDetector {

	public getChunks(lines: Line[]): Chunk[][] {
		const nextLineIsText = () => lineNumber + 1 < lines.length && lines[lineNumber + 1].lineType == LineType.Text;
		function handleChordLine(group: Chunk[], line: Line) {
			if (nextLineIsText()) {
				group.push(...getChordWithTextChunks(line.content, lines[lineNumber + 1].content));
				lineNumber++;
			} else group.push(...this.getSingleLineChordChunks(line.content));
		}

		const chunks: Chunk[][] = [];
		let lineNumber = 0;
		while (lineNumber < lines.length) {
			const group: Chunk[] = [];
			const line = lines[lineNumber];
			switch (line.lineType) {
				case LineType.Empty: group.push(new Chunk(ChunkType.Empty)); break;
				case LineType.Header: group.push(new Chunk(ChunkType.Header, line.content)); break;
				case LineType.Text: group.push(...this.getSingleLineWordChunks(line.content)); break;
				case LineType.Chord: handleChordLine.call(this, group, line); break;
			}	
			lineNumber++;
			chunks.push(group);
		}

		return chunks;
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
}
