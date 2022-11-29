import {Line} from "./Line";
import {LineType} from "./LineType";
import findLines from "./findLines";

const input = `
C   B   Gadd9
Car Boy Grenades from the sky
  Gm    A-  D E        Em-
Last line


Hello there
Another line is fine
D D A Em D %c
Hi     there     dude %t

[Header]
A   B   C A
E   C F A D`;

const expected: Line[] = [
	new Line("", LineType.Empty),
	new Line("C   B   Gadd9", LineType.Chord),
	new Line("Car Boy Grenades from the sky", LineType.Text),
	new Line("  Gm    A-  D E        Em-", LineType.Chord),
	new Line("Last line", LineType.Text),
	new Line("", LineType.Empty),
	new Line("", LineType.Empty),
	new Line("Hello there", LineType.Text),
	new Line("Another line is fine", LineType.Text),
	new Line("D D A Em D ", LineType.Chord),
	new Line("Hi     there     dude ", LineType.Text),
	new Line("", LineType.Empty),
	new Line("Header", LineType.Header),
	new Line("A   B   C A", LineType.Chord),
	new Line("E   C F A D", LineType.Chord),
];

describe('Line detector', () => {

	const lines: Line[] = findLines(input);

	it('detects number of lines', () => {
		expect(lines.length).toBe(expected.length);
	});

	const data = lines.map((_, i) => {
		return {
			actualType: LineType[lines[i].lineType],
			actualContent: lines[i].content,
			expectedType: LineType[expected[i].lineType],
			expectedContent: expected[i].content
		};
	});
	
	it.each(data)('detects line $#s type as $expectedType', (line) => {
		expect(line.actualType).toBe(line.expectedType);
	});
	
	it.each(data)('detects line $#s content as "$expectedContent"', (line) => {
		expect(line.actualContent).toBe(line.expectedContent);
	});
});
