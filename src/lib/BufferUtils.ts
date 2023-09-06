/**
 * @description this class contains utility methods for buffers
 */
export class BufferUtils {
	/**
	 * @description convert a base64 string to Uint8Array
	 * @param s base64 string to convert to Uint8Array
	 * @returns base64 string converted to Uint8Array
	 */
	static fromBase64ToByteArray(s: string): Uint8Array {
		const binary = window.atob(s);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes;
	}
	/**
	 * @description convert an array buffer to base64
	 * @param buffer array buffer to convert to base64
	 * @returns array buffer converted to base64
	 */
	static fromBufferToBase64(buffer: ArrayBuffer): string {
		let binary = "";
		const bytes = new Uint8Array(buffer);
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}
}
