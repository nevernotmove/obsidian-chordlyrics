import {ChunkType} from "./ChunkType";

export class Chunk {
	chunkType: ChunkType;
	content: string | null;
	content2: string | null;

	constructor(chunkType: ChunkType, content?: string,  content2?: string) {
		this.chunkType = chunkType;
		this.content = content ? content : null;
		this.content2 = content2 ? content2 : null;
	}
}
