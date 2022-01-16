import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

function Home({ data }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Squawks of the Birds eh!</title>
        <meta name="description" content="A microservices app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to Birdsquawks frontend built with Next.js
        </h1>

        <h5>
          Name: {data.name}, <br />
          Age: {data.age}, <br />
        </h5>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
  const results = await fetch(`http://birdsquawk-service/api/v1/birdsquawk/get`)
  const data = await results.json()

  console.log(`Frontend - index.js - Data Count: ${data.length}`)
  return {
    props: {
      data,
    },
  }
}

export default Home
