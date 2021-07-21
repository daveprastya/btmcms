import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { BtmProvider } from '../src/BtmContext'

function MyApp({ Component, pageProps }: AppProps) {
  return <BtmProvider><Component {...pageProps} /></BtmProvider>
}
export default MyApp
