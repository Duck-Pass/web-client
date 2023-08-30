import { useState } from "react"
import copy from "copy-to-clipboard"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Copy } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

import PasswordStrengthMeter from "@/components/vault/password-strength-meter"

export default function PasswordGenerator() {
    const [passLength, setPassLength] = useState<number>(18)
    const [includeUppercase, setIncludeUppercase] = useState<boolean>(true)
    const [includeNumber, setIncludeNumber] = useState<boolean>(true)
    const [includeSymbol, setIncludeSymbol] = useState<boolean>(true)

    const [password, setPassword] = useState(() => generatePassword())

    function generatePassword(
        characterAmount = passLength,
        includeUpper = includeUppercase,
        includeNumbers = includeNumber,
        includeSymbols = includeSymbol
    ) {
        const UPPERCASE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const LOWERCASE_CHAR = "abcdefghijklmnopqrstuvwxyz"
        const NUMBER_CHAR = "1234567890"
        const SYMBOL_CHAR = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

        let combinedCharacters = LOWERCASE_CHAR

        if (includeUpper) combinedCharacters += UPPERCASE_CHAR
        if (includeNumbers) combinedCharacters += NUMBER_CHAR
        if (includeSymbols) combinedCharacters += SYMBOL_CHAR

        let password = ""
        for (let i = 0; i < characterAmount; i++) {
            password += combinedCharacters.charAt(Math.floor(Math.random() * combinedCharacters.length))
        }

        return password
    }

    return (
        <div>
            <div className="max-w-md rounded-lg text-center transition-all">

                <div className="mb-2 flex h-10 items-center space-x-2">
                    <Input disabled value={password} id="password" autoComplete="current-password" className="break-all" />
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button type="button" onClick={() => copy(password)}>
                            <Copy />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">Copied!</PopoverContent>
                    </Popover>
                </div>

                {/* Password Strength Meter */}
                <PasswordStrengthMeter password={password} />

                <div className="grid grid-cols-2 gap-2 mt-4 items-center">
                    <Label htmlFor="password-length" className="text-left text-md font-semibold">
                        Length
                    </Label>
                    
                    <Input
                        type="number"
                        min={5}
                        max={128}
                        className="p-2 w-auto"
                        id="password-length"
                        value={passLength}
                        onChange={(event) => setPassLength(event.target.value === "" ? 0 : parseInt(event.target.value))}
                    />

                    <Slider
                        value={[passLength]}
                        min={5}
                        max={128}
                        step={1}
                        className="col-span-2 py-2"
                        onValueChange={(val) => { setPassLength(val[0])}}
                    />

                    <Label htmlFor="include-uppercase" className="text-left text-md font-semibold">
                        Uppercase
                    </Label>
                    <div className="flex justify-start">
                        <Checkbox
                            id="include-uppercase"
                            defaultChecked={includeUppercase}
                            onCheckedChange={() => setIncludeUppercase(!includeUppercase)}
                        />
                    </div>

                    <Label htmlFor="include-number" className="text-left text-md font-semibold">
                        Number
                    </Label>
                    <div className="flex justify-start">
                        <Checkbox
                            id="include-number"
                            defaultChecked={includeNumber}
                            onCheckedChange={() => setIncludeNumber(!includeNumber)}
                        />
                    </div>

                    <Label htmlFor="include-symbol" className="text-left text-md font-semibold">
                        Symbols
                    </Label>
                    <div className="flex justify-start">
                        <Checkbox
                            id="include-symbol"
                            defaultChecked={includeSymbol}
                            onCheckedChange={() => setIncludeSymbol(!includeSymbol)}
                        />
                    </div>
                </div>
                <Button className="w-full mt-2" onClick={() => setPassword(generatePassword(passLength, includeUppercase, includeNumber, includeSymbol))}>
                    Generate
                </Button>
            </div>
        </div>
    )
}