import React, { Fragment, useEffect, useState } from 'react'
import { CategoryIngredientCreatorContainer, Form, Input, FormText1, FormText2, Button} 
    from './CategoryIngredientCreateEdit.styles'
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showCategories, modifyCategory, newCategory } from '../../actions/categories';
import { showIngredients, modifyIngredient, newIngredient } from '../../actions/ingredients';

export default function CategoryIngredientCreateEdit(props) {
    const history = useHistory()
    const dispatch = useDispatch();

    // console.log('CategoryIngredientCreateEdit (14):: props: ', props);
    
    // console.log('CategoryCreateEdit(5):: props: ', props);
    let action = props.props.location.state.detail.action
    let title = ''
    var catOrIng = ''
    switch (props.isCat) {
        case true:
            catOrIng = props.props.location.state.detail.category 
            title = action + ' Categoría'
            
            break;

        case false:
            catOrIng = props.props.location.state.detail.ingredient 
            title = action + ' Ingrediente'
            break;
    
        default:
            break;
    }
    let oldName = catOrIng.name

    title = title.charAt(0).toUpperCase() + title.slice(1);
                // console.log('CategoryCreateEdit(7):: show: ', props.location.state.detail.action);

    const [inputs, setInputs] = useState({
        name: '',
        description: ''
    })     

    const [errors, setErrors] = useState({
        name: 'Nombre no puede ser vacío',
        description: 'Descripción no puede ser vacía'
    }) 

    useEffect(() => {
    // console.log('CategoryCreateEdit(21):: category: ', props.location.state.detail.category.name);

        if (action !== 'crear') {

            setInputs({
                name: catOrIng.name,
                description: catOrIng.details
            })

            setErrors({
                name: '',
                description: ''
            })
        } 
    }, [])

    function validate(inputObject) {
        let errors = {
            name: '',
            description: ''
        }
        if (!inputObject.name) 
            errors.username = 'Nombre no puede ser vacío';
        if (!inputObject.description) 
            errors.description = 'Descripción no puede ser vacía';
        return errors
    }

    function showSubmitButton() {
        // console.log(errors.name.length, errors.description.length);
        // console.log(errors.name.length !== 0 || errors.description.length !== 0);

        if ((errors.name.length > 0 || errors.description.length > 0) || (action === 'ver'))
            return <Input type="submit" disabled/>

        return  <Input type="submit" /> 
    }

    function submitHandler(e) {
        e.preventDefault()
        switch (props.isCat) {
            case true:
                if (action === 'crear')
                    dispatch(newCategory(inputs))
                else {
                    // console.log('submitHandler(95):: oldName: ', oldName);
                    let endPointArgs = {
                        oldName,
                        category: inputs
                    }
                    // console.log('submitHandler(100) endPointArgs: ', endPointArgs);
                    dispatch(modifyCategory(endPointArgs))
                    dispatch(showCategories)
                }
            break;

            case false:
                if (action === 'crear')
                    dispatch(newIngredient(inputs))
                else {
                    // console.log('submitHandler(109):: oldName: ', oldName);
                    let endPointArgs = {
                        oldName,
                        ingredient: inputs
                    }
                    // console.log('submitHandler(114) endPointArgs: ', endPointArgs);
                    dispatch(modifyIngredient(endPointArgs))
                    dispatch(showIngredients)
                }
                break;
        
            default:
                break;
        }
        finishedWorking()
    } 

    const inputChange = (e) => {
        let nam = e.target.name;
        let val = e.target.value;
        setInputs({...inputs, [nam]: val});
        setErrors(validate({...inputs, [nam]: val}));
    }

    const finishedWorking = () => {
        switch (props.isCat) {
            case true:
                history.push('/admin/categories')
                break;
            case false:
                history.push('/admin/ingredients')
                break;
            default:
                break;
        }
    }

    return (
        <Fragment>
            <CategoryIngredientCreatorContainer>
                <FormText1>{title}</FormText1>

                <Form onSubmit={submitHandler}>
                    <FormText2>Nombre</FormText2>
                    <Input
                        type="text"
                        name="name"
                        value={inputs.name}
                        onChange={inputChange}
                        disabled={action === 'ver' ? 'disabled' : ""}
                    >
                    </Input>      
                    <FormText2>Descripción</FormText2>
                    <Input
                        type="text"
                        name="description"
                        value={inputs.description}
                        onChange={inputChange}
                        disabled={action === 'ver' ? 'disabled' : ""}
                    >
                    </Input>
                    {showSubmitButton()}
                    <Button onClick={finishedWorking}>Terminar</Button>

                </Form>
            </CategoryIngredientCreatorContainer>
        </Fragment>
    )
}
