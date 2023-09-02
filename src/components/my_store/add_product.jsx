import React, { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import Slide from '@mui/material/Slide'
import CloseIcon from '@mui/icons-material/Close'
import { CircularProgress, Tooltip } from "@mui/material"
import { IconButton } from "@mui/material"
import Grid from '@mui/material/Grid'
import CancelIcon from '@mui/icons-material/Cancel'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import InfoIcon from '@mui/icons-material/Info'
import { useForm, Controller, FormProvider, useFormContext } from 'react-hook-form'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import { Stack, Box, Avatar, Checkbox, FormGroup, FormHelperText, TextField, Dialog } from "@mui/material"
import Cash from '../../assets/images/payment_methods/cash.jpg'
import Mastercard from '../../assets/images/payment_methods/mastercard.jpg'
import Visa from '../../assets/images/payment_methods/visa.jpg'
import { toast } from "react-toastify"
import { useDispatch, useSelector } from "react-redux"
import { createNewProduct } from '../../store/actions/product_actions'

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

const PaymentMethodComponent = ({ title, src, size }) => (
    <Tooltip title={title}>
        <Avatar alt={title} src={src} variant="square" sx={{ height: size, width: size }} />
    </Tooltip>
)

const RadioComponent = () => (<Radio color="default" sx={{ color: "#2e7d32" }} />)
const CheckboxComponent = () => (<Checkbox color="default" sx={{ color: "#2e7d32" }} />)

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
                    list.map((value) => (
                        <FormControlLabel
                            key={value}
                            control={CheckboxComponent()}
                            label={value}
                            value={value}
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

const AddInformation = () => {

    return (
        <ConnectForm>
            {({ register, formState: { errors }, control, setValue: handleSetValue }) => (
                <DetailSection id="DetailSection">
                    <TextField
                        variant="outlined"
                        label='Product Name'
                        fullWidth
                        helperText={check_error(errors, 'Product Name', 'Enter product name. This product will be searched by the name by the customers.')}
                        InputProps={{ ...register('Product Name', { required: true }) }}
                        error={!!errors['Product Name']}
                        color="success"
                        inputProps={{ maxLength: 50 }}
                    />

                    <TextField
                        variant="outlined"
                        label='Description'
                        fullWidth
                        multiline
                        inputProps={{ maxLength: 500 }}
                        rows={9}
                        helperText={check_error(errors, 'Description', 'Describe your product. Enter everything your customer should know about this product. You shouldn\'t enter special characters that can make your description loose some letters.')}
                        InputProps={{ ...register('Description', { required: true }) }}
                        error={!!errors['Description']}
                        color="success"
                    />

                    <FormControl color="success">
                        <FormLabel>Category</FormLabel>
                        <Controller
                            control={control}
                            name='Category'
                            render={({ field: { onChange } }) => (
                                <RadioGroup
                                    row
                                    onChange={onChange}
                                >
                                    <FormControlLabel
                                        value='Shirt'
                                        control={RadioComponent()}
                                        label='Shirt'
                                    />
                                    <FormControlLabel
                                        value='Pant'
                                        control={RadioComponent()}
                                        label='Pant'
                                    />
                                </RadioGroup>
                            )}
                        />
                        <FormHelperText error={!!errors['Category']}>
                            Pick a category for your products
                        </FormHelperText>
                    </FormControl>

                    <FormControl color="success">
                        <FormLabel>Target Gender</FormLabel>
                        <Controller
                            control={control}
                            name='Target Gender'
                            render={({ field: { onChange } }) => (
                                <RadioGroup
                                    row
                                    onChange={onChange}
                                >
                                    <FormControlLabel
                                        value='Male'
                                        control={RadioComponent()}
                                        label='Male'
                                    />
                                    <FormControlLabel
                                        value='Female'
                                        control={RadioComponent()}
                                        label='Female'
                                    />
                                    <FormControlLabel
                                        value='Unisex'
                                        control={RadioComponent()}
                                        label='Unisex'
                                    />
                                </RadioGroup>
                            )}
                        />
                        <FormHelperText error={!!errors['Target Gender']}>
                            Pick a kind of gender will be suitable with your products
                        </FormHelperText>
                    </FormControl>

                    <div>
                        <TextField
                            variant="outlined"
                            label='Price'
                            fullWidth
                            type="number"
                            color="success"
                            helperText={check_error(errors, 'Price', 'Enter the price of your product in USD currency. The following are payment useForm_methods accepted for the customers. For example: 52.21 means 52 dollars and 21 cents')}
                            InputProps={{ ...register('Price', { pattern: /^[0-9.]+$/, required: true }) }}
                            error={!!errors['Price']}
                            inputProps={{ min: 0, max: 9999999 }}
                        />
                        <Stack direction="row" spacing={2} marginTop="5px">
                            <PaymentMethodComponent title={'Cash'} size={'35px'} src={Cash} />
                            <PaymentMethodComponent title={'Mastercard'} size={'40px'} src={Mastercard} />
                            <PaymentMethodComponent title={'Visa'} size={'40px'} src={Visa} />
                        </Stack>
                    </div>

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
                        InputProps={{ ...register('Stock', { pattern: /^[0-9]+$/, required: true }) }}
                        error={!!errors['Stock']}
                        inputProps={{ min: 1, max: 1000 }}
                    />
                </DetailSection>
            )}
        </ConnectForm>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} unmountOnExit />
})

const AddImagesSection = React.memo(({ onChange }) => {
    const [imageList, setImageList] = useState([null, null, null, null, null])

    useEffect(() => {
        let images
        images = imageList.filter((image_object) => image_object)
        images = images.map(({ file }) => file)

        onChange(images)
    }, [imageList, onChange])

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

    const AddImgButton = ({ height, paddingBottom, imageObject, index }) => {
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
                                htmlFor={`product_image_input_${index}_to_add`}
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
            <Box display="none">
                {
                    [0, 1, 2, 3, 4].map((value) => (
                        <input
                            key={value}
                            type="file"
                            id={`product_image_input_${value}_to_add`}
                            onChange={(e) => pickImgs(e, value)}
                            multiple
                            accept="image/*"
                        />
                    ))
                }
            </Box>

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

                <AddImgButton height={'100%'} paddingBottom={null} imageObject={imageList[0]} index={0} />

                <Grid xs={1} item>
                    <Grid
                        container
                        rowSpacing={2}
                        columnSpacing={{ xs: 2 }}
                        columns={2}
                    >
                        <AddImgButton height={null} paddingBottom={'90%'} imageObject={imageList[1]} index={1} />
                        <AddImgButton height={null} paddingBottom={'90%'} imageObject={imageList[2]} index={2} />
                        <AddImgButton height={null} paddingBottom={'90%'} imageObject={imageList[3]} index={3} />
                        <AddImgButton height={null} paddingBottom={'90%'} imageObject={imageList[4]} index={4} />
                    </Grid>
                </Grid>

            </Grid>
        </>
    )
})

const max_add_images = 5

const AddProduct = () => {
    const { loading } = useSelector(({ product }) => product.productDetail)
    const [openAddProduct, setOpenAddProduct] = useState(false)
    const useForm_methods = useForm()
    const { handleSubmit } = useForm_methods
    const [isPending, startTransition] = useTransition()
    const dispatch = useDispatch()
    const product_images = useRef([])

    const handleSetProductImages = useCallback((images) => {
        product_images.current = images
    }, [])

    const checkAndSubmitAddProduct = (data, e) => {
        e.preventDefault()

        let product_name = data['Product Name']
        let description = data['Description']
        let price = data['Price'] * 1
        let stock = data['Stock'] * 1
        let colors = data['Colors']
        let category = data['Category']
        let target_gender = data['Target Gender']
        let sizes = data['Sizes']
        let images = product_images.current
        let warning = (message) => toast.warning(message || 'Can\'t not submit, please check your form')
        let { setError } = useForm_methods

        if (
            !product_name || !description || !price || !stock ||
            !category || !target_gender || !colors || !sizes
        ) return warning('Please don\'t empty any fields')

        if (images.length === 0) {
            return warning('Please don\'t empty images field')
        }

        if (product_name.length > 150) {
            warning()
            return setError('Product Name', { message: 'The product name can not longer than 50 characters' })
        }
        if (description.length > 500) {
            warning()
            return setError('Description', { message: 'The product description can not be longer than 500 characters' })
        }
        if (price > 9999999 || price < 0) {
            warning()
            return setError('Price', { message: 'The price can not be greater than 9,999,999 and lower than 0' })
        }
        if (stock < 0 || stock > 1000) {
            warning()
            return setError('Stock', { message: 'The stock can not be greater than 1000 and lower than 0' })
        }

        let colors_array = colors.slice(1).split(',')
        let sizes_array = sizes.slice(1).split(',')

        dispatch(createNewProduct(
            product_name.trim(),
            category,
            target_gender,
            price,
            { colors: colors_array, sizes: sizes_array },
            stock,
            description.trim(),
            images
        ))
    }

    return (
        <>
            <Dialog
                fullScreen
                open={openAddProduct}
                TransitionComponent={Transition}
            >
                <CloseContainer>
                    <Stack
                        flexDirection="row"
                        alignItems="center"
                        width="100%"
                    >
                        <Tooltip title="Close">
                            <IconButton onClick={() => setOpenAddProduct(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Tooltip>
                        <span>Cancel</span>
                    </Stack>

                    <h2 className="close_title">Add Product</h2>
                </CloseContainer>

                <DialogContent>

                    <AddImagesSection onChange={handleSetProductImages} />

                    <FormHelperText>
                        Add at least one image for your products. This info will be displayed on product page for the customers
                    </FormHelperText>

                    <Title>
                        <InfoIcon />
                        <span>Product Information</span>
                    </Title>

                    <FormProvider {...useForm_methods}>
                        <AddInformation />
                    </FormProvider>

                    <SubmitBtn
                        sx={isPending || loading ? { pointerEvents: 'none' } : {}}
                        onClick={handleSubmit(checkAndSubmitAddProduct)}
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

            <AddProductBtn
                onClick={() => {
                    startTransition(() => { setOpenAddProduct(true) })
                }}
            >
                {
                    isPending ?
                        <CircularProgress
                            size={13}
                            thickness={6}
                            sx={{ color: 'black' }}
                        />
                        :
                        <div className="content">
                            <AddIcon sx={{ fontSize: '1.2em' }} />
                            <span>New Product</span>
                        </div>
                }
            </AddProductBtn>
        </>
    )
}

export default React.memo(AddProduct)

const DialogContent = styled('div')(({ theme }) => ({
    padding: '0 40px 20px',
    fontFamily: theme.fontFamily.nunito,
    [theme.breakpoints.down('sm')]: {
        padding: '0 20px 20px',
    }
}))

const DetailSection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    rowGap: '30px',
    fontFamily: theme.fontFamily.nunito,
}))

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
    boxShadow: '0px 0px 3px gray',
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

const AddProductBtn = styled('button')(({ theme }) => ({
    fontSize: '0.9em',
    cursor: 'pointer',
    backgroundColor: 'white',
    border: '1px black solid',
    position: 'relative',
    overflowX: 'hidden',
    padding: '15px 20px',
    height: 'fit-content',
    '& .content': {
        display: 'flex',
        columnGap: '10px',
        alignItems: 'center',
        fontSize: '1em',
        zIndex: '2',
        position: 'relative',
        transition: 'color 0.5s',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        backgroundColor: 'black',
        left: '0',
        top: '0',
        height: '100%',
        width: '130%',
        transition: 'transform 0.5s',
        transform: 'skew(30deg) translateX(-130%)',
        zIndex: '1',
    },
    '&:hover::after': {
        transform: 'skew(30deg) translateX(-10%)',
    },
    '&:hover .content': {
        color: 'white',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '10px 20px',
    }
}))