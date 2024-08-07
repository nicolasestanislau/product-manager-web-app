import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../config';

const EditProduct = () => {
    const { id } = useParams(); // Captura o ID do produto da URL
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Carregar os dados do produto quando o componente for montado
        const fetchProduto = async () => {
            try {
                const response = await axios.get(`${config.apiBaseUrl}/products/get-one-product/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const produto = response.data;
                setName(produto.name);
                setPrice(produto.price);
                setDescription(produto.description);
                setStock(produto.stock);
            } catch (error) {
                console.error('Erro ao buscar produto', error);
                setError('Não foi possível carregar os dados do produto.');
            }
        };
        fetchProduto();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`${config.apiBaseUrl}/products/update-product/${id}`, {
                name,
                price: parseFloat(price), // Converter preço para float
                description,
                stock: parseInt(stock, 10) // Converter estoque para inteiro
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccess('Produto atualizado com sucesso.');
            setTimeout(() => navigate('/produtos'), 2000);
        } catch (error) {
            console.error('Erro ao criar produto', error);

            // Verifica se a resposta do erro contém a mensagem esperada
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message[0];
                if (errorMessage === 'price must be a positive number') {
                    setError('Preço deve ser um número positivo.');
                } else if (errorMessage === 'stock must be a positive number') {
                    setError('Estoque deve ser um número inteiro positivo.');
                } else {
                    setError('Erro ao criar produto. Verifique os dados e tente novamente.');
                }
            } else {
                setError('Erro ao criar produto. Tente novamente mais tarde.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="container mx-auto max-w-4xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Produto</h2>
                {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
                {success && <div className="text-sm text-green-600 mb-4">{success}</div>}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Produto:</label>
                        <input
                            id="nome"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome do Produto"
                            required
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="preco" className="block text-sm font-medium text-gray-700">Preço:</label>
                        <input
                            id="preco"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Preço"
                            required
                            step="0.01"
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">Descrição:</label>
                        <textarea
                            id="descricao"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descrição do Produto"
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="estoque" className="block text-sm font-medium text-gray-700">Estoque:</label>
                        <input
                            id="estoque"
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="Quantidade em Estoque"
                            required
                            min="0" className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/produtos')}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md shadow hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Atualizar</button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
