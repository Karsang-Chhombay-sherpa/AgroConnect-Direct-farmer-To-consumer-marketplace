import React from 'react'
import styles from './Hero.module.css'

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Fresh From Farm to<br />
            Your Table
          </h1>
          <p className={styles.subtitle}>
            Connect directly with local farmers. Get the freshest organic produce<br />
            delivered to your doorstep.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Shop Now</button>
            <button className={styles.secondaryBtn}>Learn More</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
