import {Line} from "../line/Line";
import {LineType} from "../line/LineType";
import {ChunkDetector} from "./ChunkDetector";
import {ChunkType} from "./ChunkType";

describe('Chunk detector', () => {
	// TODO Add test for null or getting nothing back
	// TODO Simplyfy tests by parameterizing them
	describe('for a single empty line', () => {
		const lines: Line[] = [
			new Line("", LineType.Empty)
		]
		const chunks = new ChunkDetector().getChunks(lines);

		it('creates a single chunk group', () => {
			expect(chunks.length).toBe(1);
		});

		it('creates a single chunk in group', () => {
			expect(chunks[0].length).toBe(1);
		});

		it('creates chunk with type Empty', () => {
			expect(chunks[0][0].chunkType).toBe(ChunkType.Empty);
		});
		
		it('creates chunk with content set to null', () => {
			expect(chunks[0][0].content).toBeNull();
		});
	});

	describe('for a single line with one chord', () => {
		const lines: Line[] = [
			new Line("C", LineType.Chord)
		]
		const chunks = new ChunkDetector().getChunks(lines);

		it('creates a single chunk group', () => {
			expect(chunks.length).toBe(1);
		});

		it('creates a single chunk in group', () => {
			expect(chunks[0].length).toBe(1);
		});

		it('creates chunk with type Chord', () => {
			expect(chunks[0][0].chunkType).toBe(ChunkType.Chord);
		});
		
		it('creates chunk with content set to chord', () => {
			expect(chunks[0][0].content).toBe("C");
		});
	});

	describe('for a single line with one word', () => {
		const lines: Line[] = [
			new Line("Hello", LineType.Text)
		]
		const chunks = new ChunkDetector().getChunks(lines);

		it('creates a single chunk group', () => {
			expect(chunks.length).toBe(1);
		});

		it('creates a single chunk in group', () => {
			expect(chunks[0].length).toBe(1);
		});

		it('creates chunk with type Word', () => {
			expect(chunks[0][0].chunkType).toBe(ChunkType.Word);
		});

		it('creates chunk with content set to word', () => {
			expect(chunks[0][0].content).toBe("Hello");
		});
	});
});
