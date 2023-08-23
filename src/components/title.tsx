import DuckPassLogo from "../assets/logo.png";

export function Title() {
    return (
        <div className="max-w-lg mx-auto">
            <div className="flex items-center">
                <img className="max-w-[200px]" src={DuckPassLogo} alt="" />
                <div className="flex flex-start flex-col">
                    <h1 className="text-left text-white text-6xl font-bold">DuckPass</h1>
                    <h2 className="text-left text-white text-2xl">Quack your way into seamless security!</h2>
                </div>
            </div>
        </div>
    )
}