export interface CountryInfo {
  code: string
  name: string
  nationality: string
  phoneCode: string
}

export const countries: CountryInfo[] = [
  { code: "AF", name: "Afghanistan", nationality: "Afghan", phoneCode: "+93" },
  { code: "AL", name: "Albania", nationality: "Albanian", phoneCode: "+355" },
  { code: "DZ", name: "Algeria", nationality: "Algerian", phoneCode: "+213" },
  { code: "AR", name: "Argentina", nationality: "Argentine", phoneCode: "+54" },
  { code: "AU", name: "Australia", nationality: "Australian", phoneCode: "+61" },
  { code: "AT", name: "Austria", nationality: "Austrian", phoneCode: "+43" },
  { code: "BD", name: "Bangladesh", nationality: "Bangladeshi", phoneCode: "+880" },
  { code: "BE", name: "Belgium", nationality: "Belgian", phoneCode: "+32" },
  { code: "BR", name: "Brazil", nationality: "Brazilian", phoneCode: "+55" },
  { code: "CA", name: "Canada", nationality: "Canadian", phoneCode: "+1" },
  { code: "CN", name: "China", nationality: "Chinese", phoneCode: "+86" },
  { code: "CO", name: "Colombia", nationality: "Colombian", phoneCode: "+57" },
  { code: "DK", name: "Denmark", nationality: "Danish", phoneCode: "+45" },
  { code: "EG", name: "Egypt", nationality: "Egyptian", phoneCode: "+20" },
  { code: "FI", name: "Finland", nationality: "Finnish", phoneCode: "+358" },
  { code: "FR", name: "France", nationality: "French", phoneCode: "+33" },
  { code: "DE", name: "Germany", nationality: "German", phoneCode: "+49" },
  { code: "GH", name: "Ghana", nationality: "Ghanaian", phoneCode: "+233" },
  { code: "GR", name: "Greece", nationality: "Greek", phoneCode: "+30" },
  { code: "IN", name: "India", nationality: "Indian", phoneCode: "+91" },
  { code: "ID", name: "Indonesia", nationality: "Indonesian", phoneCode: "+62" },
  { code: "IE", name: "Ireland", nationality: "Irish", phoneCode: "+353" },
  { code: "IT", name: "Italy", nationality: "Italian", phoneCode: "+39" },
  { code: "JP", name: "Japan", nationality: "Japanese", phoneCode: "+81" },
  { code: "KE", name: "Kenya", nationality: "Kenyan", phoneCode: "+254" },
  { code: "MY", name: "Malaysia", nationality: "Malaysian", phoneCode: "+60" },
  { code: "MX", name: "Mexico", nationality: "Mexican", phoneCode: "+52" },
  { code: "NL", name: "Netherlands", nationality: "Dutch", phoneCode: "+31" },
  { code: "NZ", name: "New Zealand", nationality: "New Zealander", phoneCode: "+64" },
  { code: "NG", name: "Nigeria", nationality: "Nigerian", phoneCode: "+234" },
  { code: "NO", name: "Norway", nationality: "Norwegian", phoneCode: "+47" },
  { code: "PK", name: "Pakistan", nationality: "Pakistani", phoneCode: "+92" },
  { code: "PH", name: "Philippines", nationality: "Filipino", phoneCode: "+63" },
  { code: "PL", name: "Poland", nationality: "Polish", phoneCode: "+48" },
  { code: "PT", name: "Portugal", nationality: "Portuguese", phoneCode: "+351" },
  { code: "RU", name: "Russia", nationality: "Russian", phoneCode: "+7" },
  { code: "SA", name: "Saudi Arabia", nationality: "Saudi", phoneCode: "+966" },
  { code: "SG", name: "Singapore", nationality: "Singaporean", phoneCode: "+65" },
  { code: "ZA", name: "South Africa", nationality: "South African", phoneCode: "+27" },
  { code: "KR", name: "South Korea", nationality: "South Korean", phoneCode: "+82" },
  { code: "ES", name: "Spain", nationality: "Spanish", phoneCode: "+34" },
  { code: "SE", name: "Sweden", nationality: "Swedish", phoneCode: "+46" },
  { code: "CH", name: "Switzerland", nationality: "Swiss", phoneCode: "+41" },
  { code: "TH", name: "Thailand", nationality: "Thai", phoneCode: "+66" },
  { code: "TR", name: "Turkey", nationality: "Turkish", phoneCode: "+90" },
  { code: "AE", name: "United Arab Emirates", nationality: "Emirati", phoneCode: "+971" },
  { code: "GB", name: "United Kingdom", nationality: "British", phoneCode: "+44" },
  { code: "US", name: "United States", nationality: "American", phoneCode: "+1" },
  { code: "VN", name: "Vietnam", nationality: "Vietnamese", phoneCode: "+84" },
].sort((a, b) => a.name.localeCompare(b.name))

export const nationalityOptions = countries.map(c => ({
  value: c.code,
  label: c.nationality,
}))

export const countryOptions = countries.map(c => ({
  value: c.code,
  label: c.name,
}))

export function getNationalityName(code: string): string {
  const country = countries.find(c => c.code === code)
  return country?.nationality || code
}
