import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config'; // Importe a configuração

const Products = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // Controle de visibilidade do modal

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${config.apiBaseUrl}/products/get-all-products`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Ordena a lista de produtos por nome em ordem alfabética
                const sortedProdutos = response.data.data.products.sort((a, b) => a.name.localeCompare(b.name));
                setProducts(sortedProdutos);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                setError('Não foi possível carregar a lista de produtos.');
            }

        };

        fetchProducts();
    }, []);

    const deleteProduct = async (productId) => {
        try {
            await axios.delete(`${config.apiBaseUrl}/products/delete-product/${productId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setProducts(products.filter((product) => product.id !== productId));
            setModalVisible(false); // Fechar modal após exclusão
        } catch (error) {
            if (error.response) {
                // Erro retornado pelo servidor
                if (error.response.status === 500) {
                    console.error('Erro interno do servidor', error);
                    setError('Ocorreu um erro ao tentar excluir o produto. Por favor, tente novamente mais tarde.');
                    setModalVisible(false);
                } else {
                    // Tratar outros erros
                    console.error('Erro na solicitação', error);
                    setError('Ocorreu um erro ao tentar excluir o produto.');
                    setModalVisible(false);
                }
            } else {
                // Erro na requisição, como perda de conexão
                console.error('Erro de rede', error);
                setError('Ocorreu um erro na conexão com o servidor. Verifique sua conexão e tente novamente.');
                setModalVisible(false);
            }
        }


    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="container mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lista de Produtos</h2>
                {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
                <Link
                    to="/produtos/novo"
                    className="inline-block px-4 py-2 my-4 text-sm font-medium text-white bg-green-600 rounded-md shadow hover:bg-green-700"
                >
                    Adicionar Novo Produto
                </Link>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(product => (
                        <div key={product.id} className="bg-white p-6 rounded-lg shadow-lg flex flex-col justify-between h-72">
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-gray-600 mt-2">{product.description}</p>
                            <div className="mt-4 flex flex-col">
                                <span className="text-lg font-bold text-gray-900">R${product.price.toFixed(2)}</span>
                                <span className="block text-sm text-gray-600">Estoque: {product.stock}</span>
                            </div>
                            <div className="mt-6 flex justify-between">
                                <Link
                                    to={`/produtos/${product.id}/editar`}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Editar
                                </Link>
                                <button
                                    onClick={() => { setModalVisible(true);/*  deleteProduct(product.id) */ }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Excluir
                                </button>
                            </div>
                            {modalVisible && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg">
                                        <h3 className="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
                                        <p className="text-sm text-gray-600 mb-4">Tem certeza de que deseja excluir este produto?</p>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                onClick={() => setModalVisible(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Products;
