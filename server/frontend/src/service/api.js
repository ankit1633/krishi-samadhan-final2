import axios from 'axios';

const URL = `${window.location.origin}`;


export const authenticateSignup = async (data) => {
    try {
       return await axios.post(`${URL}/signup`, data,{ withCredentials: true });
    } catch(error) {
        console.log(`Error while calling signup API`, error);
    }
}

export const authenticateLogin = async (data) => {
    try {
       return await axios.post(`${URL}/login`, data, { withCredentials: true });
    } catch(error) {
        console.log(`Error while calling login API`, error);
        return error.response;
    }
}

export const authenticateDistributorSignup = async (data) => {
    try {
       return await axios.post(`${URL}/distributor-signup`, data);
    } catch(error) {
        console.log(`Error while calling distributor signup API`, error);
    }
}

export const authenticateDistributorLogin = async (data) => {
    try {
       return await axios.post(`${URL}/distributor-login`, data,{ withCredentials: true });
    } catch(error) {
        console.log(`Error while calling distributor login API`, error);
        return error.response;
    }
}

export const authenticateExpertLogin = async (data) => {
    try {
        return await axios.post(`${URL}/expertlogin`, data, { withCredentials: true });
    } catch (error) {
        console.log('Error while calling expert login API', error);
        return error.response;
    }
};

export const authenticateLogout = async () => {
    try {
        return await axios.post(`${URL}/logout`, {}, {
            withCredentials: true // Ensure cookies are sent with the request
        });
    } catch (error) {
        console.log('Error while calling logout API:', error);
        return error.response;
    }
};

export const authenticateQuestion = async (data) => {
    try {
       return await axios.post(`${URL}/add-question`, data, { withCredentials: true });
    } catch(error) {
        console.log(`Error while calling add-question API`, error);
        return error.response;
    }
}

export const authenticateGetQuestion = async () => {
    try {
       return await axios.get(`${URL}/questions`, { withCredentials: true });
    } catch(error) {
        console.log(`Error while calling get-question API`, error);
        return error.response;
    }
}

export const authenticateWarehouse = async (data) => {
    try {
       return await axios.post(`${URL}/add-warehouse`, data, { withCredentials: true });
    } catch(error) {
        console.log(`Error while calling add-warehouse API`, error);
        return error.response;
    }
}

export const authenticateGetWarehouse = async () => {
    try {
       return await axios.get(`${URL}/get-warehouse`, { withCredentials: true });
    } catch(error) {
        console.log(`Error while calling get-warehouse API`, error);
        return error.response;
    }
}

export const authenticateAddAnswer = async (data) => {
    try {
       const response = await axios.post(`${URL}/answer`, data, { withCredentials: true });
       return response.data; // Return the response data
    } catch(error) {
        console.error('Error while calling answer question API:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
}

export const authenticateGetAnswer = async () => {
    try {
        return await axios.get(`${URL}/answers`, { withCredentials: true });
    } catch (error) {
        console.log(`Error while calling get-answer API`, error);
        return error.response;
    }
};

export const authenticateProblem = async (data) => {
    try {
        if (!data.get('problem')) {
            throw new Error('Problem description is required while making API call');
        }
        return await axios.post(`${URL}/problems`, data, { withCredentials: true });
    } catch (error) {
        console.log(`Error while calling add-problem API:`, error);
        return error.response;
    }
}

export const authenticateGetProblem = async () => {
    try {
        return await axios.get(`${URL}/problems`, { withCredentials: true });
    } catch (error) {
        console.log(`Error while calling get-problem API`, error);
        return error.response;
    }
};

export const authenticateAddProblemAnswer = async (data) => {
    try {
        const response = await axios.post(`${URL}/answer-problem`, data, { withCredentials: true });
        return response; // Return the entire response object
    } catch (error) {
        console.error('Error while calling answer problem API:', error);
        throw error; // Re-throw the error for handling in the calling function
    }
};


export const authenticateGetSolution = async (email) => {
    try {
        console.log('inside authenticate get solution');
        const response = await axios.get(`${URL}/solutions`, {
            params: { email },  // Pass email as query parameter
            withCredentials: true
        });
        return response;  // Return response object
    } catch (error) {
        console.log('Error while calling get-solution API: ');
        console.error('Error while calling get-solution API:', error);
        throw error;
    }
};

// ... existing code ...

export const authenticateGetWeather = async (lat, lon) => {
    try {
        console.log('Calling weather API with params:', { lat, lon });
        const response = await axios.get(`${URL}/weather`, {
            params: { lat, lon },
            withCredentials: true,
        });
        console.log('Weather API response:', response.data);
        return response;
    } catch (error) {
        console.error('Error while calling get-weather API:', error);
        if (error.response) {
            console.error('Error response:', error.response.data);
            return error.response;
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return { status: 500, data: { message: 'An unknown error occurred' } };
    }
};

// ... existing code ...