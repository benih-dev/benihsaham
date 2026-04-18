import Link from 'next/link'
import { SubstackSubscribeForm } from '@/components/newsletter/substack-subscribe-form'

export const metadata = {
  title: 'Newsletter - BenihSaham',
  description: 'Berlangganan newsletter BenihSaham untuk edukasi value investing IDX yang praktis dan terbukti.',
}

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Public Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">BenihSaham</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-green-600"
              >
                Beranda
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-green-600"
              >
                Masuk
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Value Investing<span className="text-green-600">.</span>
            <br />
            Terbukti, Bukan Teori<span className="text-green-600">.</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Belajar value investing dari portofolio nyata, bukan sekadar teori.
            Dapatkan analisis, watchlist, dan lesson learned langsung ke inbox Anda.
          </p>
        </div>

        {/* Subscribe Form */}
        <div className="mb-16">
          <SubstackSubscribeForm variant="card" className="max-w-md mx-auto" />
        </div>

        {/* What You'll Get */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Apa yang Anda Dapatkan?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analisis Saham</h3>
              <p className="text-sm text-gray-600">
                Analisis mendalam berdasarkan metodologi value investing Teguh Hidayat
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Watchlist</h3>
              <p className="text-sm text-gray-600">
                Daftar saham undervalue yang sedang kami pantau untuk potensi pembelian
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Portfolio Update</h3>
              <p className="text-sm text-gray-600">
                Update transparan mengenai kinerja portofolio riil dan lesson learned
              </p>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="mb-16 bg-white rounded-lg p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Metodologi Kami
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
            Kami menggunakan metodologi value investing dari buku
            <span className="font-semibold"> &ldquo;Value Investing: Beat The Market in Five Minutes!&rdquo; </span>
            karya Teguh Hidayat. Tiga elemen utama yang kami terapkan:
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Harga Murah</h4>
              <p className="text-sm text-gray-600">Saham diperdagangkan di bawah harga wajarnya</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Fundamental Bagus</h4>
              <p className="text-sm text-gray-600">ROE tinggi, profitabilitas konsisten</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Manajemen Terpercaya</h4>
              <p className="text-sm text-gray-600">Track record bersih, tidak bermasalah</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Siap Mulai Investasi dengan Lebih Cerdas?
          </h2>
          <p className="text-gray-600 mb-8">
            Bergabunglah dengan ratusan investor IDX lainnya. Gratis, tanpa spam.
          </p>
          <SubstackSubscribeForm variant="button" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} BenihSaham. Value Investing IDX.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://benihsaham.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-green-600"
              >
                Substack
              </a>
              <a
                href="#"
                className="text-sm text-gray-500 hover:text-green-600"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
