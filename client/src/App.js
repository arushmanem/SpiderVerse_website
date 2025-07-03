import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const cors = require('cors');

app.use(cors({
  origin: 'https://arushmanem.github.io'  // ✅ Only allow your frontend
}));


// Image configuration
const IMAGE_CONFIG = {
  heroes: {
    default: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/49ec1464-d899-400a-b608-c48c76b500d2/dfoxgpr-8b556792-f920-477a-b859-60e14a28dab1.jpg',
    alt: (item) => item.alias || 'Spider-Hero'
  },
  villains: {
    default: 'https://i.imgur.com/JQ9wfOj.jpg',
    alt: (item) => item.name || 'Villain'
  },
  dimensions: {
    default: 'https://i.imgur.com/8Km9TLL.jpg',
    alt: (item) => item.name || 'Dimension'
  },
  media: {
    default: 'https://i.imgur.com/3G5B7yK.jpg',
    alt: (item) => item.title || 'Media'
  },
  crossovers: {
    default: 'https://i.imgur.com/4Q2Z3Xq.jpg',
    alt: (item) => `Crossover ${item.crossover_id}` || 'Crossover'
  },
  merchandise: {
    default: 'https://i.imgur.com/8Km9TLL.jpg',
    alt: (item) => item.item_name || 'Merchandise'
  }
};

const FALLBACK_IMAGES = [
  IMAGE_CONFIG.heroes.default,
  'https://upload.wikimedia.org/wikipedia/en/0/0f/Tom_Holland_as_Spider-Man.jpg',
  'https://boundingintocomics.com/cdn-cgi/image/width=788,height=444,fit=crop,quality=80,format=auto,onerror=redirect,metadata=none/wp-content/uploads/iew.png'
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? (
          <HomePage />
        ) : (
          <LoginPage 
            setIsAuthenticated={setIsAuthenticated}
            loginError={loginError}
            setLoginError={setLoginError}
          />
        )
      } />
      <Route path="/:table" element={isAuthenticated ? <HomePage /> : <LoginPage 
        setIsAuthenticated={setIsAuthenticated}
        loginError={loginError}
        setLoginError={setLoginError}
      />} />
      <Route path="/:table/:id" element={isAuthenticated ? <DetailPage /> : <LoginPage 
        setIsAuthenticated={setIsAuthenticated}
        loginError={loginError}
        setLoginError={setLoginError}
      />} />
      <Route path="/merchandise" element={isAuthenticated ? <MerchandisePage /> : <LoginPage 
        setIsAuthenticated={setIsAuthenticated}
        loginError={loginError}
        setLoginError={setLoginError}
      />} />
    </Routes>
  );
}

