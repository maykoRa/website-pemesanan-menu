import React from 'react';
import { Link } from 'react-router-dom';
import './Reports.css';

function Reports() {
    const reports = [
        {
            orderId: '2405221102139',
            table: '4',
            customer: 'Aurelius Patel',
            total: 'Rp 30.000'
        },
    ];

    return (
        <div className="reports">
            <h2>Reports</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Table</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report.orderId}>
                            <td>{report.orderId}</td>
                            <td>{report.table}</td>
                            <td>{report.customer}</td>
                            <td>{report.total}</td>
                            <td>
                                {/* <Link to={`/report-details/${report.orderId}`}> */}
                                <Link to={`/admin/report-details`}>
                                    <button className="btn-eye"><i className="fas fa-eye"></i></button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Reports;