import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout/Layout'
import styles from '../styles/Home.module.scss'
import intro from '../public/intro.gif'
import Link from 'next/link'

export default function Home() {

  return (
      <Layout>
        <Head>
          <title>Task Manager App</title>
          <meta name="description" content="Created by Tsvetomir Yotov" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className={styles.Home}>
          <div className='Shell'>
            <div className={styles.Intro}>
              <div className={styles.Intro_image}>
                <Image src={intro} layout='fill' />
              </div>

              <div className={styles.Intro_content}>
                <h1>Welcome to the best Task Manager App</h1>

                <div className={styles.Intro_actions}>
                  <Link href="/login">
                    <a>Login</a>
                  </Link>
                  <Link href="/register">
                    <a>Register</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
  )
}
