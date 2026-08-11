import platesServices from "../../services/plates.jsx"
import styles from "./page.module.css"
import Loading from "../loading/page.jsx"
import { useEffect } from "react"
import PlateCard from "../../components/plateCard/plateCard.jsx"

export default function Plates() {
    const { getAvailablePlates, platesList, platesLoading, refetchPlates } = platesServices()

    const authData = JSON.parse(localStorage.getItem('auth'))

    if (!authData) {
        return <Navigate to="/auth" replace />;
    }

    useEffect(() => {
        if (refetchPlates) {
            getAvailablePlates();
        }
    }, [refetchPlates]);

    if (!platesList) {
        return ( <Loading></Loading> )
    }

    console.log(platesList);
    

    return (
        <>
            <div>
                {platesList.map((plate) => (
                    <PlateCard plateData={plate} key={plate._id}></PlateCard>
                ))}
            </div>
        </>
    )
}