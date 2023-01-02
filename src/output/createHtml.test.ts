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
const chordText = new Chunk(ChunkType.ChordWithText, 'chord', 'text');

const emptyDiv = {tagName: 'div', content: '', classList: ['chordlyrics-word']};
const headerDiv = {tagName: 'div', content: 'header', classList: ['chordlyrics-header']};
const chordDiv = {tagName: 'div', content: 'chord', classList: ['chordlyrics-chord', 'cm-strong']};
const wordDiv = {tagName: 'div', content: 'word', classList: ['chordlyrics-word']};
const chordTextDiv = {tagName: 'div', content: undefined, classList: ['chordlyrics-stack']};

describe('createHtml', () => {

    describe.each`
        id    | input                                               | expected
        ${1}  | ${[[empty]]}                                        | ${[[emptyDiv]]}
        ${2}  | ${[[header]]}                                       | ${[[headerDiv]]}
        ${3}  | ${[[chord]]}                                        | ${[[chordDiv]]}
        ${4}  | ${[[word]]}                                         | ${[[wordDiv]]}
        ${5}  | ${[[chordText]]}                                    | ${[[chordTextDiv]]}
        ${6}  | ${[[chord, chord]]}                                 | ${[[chordDiv, chordDiv]]}
        ${7}  | ${[[word, word]]}                                   | ${[[wordDiv, wordDiv]]}
        ${8}  | ${[[chordText, chordText]]}                         | ${[[chordTextDiv, chordTextDiv]]}
        ${9}  | ${[[empty], [empty]]}                               | ${[[emptyDiv], [emptyDiv]]}
        ${10} | ${[[word], [word]]}                                 | ${[[wordDiv], [wordDiv]]}
        ${11} | ${[[header], [header]]}                             | ${[[headerDiv], [headerDiv]]}
        ${12} | ${[[chord], [chord]]}                               | ${[[chordDiv], [chordDiv]]}
        ${13} | ${[[chordText], [chordText]]}                       | ${[[chordTextDiv], [chordTextDiv]]}
        ${14} | ${[[word, word], [chordText]]}                      | ${[[wordDiv, wordDiv], [chordTextDiv]]}
        ${15} | ${[[word, word, word], [chordText, chordText]]}     | ${[[wordDiv, wordDiv, wordDiv], [chordTextDiv, chordTextDiv]]}
        ${16} | ${[[chord, chord, chord], [empty], [header]]}       | ${[[chordDiv, chordDiv, chordDiv], [emptyDiv], [headerDiv]]}
        ${17} | ${[[chord, chord], [empty], [header], [chordText]]} | ${[[chordDiv, chordDiv], [emptyDiv], [headerDiv], [chordTextDiv]]}
    `('for test $id', ({_, input, expected}) => {

        const actual: HTMLElement = createHtml(input);

        describe('returns root element', () => {

            it(`of type HTMLElement`, () => {
                expect(actual).toBeInstanceOf(HTMLElement);
            });

            it(`with tag 'pre'`, () => {
                expect(actual.tagName.toLowerCase()).toEqual('pre');
            });

            it(`has 1 class`, () => {
                expect(actual.classList.length).toBe(1);
            });

            it(`has class 'chordlyrics-root'`, () => {
                expect(actual.classList.contains('chordlyrics-root')).toBeTruthy();
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
                    expect(actualLine).toBeInstanceOf(HTMLElement);
                });

                const expectedTag = 'div';
                it(`has tag '${expectedTag}'`, () => {
                    expect(actualLine.tagName.toLowerCase()).toBe(expectedTag);
                });

                it(`has 1 class`, () => {
                    expect(actual.classList.length).toBe(1);
                });

                it(`has class 'chordlyrics-line'`, () => {
                    expect(actualLine.classList.contains('chordlyrics-line')).toBeTruthy();
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
                            expect(actualChild).toBeInstanceOf(HTMLElement);
                        });

                        const expectedTag = expectedChild.tagName.toLowerCase();
                        it(`has tag '${expectedTag}'`, () => {
                            expect(actualChild.tagName.toLowerCase()).toBe(expectedTag);
                        });

                        const expectedNumClasses = expectedChild.classList.length;
                        const classes = expectedNumClasses > 1 ? 'classes' : 'class';
                        it(`has ${expectedNumClasses} ${classes}`, () => {
                            expect(actualChild.classList.length).toBe(expectedNumClasses);
                        });

                        for (const cl of expectedChild.classList) {
                            it(`has class '${cl}'`, () => {
                                expect(actualChild.classList.contains(cl)).toBeTruthy();
                            });
                        }

                        if (actualChild.classList.contains('chordlyrics-stack')) {
                            it(`has 2 children`, () => {
                                expect(actualChild.children.length).toBe(2);
                            });

                            it(`child 1 is of type HTMLElement`, () => {
                                expect(actualChild.children[0]).toBeInstanceOf(HTMLElement);
                            });

                            it(`child 2 is of type HTMLElement`, () => {
                                expect(actualChild.children[1]).toBeInstanceOf(HTMLElement);
                            });

                            it(`child 1 has tag 'div'`, () => {
                                expect(actualChild.children[0].tagName.toLowerCase()).toBe('div');
                            });

                            it(`child 2 has tag 'div'`, () => {
                                expect(actualChild.children[1].tagName.toLowerCase()).toBe('div');
                            });

                            it(`child 1 has 2 classes`, () => {
                                expect(actualChild.children[0].classList.length).toBe(2);
                            });

                            it(`child 2 has 1 class`, () => {
                                expect(actualChild.children[1].classList.length).toBe(1);
                            });

                            it(`child 1 has class 'chordlyrics-chord'`, () => {
                                expect(actualChild.children[0].classList.contains('chordlyrics-chord')).toBeTruthy();
                            });

                            it(`child 1 has class 'cm-strong'`, () => {
                                expect(actualChild.children[0].classList.contains('cm-strong')).toBeTruthy();
                            });

                            it(`child 2 has class 'chordlyrics-word'`, () => {
                                expect(actualChild.children[1].classList.contains('chordlyrics-word')).toBeTruthy();
                            });

                            it(`child 1 has content ${chordText.content}`, () => {
                                expect(actualChild.children[0].textContent).toBe(chordText.content);
                            });

                            it(`child 2 has content ${chordText.content2}`, () => {
                                expect(actualChild.children[1].textContent).toBe(chordText.content2);
                            });
                        } else {
                            it(`has content '${expectedChild.content}'`, () => {
                                expect(actualChild.textContent).toBe(expectedChild.content);
                            });
                        }
                    });
                }
            });
        }
    });
});
