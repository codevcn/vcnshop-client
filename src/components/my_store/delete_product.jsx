import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { CircularProgress, IconButton, Stack } from "@mui/material"
import { Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { deleteProduct } from '../../store/actions/product_actions'
import { useDispatch } from 'react-redux'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const DeleteProduct = ({ productId }) => {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        if (!loading && openDialog) setOpenDialog(false)
    }, [loading])

    const handleOpenDialog = (open) => setOpenDialog(open)

    const handleDeleteProduct = async () => {
        setLoading(true)

        await dispatch(deleteProduct(productId))

        setLoading(false)
    }

    return (
        <DeleteProductSection id="DeleteProductSection">
            <DeleteButton onClick={() => handleOpenDialog(true)}>
                <DeleteIcon sx={{ fontSize: '1.5em' }} />
                <span>Delete This Product</span>
            </DeleteButton>

            <Dialog
                open={openDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => handleOpenDialog(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <Stack justifyContent="space-between" flexDirection="row" padding="5px" paddingBottom="0">
                    <span></span>
                    <Tooltip title="Close">
                        <IconButton onClick={() => handleOpenDialog(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                <DialogContent>
                    <DialogContentText padding="0 20px">
                        Are you sure you want to delete this product ?
                    </DialogContentText>
                </DialogContent>
                <Stack flexDirection="row" marginTop="10px">
                    <ConfirmingBtn
                        onClick={() => handleOpenDialog(false)}
                        sx={{ backgroundColor: '#B7BECE' }}
                    >
                        NO
                    </ConfirmingBtn>
                    <ConfirmingBtn
                        onClick={handleDeleteProduct}
                        sx={{ backgroundColor: '#FC716A' }}
                    >
                        {
                            loading ?
                                <CircularProgress
                                    size={18}
                                    thickness={6}
                                    sx={{ color: 'white', fontSize: '1.3em' }}
                                />
                                :
                                'YES'
                        }
                    </ConfirmingBtn>
                </Stack>
            </Dialog>
        </DeleteProductSection>
    )
}

export default DeleteProduct

const DeleteProductSection = styled('div')(({ theme }) => ({
    marginTop: '30px',
}))

const DeleteButton = styled('div')(({ theme }) => ({
    display: 'flex',
    columnGap: '10px',
    alignItems: 'center',
    backgroundColor: '#d11a2a',
    borderRadius: '5px',
    border: '3px white solid',
    cursor: 'pointer',
    color: 'white',
    padding: '10px 30px',
    width: 'fit-content',
    '&:hover': {
        outline: '2px #d11a2a solid',
    },
    [theme.breakpoints.down('md')]: {
        fontSize: '0.9em',
    }
}))

const ConfirmingBtn = styled('button')({
    width: '50%',
    border: 'none',
    padding: '20px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1.3em',
    '&:hover': {
        textDecoration: 'underline',
    }
})