import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = "http://192.168.0.113:80/auth/";
class AuthService {
    async login(username, password) {
        const response = await axios
            .post(API_URL + "signin", {
                username,
                password
            });
            if (response.data.accessToken) {
                await AsyncStorage.setItem('user', JSON.stringify(response.data));
              }
          
              return response.data;
    }
    loginVK(id) {
        return axios
            .get(`http://192.168.0.113:80/users/${id}`)
            .then(response => {

                    localStorage.setItem("user",
                        JSON.stringify(response.data));

                return response.data;
            });
    }
    async logout() {
        AsyncStorage.removeItem("user");
    }
    register(username, email, password, subscribed) {
            return axios.post(API_URL + "signup", {
                username,
                email,
                password,
                subscribed,
                roles: ['user']
            });
    }
    getVKUser() {
        return axios.get("http://192.168.0.113:80/auth/vkontakte");
    }

    async getCurrentUser() {
        const userData = await AsyncStorage.getItem('user');
        return JSON.parse(userData);
      }
      
      async isLoggedIn() {
        try {
            const user = await this.getCurrentUser();
            return !!user && !!user.accessToken;
        } catch (error) {
            console.error('Error checking user login status:', error);
            return false;
        }
    }
    getAllUsers() {
        const user = this.getCurrentUser();
        const config = {
            headers: { Authorization: `Bearer ${user.accessToken}` }
        };
        return axios.get("http://192.168.0.113:80/admin/users", config);
    }
    postActivationCode(email, activation_code) {
        return axios
            .post("http://192.168.0.113:80/activation", {
                email,
                activation_code
            })
    }
    
    postSubscribed(email, subscribed) {
        return axios
            .post("http://192.168.0.113:80/subscribing", {
                email,
                subscribed
            })
    }
    isSubscribed(email) {
        return axios.get(`http://192.168.0.113:80/issubscribing/${email}`)
    }
    isActiveEmail(email) {
        return axios.get(`http://192.168.0.113:80/isactiveemail/${email}`)
    }
    getProductById(id) {
        return axios.get(`http://192.168.0.113:80/isproduct/${id}`,  { params: { id } });
    }
    updatePass(username, password, newpassword) {
        return axios.put("http://192.168.0.113:80/newpass", {
            username,
            password,
            newpassword
        })
    }
    postResetingCode(email) {
        return axios
            .post("http://192.168.0.113:80/reseting", {
                email
            })
    }
    resetVerify(email, resetingCode) {
        return axios
            .post("http://192.168.0.113:80/resetingverify", {
                email,
                resetingCode
            })
    }
    
    resetPass(email, newPassword, newPasswordRepeat) {
        return axios
            .put("http://192.168.0.113:80/finishreset", {
                email,
                newPassword,
                newPasswordRepeat
            })
    }
    createOrder(userId, productId, name, address, town, delivery) {
        return axios
            .post("http://192.168.0.113:80/order", {
                userId,
                productId,
                name,
                address,
                town,
                delivery
        })
    }
    getOrders(userId) {  
        return axios.get(`http://192.168.0.113:80/orders/${userId}`, { params: { userId } })
    }
    refreshRole(userId, newRole) {
        return axios.put(`http://192.168.0.113:80/refreshrole/${userId}`, { newRole })
    }
    getCors(userId) {
        return axios.get(`http://192.168.0.113:80/cors/${userId}`, {params: {userId}})
    }
    updateAmountCors(userId, tovId, newAmount) {
        return axios
            .put("http://192.168.0.113:80/cors/amount", {
                userId,
                tovId,
                newAmount
            })
    }
    dropProductCors(userId, tovId) {
        return axios.delete("http://192.168.0.113:80/cors/drop", {
            data: { userId, tovId } // Передача данных в теле запроса
        });
    }
    addProductCors(userId, tovId) {
        return axios
            .post("http://192.168.0.113:80/cors/add", {
                userId,
                tovId
            })
    }
    checkCors(userId, tovId) {
        return axios
            .post("http://192.168.0.113:80/cors/check", {
                userId,
                tovId
            })
    }
}

export default new AuthService()