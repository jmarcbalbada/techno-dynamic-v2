import axios from 'axios';

const baseUrl = 'http://127.0.0.1:8000/'

export const getLessons = async () => {
    try {
        const response = await axios.get(`${baseUrl}api/lessons`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export const getLesson = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}api/lessons/${id}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}