import { Dialog, TextField, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import styles from "./addPlatePopup.module.css"
import platesServices from "../../services/plates";
import ToastMessage from "../toastMessage/toastMessage.jsx"

export default function AddPlatePopup({open, onClose}) {
    const ESTADO_INICIAL = {
        name: '',
        price: '',
        category: '',
        description: '',
        available: true,
        imgUrl: '',
        ingredients: ['']
    }
    const [formData, setFormData] = useState(ESTADO_INICIAL)
    const [ available, setAvailable] = useState(true)
    const [ingredients, setIngredients] = useState(['']);
    const [urlImagemValida, setUrlImagemValida] = useState(null);
    const { addPlate } = platesServices()
    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: 'success'
    })
    const authData = JSON.parse(localStorage.getItem('auth'))

    const handleClose = (e) => {
        setFormData(ESTADO_INICIAL)
        setAvailable(true)
        setIngredients([''])
        setUrlImagemValida(null)
        
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

    const hideToast = () => {
        setToast((prev) => ({
            ...prev,
            visible: false,
        }))
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

            const result = await addPlate(dadosLimpos, authData?.token)

            if (!result.success) {
                throw new Error(result.body)
            }

            setToast({
                visible: true,
                message: `Prato "${dadosLimpos.name}" cadastrado com sucesso`,
                type: "success"
            })

            handleClose(e)
            
        } catch (error) {
            console.error("Erro no cadastro:", error);
            
            setToast({
                visible: true,
                message: error.message || "Ocorreu um erro",
                type: "error"
            })
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
            <Dialog open={open} onClose={handleClose} className={styles.popupDialog} maxWidth={false} 
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
                    <div className={styles.popupHeader}><b>Please, add your plate's information</b></div>
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
                            <TextField onChange={handleFormatDataChange} className={styles.textField} label="Image Url" name="imgUrl" required type="text"></TextField>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </Dialog>

            <ToastMessage visible={toast.visible} onHide={hideToast} message={toast.message} type={toast.type}></ToastMessage>
        </>
    )
}