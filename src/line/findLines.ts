import {Line} from "./Line";
import {LineType} from "./LineType";

export default function findLines(text: string): Line[] {
	return text.split('\n').map(line => getTypedLine(line));
}

function getTypedLine(line: string): Line {

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
	if (spaceToContentRatio > .3) return new Line(line, LineType.Chord);

	// Text line
	return new Line(line, LineType.Text);
}
