import React from "react"
import {
    Page as PDFPage, Text as PDFText, View as PDFView, Document as PDFDoc,
    Image as PDFImage, StyleSheet as PDFStyleSheet,
} from '@react-pdf/renderer'
import black_app_logo from '../../assets/images/logo_app_black_min.jpg'
import moment from "moment"

const pdf_styles = PDFStyleSheet.create({
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderRightWidth: 0,
        borderLeftWidth: 0.5,
        marginTop: 5,
        borderColor: 'gray',
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
        width: '100%',
    },
    tableCol: {
        padding: 3,
        borderStyle: 'solid',
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: 'gray',
    },
    tableCell: {
        margin: 'auto',
        fontSize: 10,
    },
    tableCellTitle: {
        margin: 'auto',
        fontSize: 10,
    },
    small_text: {
        marginTop: 2,
        fontSize: 12,
        color: 'gray',
    },
})

const set_date_of_payment = (time_string) => moment(time_string).format('MMMM Do YYYY, h:mm a')

const set_date_of_receipt_created = () => moment().format('MMMM Do YYYY')

const PDFReceipt = ({
    items, website, systemEmail, deliveryInfo, receiverInfo, paymentInfo, totalToPay, shippingFee, taxFee,
    dateOfPayment,
}) => {

    return (
        <PDFDoc>
            <PDFPage size="A4" style={{ padding: 30 }}>
                <PDFText style={{ fontSize: 20 }}>
                    Payment Receipts
                </PDFText>
                <PDFText style={{ fontSize: 10, marginTop: 3 }}>
                    {'ID: ' + paymentInfo.id}
                </PDFText>
                <PDFText style={{ fontSize: 10, marginTop: 3 }}>
                    From:
                </PDFText>
                <PDFView style={{ alignItems: 'center', flexDirection: 'column' }}>
                    <PDFImage src={black_app_logo} style={{ height: 50, width: 50 }} />
                    <PDFText style={{ marginTop: 10, fontSize: 15 }}>
                        VCN Shop - Fox COR Inc
                    </PDFText>
                    <PDFView style={{ backgroundColor: 'gray', width: '100%', height: 0.5, marginTop: 10 }}></PDFView>
                </PDFView>
                <PDFView style={{ marginTop: 10, flexDirection: 'row', columnGap: 10, justifyContent: 'space-between' }}>
                    <PDFView style={{ width: '50%' }}>
                        <PDFText style={{ fontSize: 15 }}>
                            Receiver Info
                        </PDFText>
                        <PDFView style={{ marginTop: 5 }}>
                            <PDFText style={pdf_styles.small_text}>
                                {'Email: ' + receiverInfo.email}
                            </PDFText>
                            {
                                deliveryInfo && deliveryInfo.phone_number &&
                                <PDFText style={pdf_styles.small_text}>
                                    {'Phone: +' + deliveryInfo.phone_number}
                                </PDFText>
                            }
                            <PDFText style={pdf_styles.small_text}>
                                {'Paid On: ' + paymentInfo.method}
                            </PDFText>
                            <PDFText style={pdf_styles.small_text}>
                                {'Paid At: ' + set_date_of_payment(dateOfPayment)}
                            </PDFText>
                        </PDFView>
                    </PDFView>
                    <PDFView style={{ width: '50%' }}>
                        <PDFText style={{ fontSize: 15 }}>
                            Delivery Info
                        </PDFText>
                        <PDFView style={{ marginTop: 5 }}>
                            <PDFText style={pdf_styles.small_text}>
                                {'Address: ' + deliveryInfo.country + ', ' + deliveryInfo.city + ', ' + deliveryInfo.address}
                            </PDFText>
                            <PDFText style={pdf_styles.small_text}>
                                {'Shipping Method: ' + deliveryInfo.method}
                            </PDFText>
                        </PDFView>
                    </PDFView>
                </PDFView>
                <PDFText style={{ marginTop: 10, fontSize: 15 }}>
                    Items:
                </PDFText>
                <PDFView style={pdf_styles.table}>
                    <PDFView style={pdf_styles.tableRow}>
                        <PDFView style={[pdf_styles.tableCol, { width: '65%', backgroundColor: '#EEEEEE', borderTopWidth: 0.5 }]}>
                            <PDFText style={pdf_styles.tableCellTitle}>
                                Item
                            </PDFText>
                        </PDFView>
                        <PDFView style={[pdf_styles.tableCol, { width: '14%', backgroundColor: '#EEEEEE', borderTopWidth: 0.5 }]}>
                            <PDFText style={pdf_styles.tableCellTitle}>
                                Quantity
                            </PDFText>
                        </PDFView>
                        <PDFView style={[pdf_styles.tableCol, { width: '20%', backgroundColor: '#EEEEEE', borderTopWidth: 0.5 }]}>
                            <PDFText style={pdf_styles.tableCellTitle}>
                                Subtotal (USD)
                            </PDFText>
                        </PDFView>
                    </PDFView>
                    {
                        items.map(({ name, quantity, price, _id }) => (
                            <PDFView style={pdf_styles.tableRow} key={_id}>
                                <PDFView style={[pdf_styles.tableCol, { width: '65%' }]}>
                                    <PDFText style={pdf_styles.tableCell}>
                                        {name}
                                    </PDFText>
                                </PDFView>
                                <PDFView style={[pdf_styles.tableCol, { width: '14%' }]}>
                                    <PDFText style={pdf_styles.tableCell}>
                                        {quantity}
                                    </PDFText>
                                </PDFView>
                                <PDFView style={[pdf_styles.tableCol, { width: '20%' }]}>
                                    <PDFText style={pdf_styles.tableCell}>
                                        {price}
                                    </PDFText>
                                </PDFView>
                            </PDFView>
                        ))
                    }
                    <PDFView style={pdf_styles.tableRow}>
                        <PDFView style={[pdf_styles.tableCol, { backgroundColor: '#EEEEEE', width: '79%' }]}>
                            <PDFText style={pdf_styles.tableCellTitle}>
                                Tax Fee
                            </PDFText>
                        </PDFView>
                        <PDFView style={[pdf_styles.tableCol, { backgroundColor: '#EEEEEE', width: '20%' }]}>
                            <PDFText style={pdf_styles.tableCell}>
                                {taxFee}
                            </PDFText>
                        </PDFView>
                    </PDFView>
                    <PDFView style={pdf_styles.tableRow}>
                        <PDFView style={[pdf_styles.tableCol, { backgroundColor: '#EEEEEE', width: '79%' }]}>
                            <PDFText style={pdf_styles.tableCellTitle}>
                                Shipping Fee
                            </PDFText>
                        </PDFView>
                        <PDFView style={[pdf_styles.tableCol, { backgroundColor: '#EEEEEE', width: '20%' }]}>
                            <PDFText style={pdf_styles.tableCell}>
                                {shippingFee}
                            </PDFText>
                        </PDFView>
                    </PDFView>
                </PDFView>
                <PDFView style={{ flexDirection: 'row', columnGap: 5, padding: '0 10px', marginTop: 5 }}>
                    <PDFText style={{ fontSize: 15 }}>
                        Total:
                    </PDFText>
                    <PDFText style={{ fontSize: 15 }}>
                        {totalToPay + ' USD'}
                    </PDFText>
                </PDFView>
                <PDFText style={{ marginTop: 15, textAlign: 'center', fontSize: 12, textDecoration: 'underline' }}>
                    {'Generated on ' + set_date_of_receipt_created()}
                </PDFText>
                <PDFText style={{ marginTop: 10, textAlign: 'center', fontSize: 10 }}>
                    Thank for shopping with us. If you have any questions, you always can contact to us via email below.
                </PDFText>
                <PDFText style={{ fontSize: 10, marginTop: 15, textAlign: 'center' }}>
                    {'Website: ' + website}
                </PDFText>
                <PDFText style={{ fontSize: 10, marginTop: 5, textAlign: 'center' }}>
                    {'Email: ' + systemEmail}
                </PDFText>
            </PDFPage>
        </PDFDoc>
    )
}

export default PDFReceipt