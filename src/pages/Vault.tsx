import Header from '@/components/vault/header'
import { VaultDataTable } from '@/components/vault/vault-data-table'
import { columns } from "@/components/vault/vault-column"
import Footer from '@/components/ui/footer'
import { Separator } from "@/components/ui/separator"

// TO DELETE AFTER API IMPLEMENTATION
import mockData from '@/assets/MOCK_DATA.json'
import { useMemo } from 'react'

  
export default function Vault() {
  const data = useMemo(() => mockData, [])
  
  return (
    <>
      <Header />
      <main className="container">
        <div className="mb-4">
          <p className="text-2xl font-semibold leading-none tracking-tight mb-1">My vault</p>
          <p className="text-sm text-muted-foreground mb-2">Your personal vault is entierely encrypted. You are the only one able to access to it.</p>
          <Separator />
        </div>
        <VaultDataTable columns={columns} data={data} />
      </main>
      <Footer/>
    </>
  )
}