interface Address {
  city: string
  country: string
  neighborhood: string
  number: string
  postalCode: string
  reference: string
  street: string
  state: string
}

interface Marketing {
  instagram: string
  facebook: string
  whatsapp: string
  gtmId: string
}

export interface Affiliate {
  id: string
  affiliateId: string
  name: string
  slug: string
  storeName: string
  email: string
  phone: string
  refId: string
  isApproved: boolean
  address: Address
  document: string
  documentType: string
  marketing: Marketing
}
