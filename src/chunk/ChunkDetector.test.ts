import {Line} from "../line/Line";
import {LineType} from "../line/LineType";
import {ChunkDetector} from "./ChunkDetector";
import {ChunkType} from "./ChunkType";

describe('Chunk detector', () => {
	// TODO Add test for null or getting nothing back
	// TODO Simplyfy tests by parameterizing them
	describe('for a single line', () => {

		describe.each`
		    lineTypeText | lineType           | chunkType           | numGroups | numChunks | content          | chunkContents
			${"Empty"}   | ${LineType.Empty}  | ${ChunkType.Empty}  | ${1}      | ${1}      | ${""}            | ${[null]}
			${"Header"}  | ${LineType.Header} | ${ChunkType.Header} | ${1}      | ${1}      | ${"Header"}      | ${["Header"]}
			${"Chord"}   | ${LineType.Chord}  | ${ChunkType.Chord}  | ${1}      | ${1}      | ${"C"}           | ${["C"]}
			${"Chord"}   | ${LineType.Chord}  | ${ChunkType.Chord}  | ${1}      | ${2}      | ${"C   E"}       | ${["C   ", "E"]}
			${"Chord"}   | ${LineType.Chord}  | ${ChunkType.Chord}  | ${1}      | ${2}      | ${"  A   Em^7"}  | ${["  A   ", "Em^7"]}
			${"Chord"}   | ${LineType.Chord}  | ${ChunkType.Chord}  | ${1}      | ${4}      | ${"B d F G7"}    | ${["B ", "d ", "F ", "G7"]}
			${"Text"}    | ${LineType.Text}   | ${ChunkType.Word}   | ${1}      | ${1}      | ${"Hello"}       | ${["Hello"]}
			${"Text"}    | ${LineType.Text}   | ${ChunkType.Word}   | ${1}      | ${2}      | ${"Hello there"} | ${["Hello ", "there"]}
        `('with type $lineTypeText and content "$content"',
			({_, lineType, chunkType, numGroups, numChunks, content, chunkContents}) => {

				const lines: Line[] = [new Line(content, lineType)]
				const chunks = new ChunkDetector().getChunks(lines);

				it(`creates ${numGroups} group(s)`, () => {
					expect(chunks.length).toBe(numGroups);
				});

				it(`creates ${numChunks} chunk(s)`, () => {
					expect(chunks[0].length).toBe(numChunks);
				});

				for (let i = 0; i < chunkContents.length; i++) {
					describe(`creates chunk for "${chunkContents[i]}"`, () => {
						it(`with type ${ChunkType[chunkType]}`, () => {
							expect(chunks[0][i].chunkType).toBe(chunkType);
						});

						it(`with content "${chunkContents[i]}"`, () => {
							expect(chunks[0][i].content).toBe(chunkContents[i]);
						});
					});
				}
			});
	});
});
