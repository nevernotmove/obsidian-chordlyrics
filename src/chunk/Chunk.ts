import {ChunkType} from "./ChunkType";

export class Chunk {
	public readonly chunkType: ChunkType;
	public readonly content: string;
	public readonly content2: string;

	public constructor(chunkType: ChunkType, content?: string, content2?: string) {
		this.chunkType = chunkType;
		this.content = content ? content : '';
		this.content2 = content2 ? content2 : '';
	}
}
