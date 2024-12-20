import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "pizzas/prosciutto.jpg",
    soldOut: false,
  },
];

function App() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]); // Track orders for the admin

  const handleAddToCart = (pizza) => {
    setCart((prevCart) => [...prevCart, pizza]);
  };

  return (
    <Router>
      <div className="container">
        <Header />
        <Routes>
          <Route path="/" element={<Home handleAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/admin" element={<AdminDashboard orders={orders} setOrders={setOrders} />} />
          <Route path="/admin/login" element={<AdminLogin setOrders={setOrders} />} />
          <Route path="/admin/add-pizza" element={<AddPizza />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function Header() {
  return (
    <header className="header">
      <h1>Fast React Pizza Co.</h1>
    </header>
  );
}

function Home({ handleAddToCart }) {
  const pizzas = pizzaData;
  return (
    <main className="menu">
      <h2>Our menu</h2>
      <ul className="pizzas">
        {pizzas.map((pizza) => (
          <Pizza pizzaObj={pizza} key={pizza.name} handleAddToCart={handleAddToCart} />
        ))}
      </ul>
    </main>
  );
}

function Pizza({ pizzaObj, handleAddToCart }) {
  return (
    <li className={`pizza ${pizzaObj.soldOut ? "sold-out" : ""}`}>
      <img src={pizzaObj.photoName} alt={pizzaObj.name} />
      <div>
        <h3>{pizzaObj.name}</h3>
        <p>{pizzaObj.ingredients}</p>
        <div className="pizza-footer">
          <span>{pizzaObj.soldOut ? "SOLD OUT" : `${pizzaObj.price}$`}</span>
          <button
            className="btn"
            disabled={pizzaObj.soldOut}
            onClick={() => handleAddToCart(pizzaObj)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </li>
  );
}

function Footer() {
  const location = useLocation();

  // Check if we are on one of the specific pages (admin, admin login, or add pizza)
  const isOnSpecialPage = location.pathname === "/admin" || location.pathname === "/admin/login" || location.pathname === "/admin/add-pizza";

  return (
    <footer className="footer">
      {isOnSpecialPage ? (
        <Link to="/" className="btn">
          Back to Home Page
        </Link>
      ) : (
        <>
          {location.pathname !== "/cart" && (
            <Link to="/cart" className="btn">
              View Cart
            </Link>
          )}
          {location.pathname !== "/admin" && location.pathname !== "/admin/login" && (
            <Link to="/admin/login" className="btn">
              Admin Login
            </Link>
          )}
        </>
      )}
    </footer>
  );
}


function Cart({ cart, setCart }) {
  const [customerData, setCustomerData] = useState({
    name: "",
    lastName: "",
    address: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();

    console.log("Order has been sent:", {
      customerData,
      cart,
      totalPrice: cart.reduce((total, pizza) => total + pizza.price, 0),
    });

    setCart([]);
    navigate("/"); // Redirect to the home page
  };

  const totalPrice = cart.reduce((total, pizza) => total + pizza.price, 0);

  return (
    <div className="cart">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty. Add some pizzas!</p>
      ) : (
        <>
          <ul>
            {cart.map((pizza, index) => (
              <li key={index} className="cart-item">
                <img src={pizza.photoName} alt={pizza.name} width="50" />
                <span>{pizza.name} - {pizza.price}$ (x1)</span>
              </li>
            ))}
          </ul>
          <p>Total: {totalPrice}$</p>
        </>
      )}

      <h3>Delivery Information</h3>
      <form onSubmit={handleConfirmOrder}>
        <div>
          <label htmlFor="name">First Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={customerData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={customerData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customerData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn">
          Confirm Order
        </button>
      </form>
    </div>
  );
}

// Admin Login Component
function AdminLogin({ setOrders }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      setOrders([
        {
          id: 1,
          customerFirstName: "John",
          customerLastName: "Doe",
          address: "123 Elm Street, Springfield",
          pizzas: [
            { name: "Pizza Margherita", quantity: 2 },
            { name: "Pizza Spinaci", quantity: 1 },
          ],
          total: 22,
        },
        {
          id: 2,
          customerFirstName: "Jane",
          customerLastName: "Smith",
          address: "456 Oak Avenue, Springfield",
          pizzas: [{ name: "Pizza Prosciutto", quantity: 1 }],
          total: 18,
        },
      ]);
      navigate("/admin");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin} className="btn">
        Login
      </button>
    </div>
  );
}


function AdminDashboard({ orders, setOrders }) {
  const [newPizza, setNewPizza] = useState({
    name: "",
    price: "",
    photoName: "",
  });

  const navigate = useNavigate();

  const handleAcceptOrder = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    alert("Order Accepted!");
  };

  const handleLogout = () => {
    navigate("/"); // Navigate to home page
  };

  const handleAddPizza = () => {
    if (newPizza.name && newPizza.price && newPizza.photoName) {
      setOrders((prevOrders) => [
        ...prevOrders,
        {
          id: orders.length + 1, // New order id
          customerFirstName: "New",
          customerLastName: "Customer",
          address: "New Address",
          pizzas: [
            { name: newPizza.name, quantity: 1 },
          ],
          total: newPizza.price,
        },
      ]);
      alert("New pizza added!");
      setNewPizza({ name: "", price: "", photoName: "" }); // Reset form
    } else {
      alert("Please fill all the fields to add a pizza.");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <button onClick={handleLogout} className="btn">Log Out</button>
        <button onClick={() => navigate("/admin/add-pizza")} className="btn">Add New Pizza</button>
      </div>

      <div className="main-content">
        <h2>Admin Dashboard</h2>
        <h3>Orders</h3>
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <h4>{order.customerFirstName} {order.customerLastName}</h4>
              <p><strong>Address:</strong> {order.address}</p>
              <div>
                {order.pizzas.map((pizza, index) => (
                  <div key={index}>
                    <p>{pizza.name} - {pizza.quantity} x {pizza.price}$</p>
                  </div>
                ))}
              </div>
              <p>Total: ${order.total}</p>
              <button onClick={() => handleAcceptOrder(order.id)} className="btn">
                Accept Order
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


function AddPizza() {
  const [newPizza, setNewPizza] = useState({
    name: "",
    ingredients: "",
    price: "",
    photoName: "",
    soldOut: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPizza((prevPizza) => ({
      ...prevPizza,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPizza.name && newPizza.ingredients && newPizza.price && newPizza.photoName) {
      // Here, you would typically update the pizzaData state or send the new pizza to the backend
      alert("New pizza added!");
      navigate("/admin"); // Navigate back to admin dashboard
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <div className="add-pizza">
      <h2>Add New Pizza</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Pizza Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newPizza.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients:</label>
          <input
            type="text"
            id="ingredients"
            name="ingredients"
            value={newPizza.ingredients}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price ($):</label>
          <input
            type="number"
            id="price"
            name="price"
            value={newPizza.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="photoName">Photo (Image URL):</label>
          <input
            type="text"
            id="photoName"
            name="photoName"
            value={newPizza.photoName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="soldOut">Sold Out:</label>
          <input
            type="checkbox"
            id="soldOut"
            name="soldOut"
            checked={newPizza.soldOut}
            onChange={(e) => setNewPizza({ ...newPizza, soldOut: e.target.checked })}
          />
        </div>
        <button type="submit" className="btn">Add Pizza</button>
      </form>
    </div>
  );
}





const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
