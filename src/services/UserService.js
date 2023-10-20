import Axios from "../Config/axiosConfig";

const UserService = {
    editAvatar: async (user) => {
        /*return new Promise((resolve, reject) => {

            let data = JSON.stringify(user);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://localhost:8080/apiUser/editUser/${user.id}/avatar`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
        return await Axios.post(`/apiUser/editUser/${user.id}/avatar`, user);
    },
    editThumbnail: async (user) => {
        /*return new Promise((resolve, reject) => {

            let data = JSON.stringify(user);

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `http://localhost:8080/apiUser/editUser/${user.id}/thumbnail`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
        return await Axios.post(`/apiUser/editUser/${user.id}/thumbnail`, user);
    },
    getUserById: async (id) => {
        return await Axios.get(`/apiUser/user/${id}`);
    },
    editUser: async (user) => {
        return await Axios.post(`/apiUser/editUser/${user.id}`, user);
    },
    editPassword: async (user) => {
        return await Axios.post(`/editUser/password/${localStorage.getItem("idAccount")}/`+user.nPassword);
    }
}

export default UserService;