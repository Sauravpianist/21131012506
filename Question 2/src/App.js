import './App.css';
import React, { useState, useEffect } from 'react';
import {Route, Routes, Link } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/categories/';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState('Computer');
    const [n, setN] = useState(10);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filter, setFilter] = useState({
        rating: '',
        priceRange: [0, 10000],
        company: '',
        availability: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}${category}/products`, {
                    params: {
                        n,
                        page,
                        sort_by: sort,
                        sort_order: sortOrder,
                        ...filter
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [category, n, page, sort, sortOrder, filter]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Top Products
            </Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <MenuItem value="Computer">Computer</MenuItem>
                    <MenuItem value="Phone">Phone</MenuItem>
                    <MenuItem value="Earphone">Earphone</MenuItem>
                    <MenuItem value="Charger">Charger</MenuItem>
                    <MenuItem value="Mouse">Mouse</MenuItem>
                    <MenuItem value="Keypad">Keypad</MenuItem>
                    <MenuItem value="Bluetooth">Bluetooth</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Number of Products"
                type="number"
                value={n}
                onChange={(e) => setN(e.target.value)}
                margin="normal"
                fullWidth
            />
            <TextField
                label="Page"
                type="number"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                margin="normal"
                fullWidth
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Sort By</InputLabel>
                <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <MenuItem value="price">Price</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                    <MenuItem value="discount">Discount</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Sort Order</InputLabel>
                <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <MenuItem value="asc">Ascending</MenuItem>
                    <MenuItem value="desc">Descending</MenuItem>
                </Select>
            </FormControl>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item key={product.unique_id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                alt={product.name}
                                height="140"
                            />
                            <CardContent>
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography>Company: {product.company}</Typography>
                                <Typography>Category: {product.category}</Typography>
                                <Typography>Price: ${product.price}</Typography>
                                <Typography>Rating: {product.rating}</Typography>
                                <Typography>Discount: {product.discount}%</Typography>
                                <Typography>Availability: {product.availability}</Typography>
                                <Button component={Link} to={`/product/${product.unique_id}`} variant="contained" color="primary">
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

const ProductDetail = ({ match }) => {
    const { productid } = match.params;
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_URL}Computer/products/${productid}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productid]);

    if (!product) return <div>Loading...</div>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {product.name}
            </Typography>
            <Card>
                <CardMedia
                    component="img"
                    alt={product.name}
                    height="140"
                    image={`https://via.placeholder.com/150?text=${product.name}`}
                />
                <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography>Company: {product.company}</Typography>
                    <Typography>Category: {product.category}</Typography>
                    <Typography>Price: ${product.price}</Typography>
                    <Typography>Rating: {product.rating}</Typography>
                    <Typography>Discount: {product.discount}%</Typography>
                    <Typography>Availability: {product.availability}</Typography>
                </CardContent>
            </Card>
        </Container>
    );
};

const App = () => (
        <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:productid" element={<ProductDetail />} />
        </Routes>
);

export default App;
