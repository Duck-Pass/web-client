import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative">

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1 className="text-6xl md:text-8xl font-extrabold leading-tighter tracking-tighter mb-4" >Duck<span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Pass</span></h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-3xl text-gray-600 mb-8">Quack your way into seamless security!</p>
              <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div>
                  <Link to="/register" className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0">Start free</Link>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}