import {ChunkType} from "./ChunkType";

export class Chunk {
	chunkType: ChunkType;
	content: string;
	content2: string;

	constructor(chunkType: ChunkType, content?: string,  content2?: string) {
		this.chunkType = chunkType;
		this.content = content ? content : '';
		this.content2 = content2 ? content2 : '';
	}
}
