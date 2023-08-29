import Header from '@/components/vault/header'
import Footer from '@/components/ui/footer'
import ProfileTabs from '@/components/profile/profile-tabs'
import Enable2FAModal from '@/components/profile/enable-2fa-modal'

export default function Profile() {
  return (
    <>
      <Header />
      <main className="container p-0 flex flex-col align-center justify-center space-y-4 w-[400px] mb-4">
        <Enable2FAModal />
        <ProfileTabs />
      </main>
      <Footer/>
    </>
  )
}