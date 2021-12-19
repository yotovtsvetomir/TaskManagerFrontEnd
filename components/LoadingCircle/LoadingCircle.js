import styles from './LoadingCircle.module.scss'

function LoadingCircle({loading}) {

  return (
    <div className={loading ? styles.Intro : styles.Hide}>
        <div className = {styles.Intro_inner}>
          <div className={styles.Loader}><div></div><div></div><div></div><div></div></div>
        </div>
    </div>
  );
}
export default LoadingCircle;
