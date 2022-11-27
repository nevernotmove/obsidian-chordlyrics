import {Line} from "../line/Line";
import {LineType} from "../line/LineType";
import {ChunkType} from "./ChunkType";
import findChunks from "./findChunks";

describe('findChunks', () => {
	describe.each`
			lineType                | lineContents              | groups | chunks    | chunkContents                   | chunkContents2        | chunkType                             
			${["Empty"]}            | ${[""]}                   | ${1}   | ${[1]}    | ${[['']]}                       | ${[['']]}             | ${[ChunkType.Empty]}                  
			${["Header"]}           | ${["Header"]}             | ${1}   | ${[1]}    | ${[["Header"]]}                 | ${[['']]}             | ${[ChunkType.Header]}                 
			${["Chord"]}            | ${["C"]}                  | ${1}   | ${[1]}    | ${[["C"]]}                      | ${[['']]}             | ${[ChunkType.Chord]}                  
			${["Chord"]}            | ${["C   E"]}              | ${1}   | ${[2]}    | ${[["C   ", "E"]]}              | ${[['', '']]}         | ${[ChunkType.Chord]}                  
			${["Chord"]}            | ${["  A   Em^7"]}         | ${1}   | ${[2]}    | ${[["  A   ", "Em^7"]]}         | ${[['', '']]}         | ${[ChunkType.Chord]}                  
			${["Chord"]}            | ${["B d F G7"]}           | ${1}   | ${[4]}    | ${[["B ", "d ", "F ", "G7"]]}   | ${[['', '', '', '']]} | ${[ChunkType.Chord]}                  
			${["Text"]}             | ${["Hello"]}              | ${1}   | ${[1]}    | ${[["Hello"]]}                  | ${[['']]}             | ${[ChunkType.Word]}                   
			${["Text"]}             | ${["Hello there"]}        | ${1}   | ${[2]}    | ${[["Hello ", "there"]]}        | ${[['', '']]}         | ${[ChunkType.Word]}                   
			${["Text"]}             | ${["I'm over here!"]}     | ${1}   | ${[3]}    | ${[["I'm ", "over ", "here!"]]} | ${[['', '', '']]}     | ${[ChunkType.Word]}                   
			${["Empty", "Empty"]}   | ${["", ""]}               | ${2}   | ${[1, 1]} | ${[[''], ['']]}                 | ${[[''], ['']]}       | ${[ChunkType.Empty, ChunkType.Empty]} 
			${["Empty", "Header"]}  | ${["", "Chorus"]}         | ${2}   | ${[1, 1]} | ${[[''], ["Chorus"]]}           | ${[[''], ['']]}       | ${[ChunkType.Empty, ChunkType.Header]} 
			${["Empty", "Chord"]}   | ${["", "F"]}              | ${2}   | ${[1, 1]} | ${[[''], ["F"]]}                | ${[[''], ['']]}       | ${[ChunkType.Empty, ChunkType.Chord]} 
			${["Empty", "Text"]}    | ${["", "Disco"]}          | ${2}   | ${[1, 1]} | ${[[''], ["Disco"]]}            | ${[[''], ['']]}       | ${[ChunkType.Empty, ChunkType.Word]} 
			${["Header", "Header"]} | ${["Verse", "Chorus"]}    | ${2}   | ${[1, 1]} | ${[["Verse"], ["Chorus"]]}      | ${[[''], ['']]}       | ${[ChunkType.Header, ChunkType.Header]} 
			${["Header", "Empty"]}  | ${["Verse", ""]}          | ${2}   | ${[1, 1]} | ${[["Verse"], ['']]}            | ${[[''], ['']]}       | ${[ChunkType.Header, ChunkType.Empty]} 
			${["Header", "Chord"]}  | ${["Verse", "C#"]}        | ${2}   | ${[1, 1]} | ${[["Verse"], ["C#"]]}          | ${[[''], ['']]}       | ${[ChunkType.Header, ChunkType.Chord]} 
			${["Header", "Text"]}   | ${["Verse", "Once"]}      | ${2}   | ${[1, 1]} | ${[["Verse"], ["Once"]]}        | ${[[''], ['']]}       | ${[ChunkType.Header, ChunkType.Word]} 
			${["Text", "Text"]}     | ${["Again!", "Here!"]}    | ${2}   | ${[1, 1]} | ${[["Again!"], ["Here!"]]}      | ${[[''], ['']]}       | ${[ChunkType.Word, ChunkType.Word]} 
			${["Text", "Empty"]}    | ${["Again!", ""]}         | ${2}   | ${[1, 1]} | ${[["Again!"], ['']]}           | ${[[''], ['']]}       | ${[ChunkType.Word, ChunkType.Empty]} 
			${["Text", "Header"]}   | ${["Again!", "Intro"]}    | ${2}   | ${[1, 1]} | ${[["Again!"], ["Intro"]]}      | ${[[''], ['']]}       | ${[ChunkType.Word, ChunkType.Header]} 
			${["Text", "Chord"]}    | ${["Again!", "B-"]}       | ${2}   | ${[1, 1]} | ${[["Again!"], ["B-"]]}         | ${[[''], ['']]}       | ${[ChunkType.Word, ChunkType.Chord]} 
			${["Chord", "Chord"]}   | ${["Edim7", "B-"]}        | ${2}   | ${[1, 1]} | ${[["Edim7"], ["B-"]]}          | ${[[''], ['']]}       | ${[ChunkType.Chord, ChunkType.Chord]} 
			${["Chord", "Empty"]}   | ${["Edim7", ""]}          | ${2}   | ${[1, 1]} | ${[["Edim7"], ['']]}            | ${[[''], ['']]}       | ${[ChunkType.Chord, ChunkType.Empty]} 
			${["Chord", "Header"]}  | ${["Edim7", "Outro"]}     | ${2}   | ${[1, 1]} | ${[["Edim7"], ["Outro"]]}       | ${[[''], ['']]}       | ${[ChunkType.Chord, ChunkType.Header]} 
			${["Chord", "Text"]}    | ${["E7", "Hearts"]}       | ${1}   | ${[1]}    | ${[["E7    "]]}                 | ${[["Hearts"]]}       | ${[ChunkType.ChordWithText]}
			${["Chord", "Text"]}    | ${["E7 A", "Hearts"]}     | ${1}   | ${[1]}    | ${[["E7 A  "]]}                 | ${[["Hearts"]]}       | ${[ChunkType.ChordWithText]}
			${["Chord", "Text"]}    | ${["E7 A B", "Hearts"]}   | ${1}   | ${[1]}    | ${[["E7 A B"]]}                 | ${[["Hearts"]]}       | ${[ChunkType.ChordWithText]}
			${["Chord", "Text"]}    | ${["E7 A B C", "Hearts"]} | ${1}   | ${[2]}    | ${[["E7 A B ", "C"]]}           | ${[["Hearts ", " "]]} | ${[ChunkType.ChordWithText]}
			${["Chord", "Text"]}    | ${[" A", "Hearts"]}       | ${1}   | ${[1]}    | ${[[" A    "]]}                 | ${[["Hearts"]]}       | ${[ChunkType.ChordWithText]}
		`('for test $#',
		({lineType, lineContents, groups, chunks, chunkContents, chunkContents2, chunkType}) => {

			const numLines = lineType.length;
			describe(`with ${numLines} line(s) of type(s) ${lineType} with content(s) "${lineContents}"`, () => {

				const inputLines: Line[] = [];
				for (let i = 0; i < numLines; i++) {
					const lineTypeEnum: LineType = (<any>LineType)[lineType[i]]; // Get enum from text
					inputLines.push(new Line(lineContents[i], lineTypeEnum));
				}
				const outputChunks = findChunks(inputLines);

				it(`creates ${groups} group(s)`, () => {
					expect(outputChunks.length).toBe(groups);
				});

				for (let g = 0; g < groups; g++) {
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

								it(`set content2 to "${chunkContents2[g][c]}"`, () => {
									expect(outputChunks[g][c].content2).toBe(chunkContents2[g][c]);
								});
							});
						}
					});
				}
			})
		});
});
