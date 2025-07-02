// Default images configuration
export const FALLBACK_IMAGES = [
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/49ec1464-d899-400a-b608-c48c76b500d2/dfoxgpr-8b556792-f920-477a-b859-60e14a28dab1.jpg',
    'https://upload.wikimedia.org/wikipedia/en/0/0f/Tom_Holland_as_Spider-Man.jpg',
    'https://boundingintocomics.com/cdn-cgi/image/width=788,height=444,fit=crop,quality=80,format=auto,onerror=redirect,metadata=none/wp-content/uploads/iew.png'
  ];
  
  // Table-specific default images
  const TABLE_DEFAULT_IMAGES = {
    heroes: FALLBACK_IMAGES[0],
    villains: 'https://i.imgur.com/JQ9wfOj.jpg', // Default villain image
    dimensions: 'https://i.imgur.com/8Km9TLL.jpg', // Default dimension image
    media: 'https://i.imgur.com/3G5B7yK.jpg', // Default media image
    crossovers: 'https://i.imgur.com/4Q2Z3Xq.jpg' // Default crossover image
  };
  
  // Alt text generators for each table type
  const ALT_TEXT_GENERATORS = {
    heroes: (item) => item.alias || 'Spider-Hero',
    villains: (item) => item.name || 'Villain',
    dimensions: (item) => item.name || 'Dimension',
    media: (item) => item.title || 'Media',
    crossovers: (item) => `Crossover ${item.crossover_id}` || 'Crossover'
  };
  
  /**
   * Gets the appropriate default image for a given table
   * @param {string} table - The table name (heroes, villains, dimensions, media, crossovers)
   * @returns {string} The default image URL for that table
   */
  export const getDefaultImageForTable = (table) => {
    return TABLE_DEFAULT_IMAGES[table] || FALLBACK_IMAGES[0];
  };
  
  /**
   * Generates appropriate alt text for an item based on its table
   * @param {object} item - The item from the database
   * @param {string} table - The table name
   * @returns {string} The alt text for the image
   */
  export const getAltTextForItem = (item, table) => {
    const generator = ALT_TEXT_GENERATORS[table];
    return generator ? generator(item) : 'Spider-Verse item';
  };
  
  /**
   * Handles image loading errors by replacing with a fallback
   * @param {Event} e - The error event from the image
   */
  export const handleImageError = (e) => {
    if (!e.target) return;
    
    const currentSrc = e.target.src;
    const isFallback = FALLBACK_IMAGES.some(img => img === currentSrc);
    
    if (!isFallback) {
      const randomFallback = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      e.target.src = randomFallback;
      e.target.onerror = null; // Prevent infinite loop
      e.target.setAttribute('data-error', 'true');
    }
  };
  
  /**
   * Validates an image URL and returns either the valid URL or a fallback
   * @param {string} url - The URL to validate
   * @param {string} fallback - The fallback URL to use if validation fails
   * @returns {string} The validated URL or fallback
   */
  export const validateImageUrl = (url, fallback) => {
    if (!url) return fallback;
    
    try {
      // Basic URL validation
      new URL(url);
      
      // Check for common image extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidExtension = imageExtensions.some(ext => 
        url.toLowerCase().includes(ext)
      );
      
      return hasValidExtension ? url : fallback;
    } catch {
      return fallback;
    }
  };
  
  /**
   * Gets the complete image configuration for a table
   * @param {string} table - The table name
   * @returns {object} Configuration with default image and alt text generator
   */
  export const getImageConfigForTable = (table) => {
    return {
      defaultImage: getDefaultImageForTable(table),
      getAltText: (item) => getAltTextForItem(item, table)
    };
  };
  
  // Configuration for all tables
  export const IMAGE_CONFIG = {
    heroes: getImageConfigForTable('heroes'),
    villains: getImageConfigForTable('villains'),
    dimensions: getImageConfigForTable('dimensions'),
    media: getImageConfigForTable('media'),
    crossovers: getImageConfigForTable('crossovers')
  };