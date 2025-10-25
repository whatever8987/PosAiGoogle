import type { SavedQuery, POSIntegration, UsageStats, Appointment, Technician } from './types';

export const MOCK_QUERIES: SavedQuery[] = [
  { id: 'q1', name: 'Top Customers', question: 'What are the top 10 customers by total spending?' },
  { id: 'q2', name: 'Monthly Revenue', question: 'What is our total revenue for this month?' },
  { id: 'q3', name: 'Profitable Services', question: 'Which services are most profitable?' },
  { id: 'q4', name: 'New Customers', question: 'How many new customers did we get this week?' },
  { id: 'q5', name: 'Low Stock Products', question: 'Show me products that are running low on stock' },
];

export const MOCK_POS_INTEGRATIONS: POSIntegration[] = [
  { id: 'pos1', name: 'Square', provider: 'square', status: 'connected', lastSync: '2 hours ago' },
  { id: 'pos2', name: 'Clover', provider: 'clover', status: 'connected', lastSync: '4 hours ago' },
  { id: 'pos3', name: 'Shopify', provider: 'shopify', status: 'disconnected', lastSync: '3 days ago' },
];

export const INITIAL_USAGE_STATS: UsageStats = {
  queriesUsed: 125,
  monthlyLimit: 1000,
};

export const MOCK_TECHNICIANS: Technician[] = [
    { id: 'tech1', firstName: 'Jessica', lastName: 'Jones' },
    { id: 'tech2', firstName: 'Mike', lastName: 'Smith' },
    { id: 'tech3', firstName: 'Emily', lastName: 'White' },
];


// Generate a specific date for mocking, e.g., December 2023
const MOCK_YEAR = 2023;
const MOCK_MONTH = 11; // 0-indexed for December

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'apt1', title: 'Haircut and Styling', date: new Date(MOCK_YEAR, MOCK_MONTH, 1).toISOString().split('T')[0], time: '10:00-12:00', category: 'Haircut and Styling', status: 'completed', technicianId: 'tech1' },
    { id: 'apt2', title: 'Manicure', date: new Date(MOCK_YEAR, MOCK_MONTH, 1).toISOString().split('T')[0], time: '15:00-14:00', category: 'Manicure', status: 'completed', technicianId: 'tech2' },
    { id: 'apt3', title: 'Review', date: new Date(MOCK_YEAR, MOCK_MONTH, 2).toISOString().split('T')[0], time: '15:00-14:00', category: 'Test', status: 'scheduled', technicianId: 'tech1' },
    { id: 'apt4', title: 'Pedicure', date: new Date(MOCK_YEAR, MOCK_MONTH, 2).toISOString().split('T')[0], time: '11:00-12:00', category: 'Pedicure', status: 'completed', technicianId: 'tech3' },
    { id: 'apt5', title: 'Facial cleansing', date: new Date(MOCK_YEAR, MOCK_MONTH, 3).toISOString().split('T')[0], time: '9:30-10:00', category: 'Facial cleansing', status: 'completed', technicianId: 'tech2' },
    { id: 'apt6', title: 'Appointment', date: new Date(MOCK_YEAR, MOCK_MONTH, 7).toISOString().split('T')[0], time: '12:30-13:00', category: 'Appointment', status: 'scheduled', technicianId: 'tech1' },
    { id: 'apt7', title: 'Window repair', date: new Date(MOCK_YEAR, MOCK_MONTH, 7).toISOString().split('T')[0], time: '12:30-13:00', category: 'Window repair', status: 'scheduled', technicianId: 'tech3' },
    { id: 'apt8', title: 'Office construction', date: new Date(MOCK_YEAR, MOCK_MONTH, 8).toISOString().split('T')[0], time: '15:00-14:00', category: 'Office construction', status: 'cancelled', technicianId: 'tech2' },
    { id: 'apt9', title: 'Dental cleaning', date: new Date(MOCK_YEAR, MOCK_MONTH, 9).toISOString().split('T')[0], time: '10:00-11:00', category: 'Dental cleaning', status: 'completed', technicianId: 'tech1' },
    { id: 'apt10', title: 'Test', date: new Date(MOCK_YEAR, MOCK_MONTH, 9).toISOString().split('T')[0], time: '10:00-11:00', category: 'Test', status: 'completed', technicianId: 'tech3' },
    { id: 'apt11', title: 'Test 2', date: new Date(MOCK_YEAR, MOCK_MONTH, 10).toISOString().split('T')[0], time: '15:00-16:00', category: 'Test', status: 'completed', technicianId: 'tech1' },
    { id: 'apt12', title: 'Wall painting', date: new Date(MOCK_YEAR, MOCK_MONTH, 10).toISOString().split('T')[0], time: '15:00-16:00', category: 'Wall painting', status: 'scheduled', technicianId: 'tech2' },
    { id: 'apt13', title: 'Doctor\'s appointment', date: new Date(MOCK_YEAR, MOCK_MONTH, 14).toISOString().split('T')[0], time: '9:30-10:00', category: 'Doctor\'s appointment', status: 'scheduled', technicianId: 'tech3' },
    { id: 'apt14', title: 'Performance review', date: new Date(MOCK_YEAR, MOCK_MONTH, 15).toISOString().split('T')[0], time: '15:00-14:00', category: 'Performance review', status: 'completed', technicianId: 'tech1' },
    { id: 'apt15', title: 'Nutrition appointment', date: new Date(MOCK_YEAR, MOCK_MONTH, 16).toISOString().split('T')[0], time: '10:00-11:00', category: 'Nutrition appointment', status: 'cancelled', technicianId: 'tech2' },
    { id: 'apt16', title: 'Gardening', date: new Date(MOCK_YEAR, MOCK_MONTH, 21).toISOString().split('T')[0], time: '09:00-10:10', category: 'Gardening', status: 'completed', technicianId: 'tech1' },
    { id: 'apt17', title: 'Makeup', date: new Date(MOCK_YEAR, MOCK_MONTH, 22).toISOString().split('T')[0], time: '15:00-16:00', category: 'Makeup', status: 'scheduled', technicianId: 'tech3' },
    { id: 'apt18', title: 'Periodontics', date: new Date(MOCK_YEAR, MOCK_MONTH, 22).toISOString().split('T')[0], time: '10:00-11:00', category: 'Periodontics', status: 'completed', technicianId: 'tech2' },
    { id: 'apt19', title: 'Roof repair', date: new Date(MOCK_YEAR, MOCK_MONTH, 28).toISOString().split('T')[0], time: '12:00-13:00', category: 'Roof repair', status: 'completed', technicianId: 'tech1' },
];


export const NAIL_SALON_SCHEMA = `
-- Nail Salon POS Database Schema
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE technicians (
    technician_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    duration_minutes INT NOT NULL
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    technician_id INT NOT NULL,
    booking_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled', -- can be 'scheduled', 'completed', 'cancelled', 'no_show'
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (technician_id) REFERENCES technicians(technician_id)
);

CREATE TABLE booking_services (
    booking_service_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    service_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    unit_price DECIMAL(10,2) NOT NULL,
    current_stock INT DEFAULT 0,
    min_stock_level INT DEFAULT 10
);

CREATE TABLE product_sales (
    sale_id SERIAL PRIMARY KEY,
    booking_id INT,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Business Rules:
-- Revenue is calculated from bookings with status = 'completed'.
-- Profitability of services is based on total revenue from booking_services.
-- A new customer is one whose created_at is within the last 7 days.
-- Low stock products are those where current_stock is less than or equal to min_stock_level.
`;