'use client'

export function SchemaMarkup() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'EPath Education',
    description: 'EPath Education cung cấp lộ trình học thuật quốc tế xuyên suốt từ Tiểu học đến Trung học Phổ thông. Blended Learning với Edmentum International (Cognia & WASC).',
    url: 'https://www.epath.edu.vn',
    logo: 'https://www.epath.edu.vn/epath_logo.png',
    image: 'https://www.epath.edu.vn/epath_logo.png',
    foundingDate: '2020',
    areaServed: {
      '@type': 'State',
      name: 'Bình Dương',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Nguyễn Trãi, Q1',
      addressLocality: 'TP. Hồ Chí Minh',
      addressRegion: 'TP.HCM',
      postalCode: '70000',
      addressCountry: 'VN',
    },
    telephone: '+84-912-345-678',
    email: 'contact@epath.edu.vn',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Admissions',
      telephone: '+84-912-345-678',
      email: 'contact@epath.edu.vn',
      availableLanguage: ['Vietnamese', 'English'],
    },
    sameAs: [
      'https://www.facebook.com/epatheducation',
      'https://www.youtube.com/@epatheducation',
    ],
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Accreditation',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Cognia',
        },
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Accreditation',
        recognizedBy: {
          '@type': 'Organization',
          name: 'WASC',
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
