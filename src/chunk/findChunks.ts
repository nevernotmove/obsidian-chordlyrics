import {Line} from "../line/Line";
import {Chunk} from "./Chunk";
import {ChunkType} from "./ChunkType";
import {LineType} from "../line/LineType";
import findTwoLineChunks from "./findTwoLineChunks";

export default function findChunks(lines: Line[]): Chunk[][] {
	const nextLineIsText = () => lineNumber + 1 < lines.length && lines[lineNumber + 1].lineType == LineType.Text;
	function handleChordLine(group: Chunk[], line: Line) {
		if (nextLineIsText()) {
			group.push(...findTwoLineChunks(line.content, lines[lineNumber + 1].content));
			lineNumber++;
		} else group.push(...getSingleLineChordChunks(line.content));
	}

	const chunks: Chunk[][] = [];
	let lineNumber = 0;
	while (lineNumber < lines.length) {
		const group: Chunk[] = [];
		const line = lines[lineNumber];
		switch (line.lineType) {
			case LineType.Empty: group.push(new Chunk(ChunkType.Empty)); break;
			case LineType.Header: group.push(new Chunk(ChunkType.Header, line.content)); break;
			case LineType.Text: group.push(...getSingleLineWordChunks(line.content)); break;
			case LineType.Chord: handleChordLine(group, line); break;
		}	
		lineNumber++;
		chunks.push(group);
	}

	return chunks;
}

function getSingleLineChordChunks(line: string): Chunk[] {
	return getSingleLineChunks(line, ChunkType.Chord);
}

function getSingleLineWordChunks(line: string): Chunk[] {
	return getSingleLineChunks(line, ChunkType.Word);
}

function getSingleLineChunks(line: string, chunkType: ChunkType): Chunk[] {
	const chunks: Chunk[] = [];
	const matches = line.match(/\s*\S+\s*/g)
	if (matches != null) {
		matches.forEach(str => chunks.push(new Chunk(chunkType, str)));
	}
	return chunks;
}
