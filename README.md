# LC Waikiki Product Carousel

A responsive product recommendation carousel that integrates seamlessly with LC Waikiki's product pages, displaying "You Might Also Like" suggestions with full interactive functionality.

## 🌟 Features

- **Smart Page Detection**: Automatically detects and runs only on product pages (pages containing `.product-detail` element)
- **Responsive Design**: Optimized for all devices - desktop, tablet, and mobile
- **Dynamic Product Loading**: Fetches products from external API with localStorage caching
- **Interactive Favorites**: Click-to-favorite functionality with persistent storage
- **Smooth Navigation**: Touch/swipe support for mobile devices with elegant carousel controls
- **Performance Optimized**: Caches product data to minimize API calls

## 📱 Responsive Breakpoints

| Screen Size | Items Displayed | Device Type |
|-------------|-----------------|-------------|
| 1200px+ | 5 items | Desktop |
| 992px - 1200px | 4 items | Large Tablet |
| 576px - 992px | 3 items | Tablet |
| ≤576px | 2 items | Mobile |

## 🚀 Installation & Usage

### Quick Setup
1. Navigate to any **product page** on [LC Waikiki](https://www.lcwaikiki.com)
2. Choose a product to redirect the user to Product Page (ex: 
3. Open Chrome Developer Tools (F12)
4. Go to Console tab
5. Paste the JavaScript code and press Enter
6. For more usage, clear the Carousel, copy and paste this code block: **document.querySelector('.product-carousel-container')?.remove();**
7. Then, main code can be pasted.

![lccarpousel](https://github.com/user-attachments/assets/65d9cf29-0b4c-4ae7-9167-49761e66c3bb)


### Important Notes
- ⚠️ **Only works on product pages** - The carousel will only initialize on pages containing the `.product-detail` element
- The carousel automatically positions itself after the product detail section
- Code includes built-in detection to prevent duplicate carousels

## 🛠 Technical Implementation

### Architecture
- **Pure JavaScript**: No external dependencies required
- **Single File Solution**: Complete HTML, CSS, and JavaScript in one executable file
- **Console-Ready**: Designed to run directly from browser developer tools

### Data Flow
```
1. Page Detection → 2. API/Cache Check → 3. Product Loading → 4. HTML/CSS Injection → 5. Event Binding
```

### API Integration
- **Primary Source**: External products API via CORS proxy
- **Fallback**: Demo products for offline functionality
- **Caching Strategy**: localStorage with automatic cache validation

## 📊 Product Data Structure

```json
{
  "id": 1,
  "name": "Product Name",
  "price": 99.99,
  "oldPrice": 129.99,
  "img": "https://example.com/image.jpg",
  "url": "https://example.com/product"
}
```

## 🎨 Design Features

### Visual Elements
- **Product Cards**: Clean, minimal design matching LC Waikiki's aesthetic
- **Heart Icons**: Interactive favorites with visual feedback
- **Discount Badges**: Automatic percentage calculation for sale items
- **Navigation Arrows**: Smooth carousel controls with hover effects

### Mobile Optimizations
- Touch-friendly interface
- Swipe gesture support
- Optimized image loading
- Responsive typography
- Improved touch targets

## 💾 Local Storage Usage

### Stored Data
- `lc_waikiki_products`: Cached product data
- `lc_waikiki_favorites`: User's favorite product IDs

### Benefits
- Faster subsequent page loads
- Persistent user preferences
- Reduced API calls
- Offline fallback capability

## 🔧 Core Functions

| Function | Purpose |
|----------|---------|
| `init()` | Main initialization and orchestration |
| `loadProducts()` | API fetching with cache management |
| `buildHTML()` | Dynamic DOM structure creation |
| `buildCSS()` | Responsive styling injection |
| `updateCarousel()` | Navigation and responsive updates |
| `toggleFavorite()` | Favorite state management |

## 📱 Mobile Features

- **Swipe Navigation**: Natural left/right swipe gestures
- **Touch Optimization**: Larger touch targets for mobile
- **Responsive Images**: Optimized loading for different screen densities
- **Smooth Animations**: Hardware-accelerated transitions

## 🎯 Use Cases

### For Developers
- Product recommendation system implementation
- Responsive carousel component reference
- localStorage integration example
- Mobile-first design patterns

### For E-commerce
- Cross-selling product suggestions
- User engagement enhancement
- Mobile shopping experience improvement
- Personalized recommendations

## 📝 Browser Compatibility

- ✅ Chrome (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🔍 Troubleshooting

### Common Issues

**Carousel not appearing?**
- Ensure you're on a product page (must contain `.product-detail` element)
- Check browser console for error messages
- Verify JavaScript execution completed successfully

**Products not loading?**
- Check network connection
- API might be temporarily unavailable (fallback products will load)
- Clear localStorage and try again

**Mobile display issues?**
- Refresh the page after code execution
- Ensure viewport meta tag is present
- Check for CSS conflicts with existing styles

## 📄 Code Structure

```
Main Function (IIFE)
├── Configuration & Variables
├── Initialization Logic
├── Data Management
│   ├── Product Loading
│   ├── Cache Management
│   └── Favorites Handling
├── DOM Manipulation
│   ├── HTML Generation
│   ├── CSS Injection
│   └── Event Binding
└── Responsive Updates
    ├── Breakpoint Detection
    ├── Layout Adjustments
    └── Touch Handling
```

## 🚫 Limitations

- Only functions on LC Waikiki product pages
- Requires `.product-detail` element for proper positioning
- Dependent on external API availability
- Browser console execution required

## 📈 Performance Notes

- Lazy loading implementation for images
- Debounced resize events for optimal performance
- Efficient DOM manipulation
- Minimal memory footprint
- Optimized for mobile devices

---

**Note**: This carousel is specifically designed for LC Waikiki's product pages and includes intelligent page detection to ensure it only runs in the appropriate context.
