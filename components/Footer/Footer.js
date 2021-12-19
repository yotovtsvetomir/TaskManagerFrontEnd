import styles from './Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.Footer}>
        <div className="Shell">
          <div className={styles.Footer_inner}>
            <p>Task Manager App © all rights reserved</p>
          </div>
        </div>
    </footer>
  )
}
