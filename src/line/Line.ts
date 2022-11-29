import {LineType} from "./LineType";

export class Line {
	public readonly content: string;
	public readonly lineType: LineType;
	
	public constructor(content: string, lineType: LineType) {
		this.content = content;
		this.lineType = lineType;
	}
}
