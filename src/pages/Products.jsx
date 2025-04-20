import { useState } from 'react'
import { useProducts } from '../context/ProductContext'
import ProductFilter from '../components/products/ProductFilter'
import ProductList from '../components/products/ProductList'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Products = () => {
    const { products, loading, error, categories } = useProducts()
    const [filters, setFilters] = useState({
        category: '',
        priceRange: '',
        searchQuery: '',
    })

    if (loading) return <LoadingSpinner />
    if (error) return <div className="error-message">{error}</div>

    const filteredProducts = products.filter(product => {
        // Filter by category
        if (filters.category && product.category !== filters.category) {
            return false
        }

        // Filter by price range
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number)
            if (max && (product.price < min || product.price > max)) {
                return false
            }
            if (!max && product.price < min) {
                return false
            }
        }

        // Filter by search query
        if (filters.searchQuery) {
            const searchLower = filters.searchQuery.toLowerCase()
            return (
                product.title.toLowerCase().includes(searchLower) ||
                product.description.toLowerCase().includes(searchLower)
            )
        }

        return true
    })

    return (
        <div className="products-page">
            <h1>Our Products</h1>
            <div className="products-container">
                <ProductFilter
                    categories={categories}
                    filters={filters}
                    setFilters={setFilters}
                />
                <ProductList products={filteredProducts} />
            </div>
        </div>
    )
}

export default Products