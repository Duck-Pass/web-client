import Header from '@/components/vault/header'
import { DataTable } from '@/components/ui/data-table'
import { columns } from "@/components/vault/vault-column"
import Footer from '@/components/ui/footer'

// TO DELETE AFTER API IMPLEMENTATION
import mockData from '@/assets/MOCK_DATA.json'
import { useMemo } from 'react'

  
export default function Vault() {
  const data = useMemo(() => mockData, [])
  
  return (
    <>
      <Header />
      <main className="container">
        <DataTable columns={columns} data={data} />
      </main>
      <Footer/>
    </>
  )
}