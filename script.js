(() => {

    console.clear();
    

    console.log('Current URL:', window.location.href);
    console.log('Looking for .product-detail element...');
    

    const productDetailElement = document.querySelector('.product-detail');
    const existingCarousel = document.querySelector('.product-carousel-container');
    
    console.log('Product detail element found:', !!productDetailElement);
    console.log('Existing carousel found:', !!existingCarousel);

    if (!productDetailElement) {
        console.log('Not on a product page - .product-detail element not found');
        console.log('This code should only run on individual product pages');
        return;
    }
    
    if (existingCarousel) {
        console.log('Product carousel already exists');
        return;
    }

    console.log('Initializing LC Waikiki Product Carousel on product page...');

    const PRODUCTS_URL = 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json';
    const STORAGE_KEY = 'lc_waikiki_products';
    const FAVORITES_KEY = 'lc_waikiki_favorites';

    let products = [];
    let favorites = [];
    let currentSlide = 0;
    let itemsPerView = 6;

    const init = () => {
        console.log('Loading favorites and products...');
        loadFavorites();
        loadProducts().then(() => {
            console.log(`Loaded ${products.length} products`);
            buildHTML();
            buildCSS();
            setEvents();
            updateCarousel();
            console.log('Product carousel initialized successfully!');
        }).catch(error => {
            console.error('Failed to initialize carousel:', error);
        });
    };

    const loadFavorites = () => {
        try {
            favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
        } catch (e) {
            favorites = [];
        }
    };

    const saveFavorites = () => {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        } catch (error) {
            console.warn('Could not save favorites to localStorage');
        }
    };

    const loadProducts = async () => {
        try {
            console.log('Loading products...');
            
            const cachedProducts = localStorage.getItem(STORAGE_KEY);
            if (cachedProducts) {
                products = JSON.parse(cachedProducts);
                console.log('Products loaded from cache:', products.length, 'items');
                return;
            }

            console.log('Fetching products from API...');
            const proxyUrl = 'https://api.allorigins.win/get?url=';
            const targetUrl = encodeURIComponent(PRODUCTS_URL);
            const response = await fetch(proxyUrl + targetUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            products = JSON.parse(data.contents);
            console.log('Products fetched successfully:', products.length, 'items');
            
            // Try to cache the products
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
                console.log('Products cached to localStorage');
            } catch (storageError) {
                console.warn('LocalStorage quota exceeded, proceeding without cache');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            // Fallback to demo products if API fails
            products = [
                {id: 1, name: "Standart Kalıp Erkek Tişört", price: 99.99, oldPrice: 129.99, image: "https://via.placeholder.com/300x300/000000/FFFFFF?text=T-Shirt", url: "#"},
                {id: 2, name: "Slim Fit Erkek Gömlek", price: 149.99, image: "https://via.placeholder.com/300x300/333333/FFFFFF?text=Shirt", url: "#"},
                {id: 3, name: "Rahat Kesim Erkek Pantolon", price: 179.99, oldPrice: 199.99, image: "https://via.placeholder.com/300x300/666666/FFFFFF?text=Pants", url: "#"},
                {id: 4, name: "Erkek Spor Ayakkabı", price: 299.99, image: "https://via.placeholder.com/300x300/999999/FFFFFF?text=Shoes", url: "#"},
                {id: 5, name: "Erkek Ceket", price: 249.99, oldPrice: 299.99, image: "https://via.placeholder.com/300x300/CCCCCC/000000?text=Jacket", url: "#"},
                {id: 6, name: "Erkek Kazak", price: 189.99, image: "https://via.placeholder.com/300x300/EEEEEE/000000?text=Sweater", url: "#"},
                {id: 7, name: "Erkek Şort", price: 89.99, oldPrice: 119.99, image: "https://via.placeholder.com/300x300/AAAAAA/000000?text=Shorts", url: "#"},
                {id: 8, name: "Erkek Polo Tişört", price: 129.99, image: "https://via.placeholder.com/300x300/777777/FFFFFF?text=Polo", url: "#"}
            ];
            console.log('Using demo products as fallback');
        }
    };

    const buildHTML = () => {
        const html = `
            <div class="product-carousel-container">
                <div class="carousel-header">
                    <h2 class="carousel-title">You Might Also Like</h2>
                </div>
                <div class="carousel-wrapper">
                    <button class="carousel-nav carousel-nav-prev">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="carousel-container">
                        <div class="carousel-track">
                            ${products.map(product => createProductHTML(product)).join('')}
                        </div>
                    </div>
                    <button class="carousel-nav carousel-nav-next">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        const productDetailElement = document.querySelector('.product-detail');
        
        if (productDetailElement) {
            productDetailElement.insertAdjacentHTML('afterend', html);
            console.log('Carousel added after .product-detail element as required');
        } else {
            console.error('Could not find .product-detail element to append carousel');
        }
    };

    const createProductHTML = (product) => {
        const isFavorite = favorites.includes(product.id);
        const discountPercentage = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
        
        const imageUrl = product.img || product.image || 'https://via.placeholder.com/300x300/f8f9fa/666?text=No+Image';
        
        return `
            <div class="product-item" data-product-id="${product.id}">
                <div class="product-card">
                    <div class="product-image-container">
                        <img src="${imageUrl}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x300/f8f9fa/666?text=No+Image'">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFavorite ? '#193cb0' : '#fefefe'}" stroke="${isFavorite ? 'none' : '#ccc'}" stroke-width="1.5">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                        ${discountPercentage > 0 ? `<div class="discount-badge">-${discountPercentage}%</div>` : ''}
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-pricing">
                            <span class="current-price">${product.price.toFixed(2).replace('.', ',')} TL</span>
                            ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toFixed(2).replace('.', ',')} TL</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    const buildCSS = () => {
        const css = `
            .product-carousel-container {
                margin: 32px 0;
                padding: 20px 0;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                background-color: #f4f5f7;
            }

            .carousel-header {
                padding: 0 40px;
                margin-bottom: 20px;
            }

            .carousel-title {
                font-size: 25px;
                font-weight: 500;
                color: #666;
                margin: 0;
                text-align: left;
                line-height: 1.2;
            }

            .carousel-wrapper {
                position: relative;
                display: flex;
                align-items: stretch;
                gap: 0;
                padding: 0 40px;
            }

            .carousel-container {
                flex: 1;
                overflow: hidden;
            }

            .carousel-track {
                display: flex;
                transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                gap: 60px;
                padding: 0 2px;
            }

            .product-item {
                flex-shrink: 0;
                width: calc((100% - 60px) / 4);
                min-width: 180px;
                max-width: 210px;
                min-height: 260px;
            }

            .product-card {
                background: #fff;
                border-radius: 0;
                overflow: hidden;
                box-shadow: none;
                transition: none;
                cursor: pointer;
                height: 100%;
                display: flex;
                flex-direction: column;
                border: 1px solid transparent;
            }

            .product-card:hover {
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .product-image-container {
                position: relative;
                aspect-ratio: 3/4;
                overflow: hidden;
                background: #f8f9fa;
                min-height: 250px;
                max-height: 300px;
            }

            .product-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }

            .favorite-btn {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 36px;
                height: 36px;
                border: none;
                background: transparent;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                z-index: 2;
                padding: 0;
            }

            .favorite-btn:hover {
                transform: scale(1.1);
            }

            .favorite-btn svg {
                width: 24px;
                height: 24px;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
            }

            .discount-badge {
                position: absolute;
                top: 8px;
                left: 8px;
                background: #dc3545;
                color: white;
                padding: 2px 6px;
                border-radius: 2px;
                font-size: 11px;
                font-weight: 600;
                z-index: 2;
            }

            .product-info {
                padding: 8px 10px 18px 10px;
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-height: 95px;
                gap: 30px;
            }

            .product-name {
                font-size: 12px;
                font-weight: 400;
                color: #333;
                margin: 0;
                line-height: 1.3;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                min-height: 2.4em;
                text-decoration: none;
            }

            .product-pricing {
                display: flex;
                align-items: baseline;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: auto;
            }

            .current-price {
                font-size: 19px;
                font-weight: 600;
                color: #193cb0;
                line-height: 1;
            }

            .old-price {
                font-size: 13px;
                color: #999;
                text-decoration: line-through;
                line-height: 1;
            }

            .carousel-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 44px;
                height: 44px;
                border: 1px solid #ddd;
                background: #fff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                z-index: 10;
                flex-shrink: 0;
                box-shadow: 0 2px 6px rgba(0,0,0,0.1);
            }

            .carousel-nav:hover:not(:disabled) {
                background: #f8f9fa;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-color: #bbb;
            }

            .carousel-nav:disabled {
                opacity: 0.4;
                cursor: not-allowed;
                background: #f5f5f5;
            }

            .carousel-nav svg {
                width: 20px;
                height: 20px;
                color: #333;
            }

            .carousel-nav-prev {
                left: -22px;
            }

            .carousel-nav-next {
                right: -22px;
            }

            /* Responsive Design */
            @media (max-width: 1200px) {
                .product-item {
                    width: calc((100% - 80px) / 5);
                }
            }

            @media (max-width: 992px) {
                .product-item {
                    width: calc((100% - 60px) / 4);
                }
                
                .carousel-title {
                    font-size: 17px;
                }

                .carousel-track {
                    gap: 15px;
                }
            }

            @media (max-width: 768px) {
                .product-carousel-container {
                    margin: 24px 0;
                }

                .product-item {
                    width: calc((100% - 40px) / 3);
                    min-width: 120px;
                }

                .carousel-title {
                    font-size: 16px;
                    margin-bottom: 16px;
                }

                .carousel-track {
                    gap: 12px;
                }

                .carousel-nav {
                    width: 36px;
                    height: 36px;
                }

                .carousel-nav svg {
                    width: 16px;
                    height: 16px;
                }

                .carousel-nav-prev {
                    left: -18px;
                }

                .carousel-nav-next {
                    right: -18px;
                }

                .product-info {
                    padding: 10px 6px 12px 6px;
                    justify-content: space-between;
                }

                .product-name {
                    font-size: 12px;
                }

                .current-price {
                    font-size: 16px;
                }

                .old-price {
                    font-size: 14px;
                }
            }

            @media (max-width: 576px) {
                .product-item {
                    width: calc((100% - 20px) / 2);
                    min-width: 100px;
                }

                .carousel-track {
                    gap: 10px;
                }

                .carousel-nav {
                    width: 32px;
                    height: 32px;
                }

                .carousel-nav svg {
                    width: 14px;
                    height: 14px;
                }

                .favorite-btn {
                    width: 28px;
                    height: 28px;
                    top: 6px;
                    right: 6px;
                }

                .favorite-btn svg {
                    width: 20px;
                    height: 20px;
                }

                .discount-badge {
                    top: 6px;
                    left: 6px;
                    padding: 2px 4px;
                    font-size: 10px;
                }

                .product-info {
                    gap: 10px;
                }
            }

            @media (max-width: 400px) {
                .product-item {
                    min-width: 90px;
                }

                .product-info {
                    padding: 8px 4px 10px 4px;
                    gap: 8px;
                    justify-content: space-between;
                }

                .product-name {
                    font-size: 11px;
                    min-height: 2.2em;
                }

                .current-price {
                    font-size: 14px;
                }

                .old-price {
                    font-size: 12px;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.className = 'product-carousel-style';
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    };

    const updateItemsPerView = () => {
        const width = window.innerWidth;
        if (width <= 576) {
            itemsPerView = 2;
        } else if (width <= 768) {
            itemsPerView = 3;
        } else if (width <= 1024) {
            itemsPerView = 4;
        } else {
            itemsPerView = 5;
        }
    };

    const updateCarousel = () => {
        updateItemsPerView();
        const track = document.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.carousel-nav-prev');
        const nextBtn = document.querySelector('.carousel-nav-next');
        
        if (!track || !prevBtn || !nextBtn) return;

        const maxSlide = Math.max(0, products.length - itemsPerView);
        currentSlide = Math.min(currentSlide, maxSlide);

        const translateX = -(currentSlide * (100 / itemsPerView));
        track.style.transform = `translateX(${translateX}%)`;

        prevBtn.disabled = currentSlide <= 0;
        nextBtn.disabled = currentSlide >= maxSlide;
    };

    const setEvents = () => {
        document.querySelector('.carousel-nav-prev')?.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        });

        document.querySelector('.carousel-nav-next')?.addEventListener('click', () => {
            const maxSlide = Math.max(0, products.length - itemsPerView);
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateCarousel();
            }
        });

        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.favorite-btn')) return;
                
                const productId = card.closest('.product-item').dataset.productId;
                const product = products.find(p => p.id == productId);
                if (product && product.url) {
                    window.open(product.url, '_blank');
                }
            });
        });

        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                toggleFavorite(productId, btn);
            });
        });

        window.addEventListener('resize', debounce(updateCarousel, 200));

        let startX = 0;
        let startY = 0;
        let isDragging = false;

        const track = document.querySelector('.carousel-track');
        if (track) {
            track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isDragging = true;
            }, { passive: true });

            track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                
                const currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;
                const diffX = startX - currentX;
                const diffY = startY - currentY;

                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                    e.preventDefault();
                }
            }, { passive: false });

            track.addEventListener('touchend', (e) => {
                if (!isDragging) return;
                
                const endX = e.changedTouches[0].clientX;
                const diffX = startX - endX;

                if (Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        const maxSlide = Math.max(0, products.length - itemsPerView);
                        if (currentSlide < maxSlide) {
                            currentSlide++;
                            updateCarousel();
                        }
                    } else {
                        if (currentSlide > 0) {
                            currentSlide--;
                            updateCarousel();
                        }
                    }
                }
                
                isDragging = false;
            }, { passive: true });
        }
    };

    const toggleFavorite = (productId, btn) => {
        const index = favorites.indexOf(productId);
        const svg = btn.querySelector('svg');
        
        if (index > -1) {
            favorites.splice(index, 1);
            btn.classList.remove('active');
            svg.setAttribute('fill', '#fefefe');
            svg.setAttribute('stroke', '#ccc');
        } else {
            favorites.push(productId);
            btn.classList.add('active');
            svg.setAttribute('fill', '#193cb0');
            svg.setAttribute('stroke', 'none');
        }
        
        saveFavorites();
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    init();
})();