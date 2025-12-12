import React from 'react'
import styles from './VeggieBox.module.css'

const VeggieBox = () => {
  return (
    <section className={styles.veggieBox}>
      <div className={styles.container}>
        <div className={styles.imageSection}>
          <img 
            src="https://images.pexels.com/photos/4916239/pexels-photo-4916239.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="Assorted fruits and firewood neatly arranged in wooden crates on a white background."
            className={styles.image}
          />
        </div>
        
        <div className={styles.content}>
          <h2 className={styles.title}>Weekly Fresh Veggie Boxes</h2>
          <p className={styles.description}>
            Subscribe to receive handpicked fresh organic vegetables every week.
            Sourced directly from local farms to ensure maximum freshness and quality.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Subscribe Now</button>
            <button className={styles.secondaryBtn}>Explore Produce</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VeggieBox
