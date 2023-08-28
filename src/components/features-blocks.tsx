import Duck1 from '../assets/pablo.jpg';
import Duck2 from '../assets/alexis.png';
import Duck3 from '../assets/hugo.jpg';
import Duck4 from '../assets/rayane.jpg';
import { Github, Linkedin } from 'lucide-react'

export default function FeaturesBlocks() {
    return (
      <section className="relative">
  
        {/* Section background (needs .relative class on parent and next sibling elements) */}
        <div className="absolute inset-0 top-1/2 md:mt-24 lg:mt-0 bg-gray-900 pointer-events-none" aria-hidden="true"></div>
        <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>
  
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-12 md:py-20">
  
            {/* Section header */}
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
              <h2 className="h2 mb-4">The Ducks</h2>
              <p className="text-xl text-gray-600"></p>
            </div>
  
            {/* Items */}
            <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-4 items-start md:max-w-2xl lg:max-w-none">
  
              {/* 1st item */}
              <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
                <img className="w-32 h-32 p-1 -mt-1 mb-2 rounded-full" src={Duck1} alt="" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Pablo Saez</h4>
                <p className="text-gray-600 text-center">Backend Developer</p>
                <div className="flex flex-row w-full justify-center items-center mt-2 space-x-2">
                  <a href="https://github.com/PabSaez" target="_blank" className="text-black hover:text-gray-400"><Github /></a>
                </div>
              </div>
  
              {/* 2nd item */}
              <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
                <img className="w-32 h-32 p-1 -mt-1 mb-2 rounded-full" src={Duck2} alt="" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Alexis Martins</h4>
                <p className="text-gray-600 text-center">Backend Developer</p>
                <div className="flex flex-row w-full justify-center items-center mt-2 space-x-2">
                  <a href="https://github.com/AlexisMts" target="_blank" className="text-black hover:text-gray-400"><Github /></a>
                </div>
              </div>
  
              {/* 3rd item */}
              <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
                <img className="w-32 h-32 p-1 -mt-1 mb-2 rounded-full" src={Duck3} alt="" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Hugo Ducommun</h4>
                <p className="text-gray-600 text-center">Frontend Developer</p>
                <div className="flex flex-row w-full justify-center items-center mt-2 space-x-2">
                  <a href="https://github.com/hugoducom" target="_blank" className="text-black hover:text-gray-400"><Github /></a>
                  <a href="https://www.linkedin.com/in/hugo-ducommun-9504241aa/" target="_blank" className="text-black hover:text-gray-400"><Linkedin /></a>
                </div>
              </div>
  
              {/* 4th item */}
              <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
                <img className="w-32 h-32 p-1 -mt-1 mb-2 rounded-full" src={Duck4} alt="" />
                <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">Rayane Annen</h4>
                <p className="text-gray-600 text-center flex flex-row">
                  Frontend Developer
                </p>
                <div className="flex flex-row w-full justify-center items-center mt-2 space-x-2">
                  <a href="https://github.com/azzen" target="_blank" className="text-black hover:text-gray-400"><Github /></a>
                  <a href="https://www.linkedin.com/in/rayane-annen/" target="_blank" className="text-black hover:text-gray-400"><Linkedin /></a>
                </div>
              </div>
            </div>
  
          </div>
        </div>
      </section>
    )
  }