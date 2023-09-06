import { Opaque } from "type-fest";

/**
 * @description CSPRNG array
 */
type CsprngArray = Opaque<Uint8Array, "CSPRNG">;
/**
 * @description CSPRNG string
 */
type CsprngString = Opaque<string, "CSPRNG">;
