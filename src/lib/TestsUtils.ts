export function makeByteArray(length: number, start = 0): Uint8Array {
	const arr = new Uint8Array(length);
	for (let i = 0; i < length; i++) {
		arr[i] = start + i;
	}
	return arr;
}
