'use client'

import Link from 'next/link'
import { SubstackSubscribeForm } from '@/components/newsletter/substack-subscribe-form'

export function PublicHome() {
  // Public landing page - no auth check needed here (handled in page.tsx)
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">BenihSaham</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link
                href="/newsletter"
                className="text-sm font-medium text-gray-700 hover:text-green-600"
              >
                Newsletter
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                Masuk
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
                Investasi Saham<span className="text-green-600">.</span>
                <br />
                Lebih Cerdas<span className="text-green-600">.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Platform value investing IDX yang terbukti — bukan hanya mengajarkan,
                tapi mempraktikkan. Belajar dari portofolio nyata, bukan sekadar teori.
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/newsletter"
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-green-700 transition-colors w-full sm:w-auto"
                >
                  Berlangganan Newsletter
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors w-full sm:w-auto"
                >
                  Coba Demo
                </Link>
              </div>

              {/* Subscribe Form - Above the Fold */}
              <div className="mt-16 max-w-md mx-auto">
                <SubstackSubscribeForm variant="card" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Mengapa BenihSaham?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Tiga engine yang membantu Anda menjadi investor yang lebih baik
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Portfolio Engine */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg opacity-50" />
                <div className="relative bg-white rounded-lg p-8 shadow-sm border border-gray-100 h-full">
                  <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Portfolio Engine
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Portofolio saham IDX riil yang dikelola dengan metodologi value investing.
                    Transparan, terdokumentasi, dan bisa Anda pelajari.
                  </p>
                  <Link
                    href="/login"
                    className="text-green-600 font-medium hover:text-green-700 inline-flex items-center"
                  >
                    Lihat Portofolio →
                  </Link>
                </div>
              </div>

              {/* Content Engine */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg opacity-50" />
                <div className="relative bg-white rounded-lg p-8 shadow-sm border border-gray-100 h-full">
                  <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Content Engine
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Edukasi value investing yang praktis dan to-the-point. Artikel, video,
                    dan newsletter untuk membantu Anda mengambil keputusan investasi.
                  </p>
                  <Link
                    href="/newsletter"
                    className="text-green-600 font-medium hover:text-green-700 inline-flex items-center"
                  >
                    Baca Artikel →
                  </Link>
                </div>
              </div>

              {/* Tools Engine */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-50 to-transparent rounded-lg opacity-50" />
                <div className="relative bg-white rounded-lg p-8 shadow-sm border border-gray-100 h-full">
                  <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Tools & Tracking
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tools valuasi, watchlist manager, dan portfolio tracker untuk membantu
                    Anda mengelola investasi dengan lebih sistematis.
                  </p>
                  <Link
                    href="/login"
                    className="text-green-600 font-medium hover:text-green-700 inline-flex items-center"
                  >
                    Coba Tools →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="py-20 bg-gradient-to-b from-green-50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Metodologi Value Investing
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Berdasarkan buku <span className="font-semibold">&ldquo;Value Investing: Beat The Market in Five Minutes!&rdquo;</span> karya Teguh Hidayat
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-green-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Tiga Elemen Value Investing
                </h3>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xl">1</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Harga Murah (Undervalue)
                      </h4>
                      <p className="text-gray-600">
                        Saham diperdagangkan di bawah harga wajarnya. Kami menggunakan PBV, ROE,
                        dan Future Value untuk menentukan harga wajar.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xl">2</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Fundamental Bagus
                      </h4>
                      <p className="text-gray-600">
                        ROE tinggi (minimal 15%), profitabilitas konsisten, dan pertumbuhan
                        yang stabil dari waktu ke waktu.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xl">3</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Manajemen Terpercaya
                      </h4>
                      <p className="text-gray-600">
                        Track record manajemen bersih, tidak bermasalah dengan hukum,
                        dan transparan kepada pemegang saham.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
              Mulai Perjalanan Value Investing Anda
            </h2>
            <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
              Bergabunglah dengan ratusan investor IDX lainnya. Gratis, tanpa spam,
              hanya edukasi value investing yang praktis.
            </p>
            <SubstackSubscribeForm variant="button" className="max-w-sm mx-auto" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <span className="text-xl font-bold text-green-600">BenihSaham</span>
              <p className="mt-4 text-sm text-gray-600 max-w-sm">
                Platform value investing IDX yang terbukti — bukan hanya mengajarkan,
                tapi mempraktikkan.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Produk</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <Link href="/newsletter" className="hover:text-green-600">
                    Newsletter
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-green-600">
                    Portfolio Tracker
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-green-600">
                    Watchlist
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Perusahaan</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a
                    href="https://benihsaham.substack.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-600"
                  >
                    Substack
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-600"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-600"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} BenihSaham. Value Investing IDX. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
