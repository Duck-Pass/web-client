import { EncryptedString, EncString } from "../../lib/models/encrypted-string";

describe('EncryptedString', () => {
    describe('AesCbc256', () => {
        it('constructor', () => {
            const s = new EncryptedString("data", "iv")
            expect(s).toEqual({
                data: "data",
                encryptedString: "iv|data",
                iv: "iv",
            });
        });
    });

    describe('parse correctly encrypted string', () => {
        it("valid", () => {
            const s = new EncryptedString("iv|data" as EncString)
            expect(s).toEqual({
                data: "data",
                encryptedString: "iv|data",
                iv: "iv",
            });
        });
    });

    describe("AesCbc256HmacSha256", () => {
        it("constructor", () => {
            const s = new EncryptedString("data", "iv", "mac")
            expect(s).toEqual({
                data: "data",
                encryptedString: "iv|data|mac",
                iv: "iv",
                mac: "mac",
            });
        });

        describe("parse correctly encrypted string", () => {
            it("valid", () => {
                const s = new EncryptedString("iv|data|mac" as EncString)
                expect(s).toEqual({
                    data: "data",
                    encryptedString: "iv|data|mac",
                    iv: "iv",
                    mac: "mac",
                });
            });
        });

        describe("toJSON", () => {
            it("should be the encrypted string", () => {
                const s = new EncryptedString("data", "iv", "mac")
                expect(s.toJSON()).toBe(s.encryptedString);
            })
        })
    })

})