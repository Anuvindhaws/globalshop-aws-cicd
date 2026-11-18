
import { useMemo, useState } from "react";
import "./App.css";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700"
  },
  {
    id: 2,
    name: "Classic Wrist Watch",
    category: "Fashion",
    price: 1899,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700"
  },
  {
    id: 3,
    name: "Running Shoes",
    category: "Fashion",
    price: 2999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700"
  },
  {
    id: 4,
    name: "Smart Camera",
    category: "Electronics",
    price: 5499,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700"
  },
  {
    id: 5,
    name: "Travel Backpack",
    category: "Accessories",
    price: 1499,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700"
  },
  {
    id: 6,
    name: "Sunglasses",
    category: "Accessories",
    price: 999,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700"
  }
];

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);

  const filteredProducts = useMemo(() => products.filter(product => {
    return product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || product.category === category);
  }), [search, category]);

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#home">
          Global<span>Shop</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
        </nav>

        <div className="cart">
          🛒 Cart <span>{cart.length}</span>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">WELCOME TO GLOBALSHOP</p>
            <h1>
              Discover products.<br />
              Experience more.
            </h1>
            <p>
              Shop your favourite products with a simple and seamless shopping experience.
            </p>
            <a href="#products" className="shop-button">
              Explore Products →
            </a>
          </div>
        </section>

        {/* CI/CD deployment test banner */}
        <div
          style={{
            textAlign: "center",
            padding: "14px",
            background: "#e8f5e9",
            color: "#2e7d32",
            fontWeight: "600"
          }}
        >
          🚀 Latest Update: GlobalShop CI/CD Automated Deployment Test Successful!
        </div>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR COLLECTION</p>
              <h2>Featured Products</h2>
            </div>

            <input
              className="search"
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filters">
            {["All", "Electronics", "Fashion", "Accessories"].map(item => (
              <button
                key={item}
                className={category === item ? "filter active" : "filter"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <article className="product-card" key={product.id}>
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />

                <div className="product-info">
                  <p className="category">{product.category}</p>
                  <h3>{product.name}</h3>

                  <div className="product-bottom">
                    <strong>
                      ₹{product.price.toLocaleString("en-IN")}
                    </strong>

                    <button
                      onClick={() =>
                        setCart(current => [...current, product.id])
                      }
                    >
                      Add to Cart +
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredProducts.length === 0 && (
              <p>No products found.</p>
            )}
          </div>
        </section>

        <section className="about" id="about">
          <h2>Shopping made simple.</h2>
          <p>
            GlobalShop brings quality products and a smooth shopping experience together.
          </p>
        </section>
      </main>

      <footer>
        <a className="logo" href="#home">
          Global<span>Shop</span>
        </a>
        <p>© 2026 GlobalShop. Built with React and AWS.</p>
      </footer>
    </div>
  );
}

export default App;
