import { Opaque } from 'type-fest'

type CsprngArray = Opaque<Uint8Array, 'CSPRNG'>
type CsprngString = Opaque<string, 'CSPRNG'>