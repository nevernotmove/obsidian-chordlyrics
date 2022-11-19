import {LineType} from "./LineType";

export class Line {
	content: string;
	lineType: LineType;
	
	constructor(content: string, lineType: LineType) {
		this.content = content;
		this.lineType = lineType;
	}
}
