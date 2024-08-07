import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MaskedInput from 'react-text-mask'
import config from '../config';

const Login = () => {
    const [taxNumber, setTaxNumber] = useState('');
    const [password, setPassword] = useState('');
    const [registerTaxNumber, setRegisterTaxNumber] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPhone, setRegisterPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const navigate = useNavigate();

    // Máscara para telefone: (XX) XXXXX-XXXX
    const phoneMask = [
        '(',
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/
    ];
    // Máscaras para CPF e CNPJ
    const cpfMask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    const cnpjMask = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];

    const getMask = (value) => {
        return value.replace(/\D/g, '').length > 11 ? cnpjMask : cpfMask;
    };

    // Função para lidar com a mudança no input
    const handleChange = (e, setFunction) => {
        // Remover qualquer caractere que não seja dígito
        const onlyDigits = e.target.value.replace(/\D/g, '');
        setFunction(onlyDigits);
        setError(''); // Limpa o erro ao digitar
    };

    const validateInput = (isRegister = false) => {
        const currentTaxNumber = isRegister ? registerTaxNumber : taxNumber;
        const currentPassword = isRegister ? registerPassword : password;
        const currentName = isRegister ? registerName : '';
        const currentEmail = isRegister ? registerEmail : '';
        const currentPhone = isRegister ? registerPhone : '';
        const formattedTaxNumber = currentTaxNumber.replace(/\D/g, '');
        const formattedPhone = currentPhone.replace(/\D/g, '');
        if (isRegister) {
            if (!formattedTaxNumber || (formattedTaxNumber.length !== 11 && formattedTaxNumber.length !== 14)) {
                setError('Por favor, insira um CPF ou CNPJ válido.');
                return false;
            }

            if (!currentName) {
                setError('Por favor, insira seu nome completo.');
                return false;
            }

            if (!currentEmail || !/\S+@\S+\.\S+/.test(currentEmail)) {
                setError('Por favor, insira um e-mail válido.');
                return false;
            }

            if (!formattedPhone || formattedPhone.length !== 11) {
                setError('Por favor, insira um número de celular válido.');
                return false;
            }

            if (!currentPassword) {
                setError('Por favor, insira uma senha.');
                return false;
            }
        } else {

            if (!formattedTaxNumber || (formattedTaxNumber.length !== 11 && formattedTaxNumber.length !== 14)) {
                setError('Por favor, insira um CPF ou CNPJ válido.');
                return false;
            }

            if (!currentPassword) {
                setError('Por favor, insira uma senha.');
                return false;
            }
        }
        return true;
    };

    const handleChangePhone = (e) => {
        setRegisterPhone(e.target.value);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpa a mensagem de erro ao tentar novo login
        setSuccess(''); // Limpa a mensagem de sucesso ao tentar novo login
        if (!validateInput()) return;
        try {
            // Prepare taxNumber formatado apenas com números para a API
            const formattedTaxNumber = taxNumber.replace(/\D/g, '');
            const response = await axios.post(`${config.apiBaseUrl}/auth/login`, {
                taxNumber: formattedTaxNumber,
                password,
            });
            localStorage.setItem('token', response.data.data.token);
            navigate('/produtos');
        } catch (error) {
            console.error('Erro de autenticação', error);
            setError('Falha na autenticação. Por favor, verifique suas credenciais.');
        }
    };
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpa a mensagem de erro ao tentar novo registro
        setSuccess(''); // Limpa a mensagem de sucesso ao tentar novo registro
        if (!validateInput(true)) return;
        try {
            const formattedTaxNumber = registerTaxNumber.replace(/\D/g, '');
            console.log(registerName)
            console.log(registerEmail)
            console.log(registerPhone)
            const response = await axios.post(`${config.apiBaseUrl}/auth/register`, {
                taxNumber: formattedTaxNumber,
                password: registerPassword,
                name: registerName,
                mail: registerEmail,
                phone: registerPhone,
            });
            console.log('cadastro response: ', response)
            setSuccess('Cadastro realizado com sucesso! Você pode agora fazer login.');
            setIsRegistering(false);
        } catch (error) {
            console.error('Erro de registro', error);
            setError('Falha no registro. Por favor, tente novamente.');
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-900">{isRegistering ? 'Cadastrar' : 'Entrar'}</h2>
                {error && <div className="text-red-600 mb-4">{error}</div>}
                {success && <div className="text-green-600 mb-4">{success}</div>}
                {isRegistering ? (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="registerTaxNumber" className="block text-sm font-medium text-gray-700">
                                CPF ou CNPJ
                            </label>
                            <MaskedInput
                                mask={getMask(registerTaxNumber)}
                                value={registerTaxNumber}
                                onChange={(e) => handleChange(e, setRegisterTaxNumber)}
                                placeholder="CPF ou CNPJ"
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                guide={false}
                            />
                        </div>
                        <div>
                            <label htmlFor="registerName" className="block text-sm font-medium text-gray-700">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                id="registerName"
                                value={registerName}
                                onChange={(e) => setRegisterName(e.target.value)}
                                placeholder="Nome completo"
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="registerEmail"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                                placeholder="E-mail"
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="registerPhone" className="block text-sm font-medium text-gray-700">
                                Celular
                            </label>
                            <MaskedInput
                                type="tel"
                                mask={phoneMask}
                                id="registerPhone"
                                value={registerPhone}
                                onChange={handleChangePhone}
                                placeholder="Celular"
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <input
                                autoComplete='on'
                                type="password"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                placeholder="Senha"
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cadastrar
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRegistering(false)}
                            className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Voltar para Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700">
                                CPF ou CNPJ
                            </label>
                            <MaskedInput
                                mask={getMask(taxNumber)}
                                value={taxNumber}
                                onChange={(e) => handleChange(e, setTaxNumber)}
                                placeholder="CPF ou CNPJ"
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                guide={false}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Senha
                            </label>
                            <input
                                autoComplete='on'
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                className="block w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Entrar
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsRegistering(true)}
                            className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md shadow hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Criar uma Conta
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
