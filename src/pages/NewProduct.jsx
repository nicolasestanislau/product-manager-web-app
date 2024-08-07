import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const NewProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpa o erro antes de submeter
        try {
            await axios.post(`${config.apiBaseUrl}/products/create-product`, {
                name,
                price: parseFloat(price),
                description,
                stock: parseInt(stock, 10)
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/produtos');
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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">Criar Novo Produto</h2>
                {error && <div className="text-sm text-red-600 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                            Nome
                        </label>
                        <input
                            type="text"
                            id="nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                            Descrição
                        </label>
                        <textarea
                            id="descricao"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="preco" className="block text-sm font-medium text-gray-700">
                            Preço
                        </label>
                        <input
                            type="number"
                            id="preco"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="estoque" className="block text-sm font-medium text-gray-700">
                            Estoque
                        </label>
                        <input
                            type="number"
                            id="estoque"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Criar Produto
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewProduct;
