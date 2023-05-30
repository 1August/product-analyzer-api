export function getDigitsFromString (string) {
	return string?.replace(/[^\d]/g, '')
}

export function removeNewLineFromString (string) {
	return string.replace(/\n/g, ' ')
}

export function trimBoth (string) {
	return string.trim().trimEnd()
}
