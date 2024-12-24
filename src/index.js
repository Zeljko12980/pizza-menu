import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

// Sample pizza data (you can replace it with an API call)
const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with Italian olive oil and rosemary",
    price: 6,
    photoName: "pizzas/focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozzarella",
    price: 10,
    photoName: "pizzas/margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozzarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "pizzas/spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozzarella, mushrooms, and onion",
    price: 12,
    photoName: "pizzas/funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozzarella, and pepperoni",
    price: 15,
    photoName: "pizzas/salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozzarella, ham, arugula, and burrata cheese",
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
  const [pizzas, setPizzas] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5004/api/pizza")
      .then((response) => response.json())
      .then((data) => setPizzas(data));
  }, []);

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
  const isOnSpecialPage =
    location.pathname === "/admin" || location.pathname === "/admin/login" || location.pathname === "/admin/add-pizza";

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

    const orderData = {
      customerData,
      cart,
      totalPrice: cart.reduce((total, pizza) => total + pizza.price, 0),
    };

    console.log("Sending order data:", orderData); // Log the data being sent

    fetch("http://localhost:5004/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Order has been sent:", data);
        setCart([]);
        navigate("/"); // Redirect to home page
      })
      .catch((error) => {
        console.error("Error occurred while sending order:", error);
      });
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

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5004/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid login credentials");
      }

      const data = await response.json();
      console.log("Admin logged in:", data);
      navigate("/admin");
    } catch (error) {
     navigate("/admin");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard({ orders, setOrders }) {
  useEffect(() => {
    fetch("http://localhost:5004/api/order")
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, [setOrders]);

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <h3>Orders</h3>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            <strong>Customer:</strong> {order.customerData.name}{" "}
            {order.customerData.lastName}
            <br />
            <strong>Address:</strong> {order.customerData.address}
            <br />
            <strong>Phone:</strong> {order.customerData.phone}
            <br />
            <strong>Cart:</strong>
            <ul>
              {order.cart.map((pizza, i) => (
                <li key={i}>{pizza.name}</li>
              ))}
            </ul>
            <strong>Total Price:</strong> {order.totalPrice}$
          </li>
        ))}
      </ul>
    </div>
  );
}

// Add Pizza Component (for Admin)
function AddPizza() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [price, setPrice] = useState(0);
  const [soldOut, setSoldOut] = useState(false);
  const [photoName, setPhotoName] = useState("");

  const handleAddPizza = async (e) => {
    e.preventDefault();

    const newPizza = {
      name,
      ingredients,
      price,
      soldOut,
      photoName,
    };

    try {
      const response = await fetch("http://localhost:5004/api/pizza", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPizza),
      });

      if (!response.ok) {
        throw new Error("Failed to add pizza");
      }

      alert("Pizza added successfully!");
      setName("");
      setIngredients("");
      setPrice(0);
      setSoldOut(false);
      setPhotoName("");
    } catch (error) {
      alert("Failed to add pizza");
    }
  };

  return (
    <div className="add-pizza">
      <h2>Add New Pizza</h2>
      <form onSubmit={handleAddPizza}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="ingredients">Ingredients:</label>
          <input
            type="text"
            id="ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="photoName">Photo Name:</label>
          <input
            type="text"
            id="photoName"
            value={photoName}
            onChange={(e) => setPhotoName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="soldOut">Sold Out:</label>
          <input
            type="checkbox"
            id="soldOut"
            checked={soldOut}
            onChange={() => setSoldOut((prev) => !prev)}
          />
        </div>
        <button type="submit" className="btn">
          Add Pizza
        </button>
      </form>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
