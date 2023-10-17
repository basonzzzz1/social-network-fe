import Axios from "../Config/axiosConfig";

const LoginRegisterService = {
    login: async (user) => {
        /*return new Promise((resolve, reject) => {

            let data = JSON.stringify(user);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:8080/login',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    resolve(response.data)
                })
                .catch((error) => {
                    reject(error);
                });

        })*/
        return await Axios.post('/login', user);
    },
    checkLogin: async (user) => {
        /*return new Promise((resolve, reject) => {

            let data = JSON.stringify(user);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:8080/fail',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });

        })*/
        return await Axios.post('/fail', user);
    },
    register: async (user) => {
        /*return new Promise((resolve, reject) => {

            let data = JSON.stringify(user);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:8080/register',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });

        })*/
        return await Axios.post('/register', user);
    },
    logout: async (id) => {
        /*return new Promise((resolve, reject) => {

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://localhost:8080/logout/${id}`,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.request(config)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });

        })*/
        return await Axios.post(`/logout/${id}`);
    }
};

export default LoginRegisterService;