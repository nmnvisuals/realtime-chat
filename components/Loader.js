import styles from './Loader.module.css'

function Loader(props){

    return(<>
{props.loader ? <div className={styles.loader}><span className={styles.p1} style={{borderColor:"var(--brand-col1)"}}></span><span className={styles.p2}></span></div>:''}
</>
)


}

export default Loader;