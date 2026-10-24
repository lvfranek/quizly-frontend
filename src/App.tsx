import styles from './App.module.css'

function App() {
  return (
    <>
      <header className={styles.header}>
        <span className={styles.logo}>
          quizly<em>.</em>
        </span>
      </header>

      <main className={styles.main}>
        <h1>Video rein. Quiz raus.</h1>
        <p className={styles.lead}>Füge einen YouTube-Link ein. Die KI schreibt 10 Fragen.</p>
      </main>

      <footer className={styles.footer}>
        <span>Impressum / Datenschutz</span>
        <span>Entwickelt im Rahmen des Weiterbildungsprogramms der Developer Akademie GmbH.</span>
      </footer>
    </>
  )
}

export default App
