import { Dialog, TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import styles from "./addPlatePopup.module.css"
import platesServices from "../../services/plates";

export default function AddPlatePopup({open, onClose}) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        available: true,
        imgUrl: '',
        ingredients: ['']
    })
    const [ available, setAvailable] = useState(true)
    const [ingredients, setIngredients] = useState(['']);
    const { addPlate } = platesServices()
    const authData = JSON.parse(localStorage.getItem('auth'))
    
    const handleFormatDataChange = (e) => {
        e.preventDefault()

        setFormData({
            ...formData,
            [e.target.name]: e.target.name === 'price'? e.target.value === '' ? '' : Number(e.target.value) : e.target.value,
            ingredients: ingredients
        })

        console.log(formData);
        
    }

    const handleSelectChange = (e) => {
        e.preventDefault()

        const valor = e.target.value === 'true'
        setAvailable(valor)

        console.log(formData);
    }

    const handleIngredientsChange = (index, event) => {
        event.preventDefault()

        const newIngredients = [...ingredients];
        newIngredients[index] = event.target.value;
        setIngredients(newIngredients);
    }

    const addIngredientInput = () => {
        setIngredients([...ingredients, ''])
    }

    const removeIngredientInput = (index) => {
        if (ingredients.length > 1) {
            const newIngredients = ingredients.filter((ingredient, i) => i !== index)
            setIngredients(newIngredients)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        addPlate(formData, authData?.token)
        
    }

    useEffect(() => {
    setFormData(prev => ({
        ...prev,
        ingredients: ingredients,
        available: available
    }))
    }, [ingredients, available])

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <div className={styles.popupContainer}>
                    <div><b>Please, add your plate's information</b></div>
                    <form onSubmit={handleSubmit}>
                        <TextField onChange={handleFormatDataChange} className={styles.textField} label="Name" name="name" required type="text"></TextField>
                        <div className={styles.fieldContainer}>
                            <TextField onChange={handleFormatDataChange} className={styles.textField} label="Price $" name="price" required type="number" slotProps={{
                                htmlInput: {
                                    step: "0.01",
                                    min: "0"
                                }
                            }}></TextField>
                            <TextField onChange={handleFormatDataChange} className={styles.textField} label="Category" name="category" required type="text"></TextField>
                            <TextField select label="Available" required fullWidth name="available" value={String(available)} onChange={handleSelectChange}>
                                <MenuItem value="true">Yes</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                            </TextField>
                        </div>
                        <TextField onChange={handleFormatDataChange} className={styles.textField} label="Description" multiline rows={3} name="description" required type="text"></TextField>
                        <label htmlFor="">Ingredientes:</label>
                        <div className={styles.ingredientsContainer}>
                            {ingredients.map((ingredient, index) => (
                                <div key={index}>
                                    <TextField className={styles.textField} type="text" required label={`Ingredient ${index + 1}`} value={ingredient} onChange={(event) => handleIngredientsChange(index, event)}>
                                    
                                    </TextField>
                                </div>
                            ))}

                            <div className={styles.btnsContainer}>
                                <button onClick={addIngredientInput} className={styles.addIngredientBtn}>+</button>
                                <button onClick={() => removeIngredientInput(ingredients.length - 1)} className={styles.removeIngredientBtn}>-</button>
                            </div>
                        </div>
                        <TextField onChange={handleFormatDataChange} className={styles.textField} label="Image Url" name="imgUrl" required type="text"></TextField>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </Dialog>
        </>
    )
}