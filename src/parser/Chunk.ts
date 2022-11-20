export class Chunk {
	header: string;
	chord: string;
	text: string;
	lineId: number;

	constructor(header: string, chord: string, text: string, lineId: number) {
		this.header = header;
		this.chord = chord;
		this.text = text;
		this.lineId = lineId;
	}
}
