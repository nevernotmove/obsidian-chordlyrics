import {Line} from "../line/Line";
import {LineType} from "../line/LineType";
import {ChunkDetector} from "./ChunkDetector";
import {ChunkType} from "./ChunkType";

describe('Chunk detector', () => {
	// TODO Add test for null or getting nothing back

	describe.each`
		    lineType                | lineContents           | groups | chunks    | chunkContents                   | chunkType                             
		    ${["Empty"]}            | ${[""]}                | ${1}   | ${[1]}    | ${[[null]]}                     | ${[ChunkType.Empty]}                  
			${["Header"]}           | ${["Header"]}          | ${1}   | ${[1]}    | ${[["Header"]]}                 | ${[ChunkType.Header]}                 
			${["Chord"]}            | ${["C"]}               | ${1}   | ${[1]}    | ${[["C"]]}                      | ${[ChunkType.Chord]}                  
			${["Chord"]}            | ${["C   E"]}           | ${1}   | ${[2]}    | ${[["C   ", "E"]]}              | ${[ChunkType.Chord]}                  
			${["Chord"]}            | ${["  A   Em^7"]}      | ${1}   | ${[2]}    | ${[["  A   ", "Em^7"]]}         | ${[ChunkType.Chord]}                  
			${["Chord"]}            | ${["B d F G7"]}        | ${1}   | ${[4]}    | ${[["B ", "d ", "F ", "G7"]]}   | ${[ChunkType.Chord]}                  
			${["Text"]}             | ${["Hello"]}           | ${1}   | ${[1]}    | ${[["Hello"]]}                  | ${[ChunkType.Word]}                   
			${["Text"]}             | ${["Hello there"]}     | ${1}   | ${[2]}    | ${[["Hello ", "there"]]}        | ${[ChunkType.Word]}                   
			${["Text"]}             | ${["I'm over here!"]}  | ${1}   | ${[3]}    | ${[["I'm ", "over ", "here!"]]} | ${[ChunkType.Word]}                   
			${["Empty", "Empty"]}   | ${["", ""]}            | ${2}   | ${[1, 1]} | ${[[null], [null]]}             | ${[ChunkType.Empty, ChunkType.Empty]} 
			${["Empty", "Header"]}  | ${["", "Chorus"]}      | ${2}   | ${[1, 1]} | ${[[null], ["Chorus"]]}         | ${[ChunkType.Empty, ChunkType.Header]} 
			${["Empty", "Chord"]}   | ${["", "F"]}           | ${2}   | ${[1, 1]} | ${[[null], ["F"]]}              | ${[ChunkType.Empty, ChunkType.Chord]} 
			${["Empty", "Text"]}    | ${["", "Disco"]}       | ${2}   | ${[1, 1]} | ${[[null], ["Disco"]]}          | ${[ChunkType.Empty, ChunkType.Word]} 
			${["Header", "Header"]} | ${["Verse", "Chorus"]} | ${2}   | ${[1, 1]} | ${[["Verse"], ["Chorus"]]}      | ${[ChunkType.Header, ChunkType.Header]} 
			${["Header", "Empty"]}  | ${["Verse", ""]}       | ${2}   | ${[1, 1]} | ${[["Verse"], [null]]}          | ${[ChunkType.Header, ChunkType.Empty]} 
			${["Header", "Chord"]}  | ${["Verse", "C#"]}     | ${2}   | ${[1, 1]} | ${[["Verse"], ["C#"]]}          | ${[ChunkType.Header, ChunkType.Chord]} 
			${["Header", "Text"]}   | ${["Verse", "Once"]}   | ${2}   | ${[1, 1]} | ${[["Verse"], ["Once"]]}        | ${[ChunkType.Header, ChunkType.Word]} 
			${["Text", "Text"]}     | ${["Again!", "Here!"]} | ${2}   | ${[1, 1]} | ${[["Again!"], ["Here!"]]}      | ${[ChunkType.Word, ChunkType.Word]} 
			${["Text", "Empty"]}    | ${["Again!", ""]}      | ${2}   | ${[1, 1]} | ${[["Again!"], [null]]}         | ${[ChunkType.Word, ChunkType.Empty]} 
			${["Text", "Header"]}   | ${["Again!", "Intro"]} | ${2}   | ${[1, 1]} | ${[["Again!"], ["Intro"]]}      | ${[ChunkType.Word, ChunkType.Header]} 
			${["Text", "Chord"]}    | ${["Again!", "B-"]}    | ${2}   | ${[1, 1]} | ${[["Again!"], ["B-"]]}         | ${[ChunkType.Word, ChunkType.Chord]} 
			${["Chord", "Chord"]}   | ${["Edim7", "B-"]}     | ${2}   | ${[1, 1]} | ${[["Edim7"], ["B-"]]}          | ${[ChunkType.Chord, ChunkType.Chord]} 
			${["Chord", "Empty"]}   | ${["Edim7", ""]}       | ${2}   | ${[1, 1]} | ${[["Edim7"], [null]]}          | ${[ChunkType.Chord, ChunkType.Empty]} 
			${["Chord", "Header"]}  | ${["Edim7", "Outro"]}  | ${2}   | ${[1, 1]} | ${[["Edim7"], ["Outro"]]}       | ${[ChunkType.Chord, ChunkType.Header]} 
		`('for test $#',
		//`('for test $# with $lines line(s) $lineTypeText with content(s) $chunkContents',
		({lineType, lineContents, groups, chunks, chunkContents, chunkType}) => {
			
			const numLines = lineType.length;
			describe(`with ${numLines} line(s) of type(s) ${lineType} with content(s) "${lineContents}"`, () => { // TODO Better line display

				const inputLines: Line[] = [];
				for (let i = 0; i < numLines; i++) {
					const lineTypeEnum: LineType = (<any>LineType)[lineType[i]]; // Get enum from text
					inputLines.push(new Line(lineContents[i], lineTypeEnum));
				}
				const outputChunks = new ChunkDetector().getChunks(inputLines);

				it(`creates ${groups} group(s)`, () => {
					expect(outputChunks.length).toBe(groups);
				});

				// TODO Stop if there are not groups
				// For each group
				for (let g = 0; g < outputChunks.length; g++) {
					describe(`for group ${g} of type ${ChunkType[chunkType[g]]} with content(s) "${chunkContents[g]}"`, () => {
						it(`creates ${chunks[g]} chunk(s)`, () => {
							expect(outputChunks[g].length).toBe(chunks[g]);
						});

						for (let c = 0; c < chunkContents[g].length; c++) {
							describe(`for chunk ${c} of type ${ChunkType[chunkType[g]]} with content "${chunkContents[g][c]}"`, () => {
								it(`set type to ${ChunkType[chunkType[g]]}`, () => {
									expect(outputChunks[g][c].chunkType).toBe(chunkType[g]);
								});

								it(`set content to "${chunkContents[g][c]}"`, () => {
									expect(outputChunks[g][c].content).toBe(chunkContents[g][c]);
								});
							});
						}
					});
				}
			})
		});
});
