import styles from "./plateCard.module.css"

export default function PlateCard({ plateData, isSelected}) {
    return (
        <>
            <div className={styles.cardContainer}>
                <img src={plateData.imgUrl} alt="" className={`${isSelected ? styles.selected : null}`} />
                <div className={styles.cardContent}>
                    <h4 className={styles.name1}>{plateData.name}</h4>
                    <h5 className={styles.name2}>{plateData.name}</h5>
                    <h3 className={styles.price1}>$ {plateData.price.toFixed(2)}</h3>
                    <h4 className={styles.price2}>$ {plateData.price.toFixed(2)}</h4>
                </div>
            </div>
        </>
    )
}