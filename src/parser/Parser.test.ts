import {Parser} from "./Parser";
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

describe('Parser', () => {

	test('detects chunks correctly', () => {
		console.log("Input:");
		console.log(text);

		const chunks: Chunk[] = new Parser().parse(text);
		
		expect(true).toBe(false);	
	});
});
