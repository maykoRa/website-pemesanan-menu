import React from 'react';
import { useParams ,Link} from 'react-router-dom';
import './Reports.css';

function ReportDetails() {
    // const { orderId } = useParams();
    // const history = useHistory();

    const reportDetails = {
        orderId: '2405221102139',
        table: '4',
        customer: 'Aurelius Patel',
        items: [
            {
                id: 1,
                menu: 'Coffee',
                price: 'Rp 15.000',
                quantity: 2,
                status: 'Completed',
                total: '30.000'
            }
        ],
        totalPrice: '30.000'
    };

    const orderDetails = reportDetails;

    return (
        <div className="report-details">
             <Link to={`/admin/reports`}>
             <button className="btn-back"><i className="fas fa-arrow-left"></i></button>
            </Link>
            <h2>Report Details</h2>
            <div className="order-info">
                <div  className="info-block">
                    <div className="label">Order ID</div>
                    <div className="value">{reportDetails.orderId}</div>
                </div>
                <div className="info-block">
                    <div className="label">Table</div>
                    <div className="value">{reportDetails.table}</div>
                </div>
                <div className="info-block">
                    <div className="label">Customer</div>
                    <div className="value">{reportDetails.customer}</div>
                </div>
            </div>
            <div className="order-items">
                <table>
                    <thead>
                        <tr>
                            <th>Menu</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails.items.map(item => (
                            <tr key={item.id}>
                                <td>{item.menu}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.status}</td>
                                <td>{item.total}</td>
                            </tr>
                        ))}
                         <tr>
                <td colSpan="4" style={{ textAlign: "left" }}>Total Harga</td>
                <td>{orderDetails.totalPrice}</td>
            </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ReportDetails;