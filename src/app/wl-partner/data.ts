export interface PartnerData {
    id: string
    businessName: string
    wlManager: string
    registrationDate: string
    onboardingDate: string
    countryCity: string
    marketType: string
    status: "In-progress" | "Approved"
    progress: number
    email: string
    phone: string
    country: string
    state: string
    city: string
    zipCode: string
    marketDescription: string
}

export const mockPartners: PartnerData[] = [
    {
        id: "1",
        businessName: "Blue Moon PVT.LTD",
        wlManager: "Tom Shelby",
        registrationDate: "15 Jan, 2026",
        onboardingDate: "17 Dec, 2025",
        countryCity: "US/Los Angeles",
        marketType: "USA",
        status: "In-progress",
        progress: 10,
        email: "contact@bluemoon.com",
        phone: "+1 234 567 8900",
        country: "United States",
        state: "California",
        city: "Los Angeles",
        zipCode: "90001",
        marketDescription: "For White Labels operating exclusively in the United States and subject to US regulatory requirements."
    },
    {
        id: "2",
        businessName: "Red Sun Enterprises",
        wlManager: "Ada Wong",
        registrationDate: "20 Feb, 2026",
        onboardingDate: "19 Jan, 2026",
        countryCity: "US/New York",
        marketType: "Global + USA",
        status: "In-progress",
        progress: 100,
        email: "info@redsun.com",
        phone: "+1 987 654 3210",
        country: "United States",
        state: "New York",
        city: "New York",
        zipCode: "10001",
        marketDescription: "Global operations including specific US market access and compliance."
    },
    {
        id: "3",
        businessName: "Green Leaf Co.",
        wlManager: "Michael Smith",
        registrationDate: "10 Mar, 2026",
        onboardingDate: "05 Feb, 2026",
        countryCity: "US/San Francisco",
        marketType: "USA",
        status: "In-progress",
        progress: 0,
        email: "support@greenleaf.io",
        phone: "+1 555 012 3456",
        country: "United States",
        state: "California",
        city: "San Francisco",
        zipCode: "94105",
        marketDescription: "Eco-friendly market initiatives focused on US regional growth."
    },
    {
        id: "4",
        businessName: "Yellow Star Solutions",
        wlManager: "Lisa Johnson",
        registrationDate: "18 Apr, 2026",
        onboardingDate: "12 Mar, 2026",
        countryCity: "US/Chicago",
        marketType: "Global",
        status: "In-progress",
        progress: 45,
        email: "hello@yellowstar.com",
        phone: "+1 312 555 6789",
        country: "United States",
        state: "Illinois",
        city: "Chicago",
        zipCode: "60601",
        marketDescription: "Logistics and tech solutions for global white label integration."
    },
    {
        id: "5",
        businessName: "Purple Cloud Inc.",
        wlManager: "Ethan Hunt",
        registrationDate: "25 May, 2026",
        onboardingDate: "15 Apr, 2026",
        countryCity: "US/Seattle",
        marketType: "Global + USA",
        status: "Approved",
        progress: 100,
        email: "ops@purplecloud.net",
        phone: "+1 206 555 0199",
        country: "United States",
        state: "Washington",
        city: "Seattle",
        zipCode: "98101",
        marketDescription: "Cloud-based financial services for multi-region operations."
    },
    {
        id: "6",
        businessName: "Orange Tree Ltd.",
        wlManager: "Sarah Connor",
        registrationDate: "30 Jun, 2026",
        onboardingDate: "20 May, 2026",
        countryCity: "US/Houston",
        marketType: "USA",
        status: "Approved",
        progress: 100,
        email: "growth@orangetree.com",
        phone: "+1 713 555 0123",
        country: "United States",
        state: "Texas",
        city: "Houston",
        zipCode: "77002",
        marketDescription: "Expanding US presence with specialized market focus."
    },
    {
        id: "7",
        businessName: "Black Stone Group",
        wlManager: "Jack Ryan",
        registrationDate: "15 Jul, 2026",
        onboardingDate: "10 Jun, 2026",
        countryCity: "US/Denver",
        marketType: "USA",
        status: "Approved",
        progress: 100,
        email: "contact@blackstone.group",
        phone: "+1 303 555 0144",
        country: "United States",
        state: "Colorado",
        city: "Denver",
        zipCode: "80202",
        marketDescription: "Asset management and consultancy for US-based partners."
    },
    {
        id: "8",
        businessName: "Silver Arrow Holdings",
        wlManager: "Emily Blunt",
        registrationDate: "12 Aug, 2026",
        onboardingDate: "01 Jul, 2026",
        countryCity: "US/Atlanta",
        marketType: "Global",
        status: "Approved",
        progress: 100,
        email: "admin@silverarrow.com",
        phone: "+1 404 555 0155",
        country: "United States",
        state: "Georgia",
        city: "Atlanta",
        zipCode: "30303",
        marketDescription: "Strategic holdings and market expansion for global entities."
    }
]