function LoginPage({ setIsAuthenticated, loginError, setLoginError }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    if (credentials.username.toLowerCase() === 'spider' && 
        credentials.password === 'web123') {
      setIsAuthenticated(true);
    } else {
      setLoginError('Invalid credentials. Try "spider" and "web123"');
    }
  };

  return (
    <div className="login-container">
      <div className="login-portal">
        <img 
          src="https://assets.turbologo.com/blog/en/2019/10/19084946/spiderman-logo-illustration.jpg" 
          alt="Spider-Verse Portal" 
          className="portal-image"
        />
        <div className="login-form">
          <h2>SPIDER-VERSE ARCHIVES</h2>
          <p className="subtitle">Access Restricted to Authorized Web-Slingers</p>
          
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Codenames</label>
              <input
                type="text"
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Enter spider-codename"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Web Key</label>
              <input
                type="password"
                id="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter web-key sequence"
              />
            </div>
            
            {loginError && <div className="error-message">{loginError}</div>}
            
            <button type="submit" className="login-button">
              <span className="spinner">🕷️</span> Authenticate
            </button>
          </form>
          
          <div className="hint">
            <p>Hint: Try "spider" and "web123"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [randomFact, setRandomFact] = useState('');
  const [comicCover, setComicCover] = useState('');
  const [featuredCharacter, setFeaturedCharacter] = useState({
    name: 'Spider-Man 2099',
    image: 'https://wallpaper.dog/large/20676602.jpg',
    description: 'Miguel O\'Hara from Nueva York in the year 2099!'
  });
  
  const navigate = useNavigate();
  const { table: urlTable } = useParams();

  const tableLabels = {
    heroes: "🕷️ Spider-Heroes",
    villains: "👹 Sinister Six",
    dimensions: "🌌 Dimensions",
    media: "🎬 Media Appearances",
    crossovers: "🔄 Crossovers",
    merchandise: "🛍️ Multiverse Store"
  };

  useEffect(() => {
    axios.get('http://localhost:3001/api/tables')
      .then(res => setTables(res.data))
      .catch(err => console.error("Error loading tables:", err));

    const facts = [
      "Did you know there are over 1000 known Spider-People in the multiverse?",
      "Spider-Gwen's universe is designated as Earth-65 in the Marvel Multiverse.",
      "Miles Morales was the first Spider-Man to appear in the Ultimate Universe (Earth-1610).",
      "Spider-Ham is from Earth-8311 where all characters are anthropomorphic animals.",
      "The Spider-Verse event first brought together Spider-People from across dimensions in 2014."
    ];
    setRandomFact(facts[Math.floor(Math.random() * facts.length)]);

    const covers = [
      'https://i.pinimg.com/736x/56/a9/c0/56a9c04f3bc77870735e62302e8790bf.jpg',
      'https://majorspoilers.com/wp-content/uploads/2023/10/MOHSM20992024001-5_Nauck_ConnectingF.jpg',
      'https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/10/10-Smartest-Decisions-Spider-Man-Ever-Made-(2).jpg?q=70&fit=contain&w=1200&h=628&dpr=1',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7LPDQ-7hXhKlDZhkr2JQid6gE56NSTHYb0g&s'
    ];
    setComicCover(covers[Math.floor(Math.random() * covers.length)]);
  }, []);

  useEffect(() => {
    if (!urlTable) {
      setSelectedTable('');
      setTableData([]);
      setSearchTerm('');
    } else if (tables.includes(urlTable) || urlTable === 'merchandise') {
      setSelectedTable(urlTable);
    }
  }, [urlTable, tables]);

  useEffect(() => {
    if (!selectedTable || selectedTable === 'merchandise') {
      setTableData([]);
      return;
    }
    
    axios.get(`http://localhost:3001/api/${selectedTable}/data`, {
      params: { search: searchTerm }
    })
    .then(res => setTableData(res.data))
    .catch(err => {
      console.error('API Error:', err.response?.data || err.message);
      setTableData([]);
    });
  }, [selectedTable, searchTerm]);

  const handleImageError = (e) => {
    if (!FALLBACK_IMAGES.includes(e.target.src)) {
      const randomFallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      e.target.src = randomFallback;
      e.target.onerror = null;
      e.target.setAttribute('data-error', 'true');
    }
  };

  const handleTableChange = (e) => {
    const value = e.target.value;
    setSelectedTable(value);
    setSearchTerm('');
    
    if (value === '') {
      navigate('/');
    } else if (value === 'merchandise') {
      navigate('/merchandise');
    } else {
      navigate(`/${value}`);
    }
  };

  const renderCardContent = (item) => {
    switch(selectedTable) {
      case 'heroes':
        return (
          <>
            <h3>{item.alias}</h3>
            {item.real_name && <p>{item.real_name}</p>}
          </>
        );
      case 'villains':
        return (
          <>
            <h3>{item.name}</h3>
            {item.alias && <p>AKA {item.alias}</p>}
          </>
        );
      case 'dimensions':
        return <h3>{item.name}</h3>;
      case 'media':
        return <h3>{item.title}</h3>;
      case 'crossovers':
        return <h3>Crossover #{item.crossover_id}</h3>;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="app-container">
        <div className="main-content">
          <h1>SPIDER-VERSE ARCHIVES</h1>
          
          <div className="explorer-nav">
            <select
              value={selectedTable}
              onChange={handleTableChange}
            >
              <option value="">🔍 Explore The Multiverse</option>
              {tables.map(table => (
                <option key={table} value={table}>
                  {tableLabels[table] || table}
                </option>
              ))}
            </select>

            {selectedTable && selectedTable !== 'crossovers' && selectedTable !== 'merchandise' && (
              <input
                type="text"
                placeholder={`Search ${tableLabels[selectedTable] || selectedTable}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          </div>

          <div className="multiverse-grid">
            {selectedTable === 'merchandise' ? (
              <div className="welcome-screen">
                <div className="welcome-content">
                  <img 
                    src="https://assets.turbologo.com/blog/en/2019/10/19084946/spiderman-logo-illustration.jpg" 
                    alt="Spider-Verse portal"
                    className="welcome-image"
                  />
                  <h2>Welcome to the Multiverse Store!</h2>
                  <p>Redirecting you to our merchandise collection...</p>
                </div>
              </div>
            ) : selectedTable ? (
              tableData.length > 0 ? (
                tableData.map(item => (
                  <Link 
                    to={`/${selectedTable}/${item.id}`}
                    state={{ fromTable: selectedTable }}
                    key={item.id}
                    className="multiverse-card"
                  >
                    <img 
                      src={item.image_url || IMAGE_CONFIG[selectedTable]?.default || FALLBACK_IMAGES[0]} 
                      alt={IMAGE_CONFIG[selectedTable]?.alt(item) || 'Spider-Verse item'}
                      onError={handleImageError}
                      onLoad={(e) => {
                        e.target.style.opacity = 1;
                        e.target.removeAttribute('data-error');
                      }}
                      style={{ opacity: 0 }}
                      loading="lazy"
                    />
                    {renderCardContent(item)}
                    {item.universe_id && <span>🌍 Universe #{item.universe_id}</span>}
                  </Link>
                ))
              ) : (
                <div className="no-results">
                  <img 
                    src="https://i.redd.it/i-traced-and-remade-the-sad-spider-man-frame-from-94-v0-zvi4vrmq6fv91.png?width=2131&format=png&auto=webp&s=b05c292f1b19f763b2baec060c38690879150323" 
                    alt="No results found"
                    className="no-results-image"
                  />
                  <p>No spider-signals detected for "{searchTerm}"</p>
                  <button onClick={() => setSearchTerm('')}>Clear search</button>
                </div>
              )
            ) : (
              <div className="welcome-screen">
                <div className="welcome-content">
                  <img 
                    src="https://assets.turbologo.com/blog/en/2019/10/19084946/spiderman-logo-illustration.jpg" 
                    alt="Spider-Verse portal"
                    className="welcome-image"
                  />
                  <h2>Welcome, True Believer!</h2>
                  <p>Ready to explore the infinite Spider-Verse?</p>
                  <p>Select a dimension from the menu above to begin your journey.</p>
                  <div className="spider-credits">
                    <p>Brought to you by your friendly neighborhood Spider-Archives</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Did You Know?</h3>
            <p>{randomFact}</p>
            <img 
              src={comicCover} 
              alt="Spider-Verse comic cover" 
              className="comic-cover"
              onError={(e) => {
                e.target.src = 'https://i.imgur.com/3G5B7yK.jpg';
              }}
            />
          </div>

          <div className="sidebar-card">
            <h3>Multiverse Timeline</h3>
            <ul className="timeline">
              <li>
                <strong>2014</strong> - First Spider-Verse comic event
              </li>
              <li>
                <strong>2018</strong> - Into the Spider-Verse movie
              </li>
              <li>
                <strong>2021</strong> - Spider-Man: No Way Home
              </li>
              <li>
                <strong>2023</strong> - Across the Spider-Verse
              </li>
              <li>
                <strong>2027</strong> - Beyond the Spider-Verse (coming soon)
              </li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Featured Character</h3>
            <img
              src={featuredCharacter.image}
              alt={featuredCharacter.name}
              className="featured-character"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGES[0];
              }}
            />
            <p>This week: <strong>{featuredCharacter.name}</strong></p>
            <p>{featuredCharacter.description}</p>
            <button 
              className="visit-store-btn"
              onClick={() => navigate('/merchandise')}
            >
              Visit Multiverse Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPage() {
  const { table, id } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleImageError = (e) => {
    if (!FALLBACK_IMAGES.includes(e.target.src)) {
      const randomFallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      e.target.src = randomFallback;
      e.target.onerror = null;
      e.target.setAttribute('data-error', 'true');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get(`http://localhost:3001/api/${table}/${id}`)
      .then(res => {
        setItem(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading item:', err);
        setIsLoading(false);
      });
  }, [table, id]);

  if (isLoading) {
    return (
      <div className="App">
        <div className="loading">🌀 Web-slinging through dimensions...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="App">
        <div className="error">⚠️ Could not load this multiverse entry</div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="detail-page">
        <button onClick={() => navigate(location.state?.fromTable ? `/${location.state.fromTable}` : '/')}>
          ← Back to Multiverse
        </button>
        <div className="hero-header">
          <img 
            src={item.image_url || IMAGE_CONFIG[table]?.default || FALLBACK_IMAGES[0]} 
            className="hero-image" 
            onError={handleImageError}
            loading="lazy"
            alt={IMAGE_CONFIG[table]?.alt(item) || 'Spider-Verse item'}
          />
          <div>
            <h2>{item.alias || item.name || item.title || `Crossover #${item.crossover_id}`}</h2>
            {item.real_name && <p><strong>Secret Identity:</strong> {item.real_name}</p>}
          </div>
        </div>

        <div className="stats">
          {item.powers && <p><strong>Powers:</strong> {item.powers}</p>}
          {item.threat_level && (
            <p><strong>Threat Level:</strong> {"☠️".repeat(item.threat_level)}</p>
          )}
          {item.first_appearance && (
            <p><strong>First Appearance:</strong> {item.first_appearance}</p>
          )}
          {item.release_year && (
            <p><strong>Release Year:</strong> {item.release_year}</p>
          )}
          {item.visual_style && (
            <p><strong>Visual Style:</strong> {item.visual_style}</p>
          )}
          {item.physics_rules && (
            <p><strong>Physics Rules:</strong> {item.physics_rules}</p>
          )}
          {item.media_type && (
            <p><strong>Media Type:</strong> {item.media_type}</p>
          )}
          {item.imdb_rating && (
            <p><strong>IMDB Rating:</strong> {item.imdb_rating}</p>
          )}
          {item.significance && (
            <p><strong>Significance:</strong> {item.significance}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function MerchandisePage() {
  const [merchandise, setMerchandise] = useState([]);
  const [filteredMerch, setFilteredMerch] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('spiderVerseCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('spiderVerseCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Fetch merchandise
    axios.get('http://localhost:3001/api/merchandise')
      .then(res => {
        setMerchandise(res.data);
        setFilteredMerch(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading merchandise:', err);
        setIsLoading(false);
      });

    // Fetch dimensions for filter
    axios.get('http://localhost:3001/api/dimensions/data')
      .then(res => setDimensions(res.data))
      .catch(err => console.error('Error loading dimensions:', err));
  }, []);

  const filterByDimension = (dimensionId) => {
    if (dimensionId === 'all') {
      setFilteredMerch(merchandise);
    } else {
      axios.get('http://localhost:3001/api/merchandise', { params: { dimension: dimensionId } })
        .then(res => setFilteredMerch(res.data))
        .catch(err => {
          console.error('Error filtering:', err);
          setFilteredMerch([]);
        });
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item_id === item.item_id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item_id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.item_id === itemId);
      if (existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.item_id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item.item_id !== itemId);
    });
  };

  const emptyCart = () => {
    setCart([]);
  };

  return (
    <div className="merchandise-page">
      <h1>SPIDER-VERSE MERCHANDISE</h1>
      
      <div className="merchandise-controls">
        <div className="dimension-filters">
          <button 
            onClick={() => filterByDimension('all')}
            className="dimension-filter-btn"
          >
            All Dimensions
          </button>
          {dimensions.map(dim => (
            <button
              key={dim.dimension_id}
              onClick={() => filterByDimension(dim.dimension_id)}
              className="dimension-filter-btn"
              style={{ 
                backgroundColor: getDimensionColor(dim.dimension_id),
                color: dim.dimension_id === 3 ? '#333' : '#fff'
              }}
            >
              {dim.name}
            </button>
          ))}
        </div>
        
        <button 
          className="cart-toggle"
          onClick={() => setIsCartOpen(!isCartOpen)}
        >
          🛒 Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
        </button>
      </div>

      {isLoading ? (
        <div className="loading">🌀 Web-slinging through dimensions...</div>
      ) : (
        <div className="merchandise-grid">
          {filteredMerch.length > 0 ? (
            filteredMerch.map(item => (
              <MerchandiseCard 
                key={item.item_id} 
                item={item} 
                addToCart={addToCart}
              />
            ))
          ) : (
            <div className="no-results">
              <img 
                src="https://i.redd.it/i-traced-and-remade-the-sad-spider-man-frame-from-94-v0-zvi4vrmq6fv91.png" 
                alt="No merchandise found"
                className="no-results-image"
              />
              <p>No merchandise detected in this dimension</p>
            </div>
          )}
        </div>
      )}

      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Your Multiverse Cart</h3>
          <button onClick={() => setIsCartOpen(false)}>×</button>
        </div>
        {cart.length > 0 ? (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.item_id} className="cart-item">
                  <img 
                    src={item.image_url} 
                    alt={item.item_name}
                    onError={handleImageError}
                  />
                  <div className="cart-item-details">
                    <h4>{item.item_name}</h4>
                    <p>${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.item_id)}
                    className="remove-item-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              Total: ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </div>
            <div className="cart-actions">
              <button 
                className="empty-cart-btn"
                onClick={emptyCart}
              >
                Empty Cart
              </button>
              <button className="checkout-btn">Checkout</button>
            </div>
          </>
        ) : (
          <p className="empty-cart">Your cart is empty across all dimensions!</p>
        )}
      </div>
      {isCartOpen && <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />}
    </div>
  );
}

function MerchandiseCard({ item, addToCart }) {
  return (
    <div className="merchandise-card">
      <img 
        src={item.image_url} 
        alt={item.item_name}
        onError={handleImageError}
        className="merchandise-image"
      />
      <div className="merchandise-info">
        <h3>{item.item_name}</h3>
        <p className="dimension-tag" style={{ 
          backgroundColor: getDimensionColor(item.dimension_id),
          color: item.dimension_id === 3 ? '#333' : '#fff'
        }}>
          {item.dimension_name}
        </p>
        <p className="merchandise-description">{item.description}</p>
        <div className="merchandise-footer">
          <span className="price">${item.price.toFixed(2)}</span>
          {item.is_exclusive && (
            <span className="exclusive-badge">EXCLUSIVE</span>
          )}
          <button 
            onClick={() => addToCart(item)}
            className="add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function getDimensionColor(dimensionId) {
  const colors = {
    1: '#e23636', // Earth-616
    2: '#000000', // Earth-1610
    3: '#ff85a2', // Earth-65
    4: '#00ffff', // Earth-928
    5: '#ffde59'  // Earth-8311
  };
  return colors[dimensionId] || '#cccccc';
}

function handleImageError(e) {
  if (!e.target) return;
  
  const currentSrc = e.target.src;
  const isFallback = FALLBACK_IMAGES.some(img => img === currentSrc);
  
  if (!isFallback) {
    const randomFallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    e.target.src = randomFallback;
    e.target.onerror = null;
    e.target.setAttribute('data-error', 'true');
  }
}

export default App;
