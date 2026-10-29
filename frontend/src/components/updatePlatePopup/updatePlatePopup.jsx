import { Dialog, TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./updatePlatePopup.module.css"
import platesServices from "../../services/plates.jsx";

export default function UpdatePlatePopup({onClose, onUpdated, onUpdateError, plate}) {
    const ESTADO_INICIAL = {
        name: plate.name,
        price: plate.price,
        category: plate.category,
        description: plate.description,
        available: plate.available,
        imgUrl: plate.imgUrl,
        ingredients: plate.ingredients
    }
    const [formData, setFormData] = useState(ESTADO_INICIAL)
    const [ available, setAvailable] = useState(ESTADO_INICIAL.available)
    const [ingredients, setIngredients] = useState(ESTADO_INICIAL.ingredients);
    const [urlImagemValida, setUrlImagemValida] = useState(true);
    const { updatePlate } = platesServices()
    const authData = JSON.parse(localStorage.getItem('auth'))

    const handleClose = (e) => {
        setFormData(ESTADO_INICIAL)
        setAvailable(ESTADO_INICIAL.available)
        setIngredients(ESTADO_INICIAL.ingredients)
        setUrlImagemValida(true)
        
        onClose(e)
    }
    
    const handleFormatDataChange = (e) => {
        e.preventDefault()

        const { name, value } = e.target

        setFormData(prev => ({
            ...prev,
            [name]: name === "price" ? value === "" ? "" : Number(value) : value
        }))
    }

    const handleSelectChange = (e) => {
        e.preventDefault()

        const valor = e.target.value === 'true'
        setAvailable(valor)

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

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const dadosLimpos = {
            ...formData,
            name: formData.name.trim(),
            category: formData.category.trim(),
            description: formData.description.trim(),
            imgUrl: formData.imgUrl.trim(),
            ingredients: ingredients.map(ingredient => ingredient.trim())
            };

            if (!urlImagemValida) {
                throw new Error("URL de imagem inválida");
                
            }

            const result = await updatePlate(plate._id, dadosLimpos, authData?.token)

            if (!result.success) {
                throw new Error(result.body)
            }

            onUpdated(dadosLimpos.name)

            handleClose(e)
            
        } catch (error) {
            onUpdateError(error.message)
        }
        
    }

    const verificarUrlImagem = (url) => {
        return new Promise((resolve) => {
                const img = new Image();
                img.src = url;
                
                img.onload = () => resolve(true);  // A imagem carregou
                img.onerror = () => resolve(false); // Falha ao carregar
            });
    }

    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            ingredients: ingredients,
            available: available
        }))
    }, [ingredients, available])

    useEffect(() => {
        const url = formData.imgUrl.trim()

        if (!url) {
            setUrlImagemValida(null)
            return
        }

        let ativo = true

        verificarUrlImagem(url).then((valida) => {
            if (ativo) {
                setUrlImagemValida(valida)
            }
        })

        return () => {
            ativo = false
        }
    }, [formData.imgUrl])

    return (
        <>
            <Dialog open={true} onClose={handleClose} className={styles.popupDialog} maxWidth={false} 
                sx={{ 
                        "& .MuiDialog-paper": {
                        width:"1000px",
                        maxWidth: "90vw",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        boxSizing: "border-box"
                    }
                }}>
                <div className={styles.popupContainer}>
                    <div className={styles.popupHeader}><b>Update your plate's information:</b></div>
                    <div className={styles.popupContent}>
                        <div className={styles.imgPrevContainer}>
                            <div><b>Image preview:</b></div>
                            {!formData.imgUrl.trim() ? (
                                <div className={styles.imgPlaceholder}>
                                    Add a valid url to see a preview
                                </div>
                            ) : urlImagemValida === null ? (
                                <div className={styles.imgPlaceholder}>
                                    Checking url...
                                </div>
                            ) : urlImagemValida === false ? (
                                <div className={styles.imgPlaceholder}>
                                    Invalid url
                                </div>
                            ) : (
                                <img src={formData.imgUrl} alt="" />
                            )
                            }
                        </div>
                        <form onSubmit={handleSubmit}>
                            <TextField onChange={handleFormatDataChange} value={formData.name} className={styles.textField} label="Name" name="name" required type="text"></TextField>
                            <div className={styles.fieldContainer}>
                                <TextField onChange={handleFormatDataChange} value={formData.price} className={styles.textField} label="Price $" name="price" required type="number" slotProps={{
                                    htmlInput: {
                                        step: "0.01",
                                        min: "0"
                                    }
                                }}></TextField>
                                <TextField onChange={handleFormatDataChange} value={formData.category} className={styles.textField} label="Category" name="category" required type="text"></TextField>
                                <TextField select label="Available" required fullWidth name="available" value={String(available)} onChange={handleSelectChange}>
                                    <MenuItem value="true">Yes</MenuItem>
                                    <MenuItem value="false">No</MenuItem>
                                </TextField>
                            </div>
                            <TextField onChange={handleFormatDataChange} value={formData.description} className={styles.textField} label="Description" multiline rows={3} name="description" required type="text"></TextField>
                            <label htmlFor="">Ingredients:</label>
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
                            <br />
                            <TextField onChange={handleFormatDataChange} value={formData.imgUrl} className={styles.textField} label="Image Url" name="imgUrl" required type="text"></TextField>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </Dialog>
        </>
    )
}