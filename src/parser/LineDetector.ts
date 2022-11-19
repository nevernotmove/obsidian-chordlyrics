import {Line} from "./Line";
import {LineType} from "./LineType";

export class LineDetector {

	// TODO Detect lines for real
	getLines(text: string): Line[] {
		const lines: Line[] = [];

		const textLines: string[] = text.split('\n');

		textLines.forEach(textLine => {
			const line: Line = this.addLineType(textLine);
			lines.push(line);
		})

		return lines;
	}

	private addLineType(line: string): Line {

		// Empty line
		const trimmed = line.trim();
		if (trimmed.length == 0 || trimmed == '\n' || trimmed == '\r\n') return new Line(line, LineType.Empty);

		// Specially escaped line
		if (trimmed.startsWith("[") && trimmed.endsWith("]")) return new Line(trimmed.substring(1, line.length - 1), LineType.Header);
		if (trimmed.endsWith("%c")) return new Line(line.trimEnd().substring(0, line.length - 2), LineType.Chord);
		if (trimmed.endsWith("%t")) return new Line(line.trimEnd().substring(0, line.length - 2), LineType.Text);

		// Chord line
		const numSpaces = line.split(" ").length - 1;
		const spaceToContentRatio = numSpaces / line.length;
		console.log("Content ratio is", spaceToContentRatio, "for", line);
		if (spaceToContentRatio > .4) return new Line(line, LineType.Chord);

		// Text line
		return new Line(line, LineType.Text);
	}
}
