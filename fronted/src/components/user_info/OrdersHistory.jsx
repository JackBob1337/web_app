import React from 'react';
import './OrdersHistory.css';

const OrdersHistory = ({ orders, loading, error }) => {
    if (loading) return <p className="orders-empty">Loading...</p>;
    if (error) return <p className="orders-empty">Error: {error}</p>;
    if (!orders || orders.length === 0) return <p className="orders-empty">No orders yet</p>;

    return (
        <div>
            <h3 className="orders-history-title">Order History</h3>
            {orders.map(order => (
                <div key={order.order_id} className="order-card">
                    <div className="order-header">
                        <span className="order-id">Order #{order.order_id}</span>
                        <span className="order-date">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <ul className="order-items">
                        {order.items.map((item, i) => (
                            <li key={i} className="order-item">
                                <span className="order-item-name">{item.product_name} × {item.quantity}</span>
                                <span>${(item.price_cents / 100).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="order-total">
                        Total: ${(order.total_price_cents / 100).toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrdersHistory;
