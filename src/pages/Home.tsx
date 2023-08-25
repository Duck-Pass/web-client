import Hero from '@/components/hero'
import Header from '@/components/ui/header'
import FeaturesBlocks from '@/components/features-blocks'
import Features from '@/components/features'
import Footer from '@/components/ui/footer'

export default function Home() {
    // document.body.style.backgroundColor = "#022837";
  
    return (
      <>
      <Header />
      <main className='grow'>
        <Hero/>
        <Features/>
        <FeaturesBlocks />
      </main>
      <Footer/>
        {/* <MainNavBar/>
        <Title/>
        <div className='mx-auto flex flex-col max-w-2xl'>
          <h2 className='text-white text-2xl font-bold'>About us</h2>
          <p className='text-white text-justify py-1'>Your Quacktastic Key to Rock-Solid Online Security! DuckPass revolutionizes your online security experience by effortlessly managing your passwords and safeguarding your digital life. Say goodbye to weak and easily cracked passwords – with DuckPass, you're in control.</p>
          <p className='text-white text-justify py-1'>Secure and Simplified: DuckPass ensures your passwords are unbreakable while providing a seamless user experience. No more struggling to remember multiple passwords or using weak ones.</p>
          <p className='text-white text-justify py-1'>Quack Your Way to Safety: Just like a duck's watertight feathers, DuckPass creates a protective shield around your accounts. Trust in our advanced encryption to keep your data safe.</p>
          <p className='text-white text-justify py-1'>Stay Ahead of Breaches: Stay informed about potential vulnerabilities with DuckPass. We regularly monitor new breaches to check if your informations could be in it.</p>
        </div>
  
        <div className='mx-auto flex flex-col max-w-2xl'>
          <h2 className='text-white text-2xl font-bold'>Features</h2>
          <p className='text-white text-justify py-1'>Password manager : manage and secure your passwords all in one place. Simply store your passwords in DuckPass and access them whenever you need, from any device.</p>
          <p className='text-white text-justify py-1'>2FA manager : Easily organize and control your two-factor authentication methods. Use it as an authentication app to generate the time based codes.</p>
          <p className='text-white text-justify py-1'>Password generator : Create strong and complex passwords to meet specific requirements and keep your accounts safe from bruteforce.</p>
          <p className='text-white text-justify py-1'>Secure notes : Keep your sensitive information locked down with DuckPass's secure notes feature. Safely store important details, private notes, and confidential data within DuckPass's encrypted storage.</p>
        </div>
  
        <div className='text-white mx-auto flex flex-col max-w-2xl'>
          <h2 className='text-2xl font-bold'>The Team</h2>
          <p className='text-justify py-1'>We're a group of four students studying security engineering at HEIG, located in Yverdon-les-Bains. Our motivation? Applying the concepts we've learned in class and implementing them in a type of application used by numerous users. We also wanted to see behind the scenes and understand the challenges of developing a secure program.</p>
        </div>

        <div className='flex justify-center py-8'>
          <div className="flex flex-col">
            <Avatar className='w-24 h-24 mx-8'>
              <AvatarImage src="" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <span className='text-white py-2'>Annen Rayane</span>
          </div>
          <div className="flex flex-col">
            <Avatar className='w-24 h-24 mx-8'>
              <AvatarImage src="" />
              <AvatarFallback>DH</AvatarFallback>
            </Avatar>
            <span className='text-white py-2'>Ducommun Hugo</span>
          </div>
          <div className="flex flex-col">
            <Avatar className='w-24 h-24 mx-8'>
              <AvatarImage src="" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
            <span className='text-white py-2'>Martins Alexis</span>
          </div>
          <div className="flex flex-col">
            <Avatar className='w-24 h-24 mx-8'>
              <AvatarImage src="" />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <span className='text-white py-2'>Saez Pablo</span>
          </div>
        </div> */}
      </>
    )
}