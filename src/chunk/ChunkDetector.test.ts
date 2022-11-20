import {Line} from "../line/Line";
import {LineType} from "../line/LineType";
import {ChunkDetector} from "./ChunkDetector";
import {ChunkType} from "./ChunkType";

describe('Chunk detector', () => {
	// TODO Add test for null or getting nothing back

	describe.each`
		    numLines | lineTypeText      | lineType                            | lineContents         | numGroups | numChunks| chunkContents                   | chunkType                             
		    ${1}     | ${"Empty"}        | ${[LineType.Empty]}                 | ${[""]}              | ${1}      | ${[1]}   | ${[[null]]}                     | ${[ChunkType.Empty]}                  
			${1}     | ${"Header"}       | ${[LineType.Header]}                | ${["Header"]}        | ${1}      | ${[1]}   | ${[["Header"]]}                 | ${[ChunkType.Header]}                 
			${1}     | ${"Chord"}        | ${[LineType.Chord]}                 | ${["C"]}             | ${1}      | ${[1]}   | ${[["C"]]}                      | ${[ChunkType.Chord]}                  
			${1}     | ${"Chord"}        | ${[LineType.Chord]}                 | ${["C   E"]}         | ${1}      | ${[2]}   | ${[["C   ", "E"]]}              | ${[ChunkType.Chord]}                  
			${1}     | ${"Chord"}        | ${[LineType.Chord]}                 | ${["  A   Em^7"]}    | ${1}      | ${[2]}   | ${[["  A   ", "Em^7"]]}         | ${[ChunkType.Chord]}                  
			${1}     | ${"Chord"}        | ${[LineType.Chord]}                 | ${["B d F G7"]}      | ${1}      | ${[4]}   | ${[["B ", "d ", "F ", "G7"]]}   | ${[ChunkType.Chord]}                  
			${1}     | ${"Text"}         | ${[LineType.Text]}                  | ${["Hello"]}         | ${1}      | ${[1]}   | ${[["Hello"]]}                  | ${[ChunkType.Word]}                   
			${1}     | ${"Text"}         | ${[LineType.Text]}                  | ${["Hello there"]}   | ${1}      | ${[2]}   | ${[["Hello ", "there"]]}        | ${[ChunkType.Word]}                   
			${1}     | ${"Text"}         | ${[LineType.Text]}                  | ${["I'm over here!"]}| ${1}      | ${[3]}   | ${[["I'm ", "over ", "here!"]]} | ${[ChunkType.Word]}                   
			${2}     | ${"Empty, Empty"} | ${[LineType.Empty, LineType.Empty]} | ${["", ""]}          | ${2}      | ${[1, 1]}| ${[[null], [null]]}             | ${[ChunkType.Empty, ChunkType.Empty]} 
			${2}     | ${"Empty, Chord"} | ${[LineType.Empty, LineType.Chord]} | ${["", "F"]}         | ${2}      | ${[1, 1]}| ${[[null], ["F"]]}              | ${[ChunkType.Empty, ChunkType.Chord]} 
        `('for $numLines line(s) ($lineTypeText) with content(s) $content',
		({numLines, _, lineType, lineContents, numGroups, numChunks, chunkContents, chunkType}) => {

			const lines: Line[] = [];
			for (let i = 0; i < numLines; i++) {
				lines.push(new Line(lineContents[i], lineType[i]));
			}
			const chunks = new ChunkDetector().getChunks(lines);

			it(`creates ${numGroups} group(s)`, () => {
				expect(chunks.length).toBe(numGroups);
			});

			// TODO Stop if there are not groups
			// For each group
			for (let g = 0; g < chunks.length; g++) {
				describe(`for group ${g} of type ${ChunkType[chunkType[g]]} with content(s) "${chunkContents[g]}"`, () => {
					it(`creates ${numChunks[g]} chunk(s)`, () => {
						expect(chunks[g].length).toBe(numChunks[g]);
					});

					for (let c = 0; c < chunkContents[g].length; c++) {
						describe(`for chunk ${c} of type ${ChunkType[chunkType[g]]} with content "${chunkContents[g][c]}"`, () => {
							it(`set type to ${ChunkType[chunkType[g]]}`, () => {
								expect(chunks[g][c].chunkType).toBe(chunkType[g]);
							});

							it(`set content to "${chunkContents[g][c]}"`, () => {
								expect(chunks[g][c].content).toBe(chunkContents[g][c]);
							});
						});
					}
				});
			}
		});
});
