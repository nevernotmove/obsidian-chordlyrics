import {ChunkDetector} from "./ChunkDetector";
import {Chunk} from "./Chunk";

const text: string = `C                   Gadd9  D
C                   Gadd9  D
test`;

/*
const text: string = `C   B   Gadd9
Car Boy Grenades from the sky
  Gm    A-  D E        Em-
Last line
`;
*/

describe('Chunk detector', () => {

	it('detects chunks correctly', () => {
		console.log("Input:");
		console.log(text);

		const chunks: Chunk[] = new ChunkDetector().getChunks(text);
		
		expect(true).toBe(false);	
	});
});
