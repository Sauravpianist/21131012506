const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');

const app = express();
const port = 3000;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache TTL set to 1 hour

const ecommerceAPI = [
    'https://20.244.56.144/test/companies/FLP/categories/Computer/products?top=1&minPrice=1&maxPrice=10000',
    'https://20.244.56.144/test/companies/AMZ/categories/Computer/products?top=1&minPrice=1&maxPrice=10000',

];

// Helper function to fetch data from all e-commerce APIs
const fetchDataFromAPIs = async (category) => {
    try {
        const requests = ecommerceAPI.map(api => axios.get(api));
        const responses = await Promise.all(requests);
        return responses.map(response => response.data).flat();
    } catch (error) {
        console.error('Error fetching data from APIs:', error);
        throw new Error('Failed to fetch data from e-commerce APIs');
    }
};

// Generate a unique identifier for each product
const generateUniqueId = (product, index) => `${product.company}-${product.id}-${index}`;

app.get('/categories/:categoryname/products', async (req, res) => {
    const { categoryname } = req.params;
    const { n = 10, page = 1, sort_by, sort_order = 'asc' } = req.query;
    const itemsPerPage = Math.min(n, 10);

    const cacheKey = `${categoryname}-${n}-${page}-${sort_by}-${sort_order}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        return res.json(cachedData);
    }

    try {
        let products = await fetchDataFromAPIs(categoryname);

        // Apply sorting
        if (sort_by) {
            products.sort((a, b) => {
                if (sort_order === 'asc') {
                    return a[sort_by] > b[sort_by] ? 1 : -1;
                } else {
                    return a[sort_by] < b[sort_by] ? 1 : -1;
                }
            });
        }

        // Generate unique IDs
        products = products.map((product, index) => ({
            ...product,
            unique_id: generateUniqueId(product, index)
        }));

        // Apply pagination
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Cache the result
        cache.set(cacheKey, paginatedProducts);

        res.json(paginatedProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
