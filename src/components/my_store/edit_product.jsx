import React, { useState, useEffect, useTransition, useRef } from "react"
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from "react-redux"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { toast } from 'react-toastify'
import { IconButton } from "@mui/material"
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import Grid from '@mui/material/Grid'
import CancelIcon from '@mui/icons-material/Cancel'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import InfoIcon from '@mui/icons-material/Info'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'
import { updateProduct } from '../../store/actions/product_actions'
import { CircularProgress, Tooltip, Stack } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import ErrorIcon from '@mui/icons-material/Error'

const options = {
    colors: [
        'Red',
        'Yellow',
        'Green',
        'Blue',
        'Violet',
        'White',
        'Black',
        'Beige',
        'Gray',
        'Brown',
    ],
    sizes: ['S', 'M', 'L'],
}

const ConnectForm = ({ children }) => {
    const useForm_methods = useFormContext()
    return children({ ...useForm_methods })
}

const RenderCheckBox = () => (<Checkbox color="default" sx={{ color: "#2e7d32" }} />)

const Checkboxes = ({ onSetValue, label, list, helperText, errors }) => {
    const input_value = useRef('')

    const handlePick = (e) => {
        let value = e.target.value

        if (e.target.checked)
            input_value.current += `,${value}`
        else
            input_value.current = input_value.current.replace(`,${value}`, '')

        onSetValue(label, input_value.current)
    }

    return (
        <FormControl color="success">
            <FormLabel>{label}</FormLabel>
            <FormGroup
                row
                onChange={handlePick}
            >
                {
                    list.map((color) => (
                        <FormControlLabel
                            key={color}
                            control={RenderCheckBox()}
                            label={color}
                            value={color}
                        />
                    ))
                }
            </FormGroup>
            <FormHelperText error={!!errors[label]}>
                {helperText}
            </FormHelperText>
        </FormControl>
    )
}

const check_error = (errors, label, text_if_no_error_with_label) => {
    return errors[label] && errors[label].message ?
        errors[label].message
        :
        text_if_no_error_with_label
}

const Detail = () => {
    return (
        <ConnectForm>
            {({ register, formState: { errors }, setValue: handleSetValue }) => (
                <DetailSection id="DetailSection">
                    <TextField
                        variant="outlined"
                        label='Description'
                        fullWidth
                        multiline
                        inputProps={{ maxLength: 500 }}
                        rows={9}
                        helperText={check_error(errors, 'Description', 'Describe your product. Enter everything your customer should know about this product. You shouldn\'t enter special characters that can make your description loose some letters.')}
                        InputProps={{ ...register('Description') }}
                        error={!!errors['Description']}
                        color="success"
                    />

                    <input
                        {...register('Colors')}
                        style={{ display: 'none' }}
                    />

                    <Checkboxes
                        helperText={'Pick colors your products have'}
                        label={'Colors'}
                        list={options.colors}
                        onSetValue={handleSetValue}
                        errors={errors}
                    />

                    <input
                        {...register('Sizes')}
                        style={{ display: 'none' }}
                    />

                    <Checkboxes
                        helperText={'Pick a size your products have'}
                        label={'Sizes'}
                        list={options.sizes}
                        onSetValue={handleSetValue}
                        errors={errors}
                    />

                    <TextField
                        variant="outlined"
                        label='Stock'
                        fullWidth
                        color="success"
                        type="number"
                        helperText={check_error(errors, 'Stock', 'Enter the current amount of your product.')}
                        InputProps={{ ...register('Stock', { pattern: /^[0-9]+$/ }) }}
                        error={!!errors['Stock']}
                        inputProps={{ min: 1, max: 1000 }}
                    />
                </DetailSection>
            )}
        </ConnectForm>
    )
}

const DetailSection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '30px',
    fontFamily: theme.fontFamily.nunito,
}))

