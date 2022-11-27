/**
 * @jest-environment jsdom
 */

import createHtml from "./createHtml";
import {Chunk} from "../chunk/Chunk";
import {ChunkType} from "../chunk/ChunkType";

const empty = new Chunk(ChunkType.Empty);
const header = new Chunk(ChunkType.Header, 'header');
const chord = new Chunk(ChunkType.Chord, 'chord');
const word = new Chunk(ChunkType.Word, 'word');
const chordText = new Chunk(ChunkType.ChordWithText, 'chord with text');

const wordDiv = Object.assign(document.createElement('div'), {classList: ["word"]});

describe('createHtml', () => {

	describe.each`
		id   | input          | expected
		${1} | ${[[empty]]}   | ${[[wordDiv]]}
	`('for test $id', ({_, input, expected}) => {

		const actual: HTMLElement = createHtml(input);

		describe('returns root element', () => {

			it(`of type HTMLElement`, () => {
				expect(actual).toBeInstanceOf(HTMLElement)
			});

			it(`with tag 'pre'`, () => {
				expect(actual.tagName.toLowerCase()).toEqual('pre');
			});

			it(`has 1 class`, () => {
				expect(actual.classList.length).toBe(1);
			});
			
			it(`has class 'root'`, () => {
				expect(actual.classList.contains('root')).toBeTruthy();
			});

			const children = expected.length > 1 ? 'lines' : 'line';
			it(`with ${expected.length} ${children}`, () => {
				expect(actual.children.length).toBe(expected.length);
			});
		});

		for (let g = 0; g < expected.length; g++) {
			
			describe(`line ${g}`, () => {
				const actualLine = actual.children[g];
				const expectedLine = expected[g];

				it(`is of type HTMLElement`, () => {
					expect(actualLine).toBeInstanceOf(HTMLElement)
				});

				const expectedTag = 'div';
				it(`has tag '${expectedTag}'`, () => {
					expect(actualLine.tagName.toLowerCase()).toBe(expectedTag);
				});

				it(`has 1 class`, () => {
					expect(actual.classList.length).toBe(1);
				});
				
				it(`has class 'line'`, () => {
					expect(actual.classList.contains('line'));
				});
				
				const children = actualLine.children.length > 1 ? 'children' : 'child';
				it(`has ${expectedLine.length} ${children}`, () => {
					expect(actualLine.children.length).toBe(expectedLine.length);
				});

				for (let c = 0; c < expectedLine.length; c++) {
					
					describe(`child ${c}`, () => {
						const actualChild = actualLine.children[c];
						const expectedChild = expectedLine[c];

						it(`is of type HTMLElement`, () => {
							expect(actualChild).toBeInstanceOf(HTMLElement)
						});
						
						const expectedTag = expectedChild.tagName.toLowerCase();
						it(`has tag '${expectedTag}'`, () => {
							expect(actualChild.tagName.toLowerCase()).toBe(expectedTag);
						});

						const expectedNumClasses = expectedChild.classList.length;
						const classes = expectedNumClasses.length > 1 ? 'classes' : 'class';
						it(`has ${expectedNumClasses} ${classes}`, () => {
							expect(actualChild.classList.length).toBe(expectedNumClasses);
						});
					});
				}
			});
		}
	});
});
