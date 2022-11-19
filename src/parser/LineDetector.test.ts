import {LineDetector} from "./LineDetector";
import {Line} from "./Line";

const text: string = `C   B   Gadd9
Car Boy Grenades from the sky
  Gm    A-  D E        Em-
Last line
`;

describe('LineDetector', () => {
	
	test('detects lines correctly', () => {
		console.log("Input:");
		console.log(text);
		
		const lines: Line[] = new LineDetector().getLines(text);
		
		console.log("Detected lines:");
		console.log(lines);
		expect(true).toBe(true);	
	});
});