const AddImagesSection = React.memo(({ imagesRef }) => {
    const [imageList, setImageList] = useState([null, null, null, null, null])

    useEffect(() => {
        let images = imageList.filter((image_object) => image_object)
        images = images.map(({ file }) => file)

        imagesRef.current = images
    }, [imageList])

    const cancelPickImg = (image_url) => {
        setImageList(pre => pre.map(
            (image_object) => {
                if (image_object && image_url !== image_object.url)
                    return image_object
                else
                    return null
            }
        ))

        URL.revokeObjectURL(image_url)
    }

    const pickImgs = (e, index_of_image_list) => {
        let { files } = e.target

        files = Array.from(files).slice(0, max_add_images - index_of_image_list)

        setImageList(pre => {
            let name_of_images = pre.map((image_object) => image_object && image_object.file.name)
            let images_to_add = files.filter(({ name }) => !name_of_images.includes(name))
            images_to_add = images_to_add.map((file) => ({ file, url: URL.createObjectURL(file) }))

            let i = 0, number_of_files = files.length

            return pre.map((object, index) => {
                if (object || i > number_of_files - 1 || index < index_of_image_list)
                    return object
                else
                    return images_to_add[i++]
            })
        })

        e.target.value = null
    }

    const RenderAddImgButton = ({ height, paddingBottom, imageObject, index }) => {
        return (
            <Grid item xs={1}>
                {
                    imageObject && imageObject.url ?
                        <ImageWrapper sx={height ? { height } : { paddingBottom }}>
                            <Tooltip title="Delete">
                                <CloseIconWrapper onClick={() => cancelPickImg(imageObject.url)}>
                                    <CancelIcon sx={{ color: 'red' }} />
                                </CloseIconWrapper>
                            </Tooltip>
                            <img src={imageObject.url} alt="Product" />
                        </ImageWrapper>
                        :
                        <Tooltip title="Add Image" followCursor>
                            <AddImg
                                htmlFor={`product_image_input_${index}_to_edit`}
                                sx={height ? { height } : { paddingBottom }}
                            >
                                <AddIconWrapper>
                                    <AddIcon />
                                </AddIconWrapper>
                            </AddImg>
                        </Tooltip>
                }
            </Grid>
        )
    }

    return (
        <>
            <div style={{ display: 'none' }}>
                {
                    [0, 1, 2, 3, 4].map((value) => (
                        <input
                            key={value}
                            type="file"
                            id={`product_image_input_${value}_to_edit`}
                            onChange={(e) => pickImgs(e, value)}
                            multiple
                            accept="image/*"
                        />
                    ))
                }
            </div>

            <Title>
                <PermMediaIcon />
                <span>Product Images</span>
            </Title>

            <Grid
                container
                rowSpacing={2}
                columnSpacing={{ xs: 2 }}
                columns={{ xs: 1, sm: 2 }}
            >
                <RenderAddImgButton height={'100%'} paddingBottom={null} imageObject={imageList[0]} index={0} />

                <Grid xs={1} item>
                    <Grid
                        container
                        rowSpacing={2}
                        columnSpacing={{ xs: 2 }}
                        columns={2}
                    >
                        <RenderAddImgButton height={null} paddingBottom={'90%'} imageObject={imageList[1]} index={1} />
                        <RenderAddImgButton height={null} paddingBottom={'90%'} imageObject={imageList[2]} index={2} />
                        <RenderAddImgButton height={null} paddingBottom={'90%'} imageObject={imageList[3]} index={3} />
                        <RenderAddImgButton height={null} paddingBottom={'90%'} imageObject={imageList[4]} index={4} />
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
})

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} unmountOnExit />
})

const max_add_images = 5

const EditProduct = ({ productId }) => {
    const { loading } = useSelector(({ product }) => product.productDetail)
    const [openEditProduct, setOpenEditProduct] = useState(false)
    const useForm_methods = useForm()
    const { handleSubmit } = useForm_methods
    const [isPending, startTransition] = useTransition()
    const dispatch = useDispatch()
    const product_images = useRef()

    const checkAndSubmitEditProduct = (data, e) => {
        e.preventDefault()

        let description = data['Description']
        let stock = data['Stock'] * 1
        let colors = data['Colors']
        let sizes = data['Sizes']
        let images = product_images.current
        let { setError } = useForm_methods

        if (!description && !stock && !colors && !sizes && images.length === 0)
            return toast.warning('Please fill in at least one field that you want to chnage')

        if (description.length > 500) {
            toast.warning('The Description field can not be longer than 500 characters')
            return setError('Description', { message: 'The product description can not longer than 500 characters' })
        }
        if (stock < 0 || stock > 100) {
            toast.warning('The stock field can not be greater than 1000 and lower than 0')
            return setError('Stock', { message: 'The stock can not be greater than 1000 and lower than 0' })
        }

        let colors_array = colors && colors.slice(1, colors.length).split(',')
        let sizes_array = sizes && sizes.slice(1, sizes.length).split(',')

        dispatch(updateProduct(
            sizes_array,
            colors_array,
            stock,
            description.trim(),
            productId,
            images
        ))
    }

    return (
        <>
            <Dialog
                fullScreen
                open={openEditProduct}
                TransitionComponent={Transition}
            >
                <CloseContainer>
                    <Stack
                        flexDirection="row"
                        alignItems="center"
                        width="100%"
                    >
                        <Tooltip title="Close">
                            <IconButton onClick={() => setOpenEditProduct(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                        <span>Cancel</span>
                    </Stack>

                    <h2 className="close_title">Add Product</h2>
                </CloseContainer>

                <DialogContent>

                    <Note>
                        <ErrorIcon sx={{ fontSize: '1.2em', color: 'gray' }} />
                        <span>
                            Note that all of the old data will be changed to the data that you filled in
                            the fields below. And the data of fields isn't filled will be stay unchanged.
                            Now feel free to edit.
                        </span>
                    </Note>

                    <AddImagesSection
                        imagesRef={product_images}
                    />
                    <FormHelperText error={!!useForm_methods.formState.errors['Images']}>
                        Add at least one image for your products. This info will be displayed on product page for the customers
                    </FormHelperText>

                    <Title>
                        <InfoIcon />
                        <span>Product Detail</span>
                    </Title>

                    <FormProvider {...useForm_methods}>
                        <Detail />
                    </FormProvider>

                    <SubmitBtn
                        sx={isPending || loading ? { pointerEvents: 'none' } : {}}
                        onClick={handleSubmit(checkAndSubmitEditProduct)}
                    >
                        {
                            isPending || loading ?
                                <CircularProgress
                                    size={17}
                                    thickness={5}
                                    sx={{ color: 'white', fontSize: '1.2em' }}
                                />
                                :
                                'Submit'
                        }
                    </SubmitBtn>

                </DialogContent>
            </Dialog >

            <EditBtn
                onClick={() => {
                    startTransition(() => { setOpenEditProduct(true) })
                }}
            >
                {
                    isPending ?
                        <CircularProgress
                            size={24}
                            thickness={6}
                            sx={{ color: 'white' }}
                        />
                        :
                        <>
                            <span>Edit</span>
                            <EditIcon sx={{ fontSize: '1.3em' }} />
                        </>
                }
            </EditBtn>
        </>
    )
}

export default React.memo(EditProduct)

const DialogContent = styled('div')(({ theme }) => ({
    padding: '0 40px 20px',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('sm')]: {
        padding: '0 20px 20px',
    }
}))

const Note = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '5px',
    marginTop: '10px',
    '& span': {
        fontFamily: '"Nunito", "sans-serif"',
        fontSize: '0.8em',
    }
})

const CloseContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '5px',
    alignItems: 'center',
    fontWeight: 'bold',
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px',
    paddingLeft: '20px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    fontFamily: theme.fontFamily.nunito,
    position: 'relative',
    '& .close_title': {
        margin: '0',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        [theme.breakpoints.down('sm')]: {
            position: 'relative',
            top: '0',
            left: '0',
            transform: 'none',
        }
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        paddingLeft: '10px',

    }
}))

const image_layout = {
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box',
}

const ImageWrapper = styled('div')({
    ...image_layout,
    border: '1px white solid',
    '& img': {
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: '0',
        left: '0',
    },
})

const CloseIconWrapper = styled('div')({
    position: 'absolute',
    right: '0',
    top: '0',
    zIndex: '3',
    transform: 'translate(50%,-50%)',
    backgroundColor: 'white',
    borderRadius: '50%',
    height: '1.5em',
    transition: 'transform 0.2s',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.1) translate(50%,-50%)',
    },
})

const AddImg = styled('label')(({ theme }) => ({
    display: 'block',
    border: '1px gray solid',
    ...image_layout,
    cursor: 'pointer',
    '&:hover': {
        outline: '1.5px black solid',
    },
    [theme.breakpoints.down('sm')]: {
        paddingBottom: '90%',
    }
}))

const AddIconWrapper = styled('div')({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
})

const Title = styled('h2')({
    display: 'flex',
    columnGap: '10px',
    alignItems: 'center',
    fontSize: '1.3em',
    fontWeight: 'bold',
    marginTop: '40px',
})

const SubmitBtn = styled('button')({
    padding: '10px 30px',
    borderRadius: '5px',
    backgroundColor: 'black',
    color: 'white',
    border: '2px black solid',
    marginTop: '30px',
    width: '100%',
    fontSize: '1.2em',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
        '& svg': {
            color: 'black',
        }
    },
})

const EditBtn = styled('button')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px black solid',
    columnGap: '10px',
    padding: '10px',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '30px',
    backgroundColor: 'black',
    color: 'white',
    fontSize: '1.2em',
    fontWeight: 'bold',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'white',
        color: 'black',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '1em',
    }
}))