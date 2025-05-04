import api from '../../services/API.jsx';

export default async function createPlan(data) {
    const { name = '', description = '' } = data;

    return await api.post('/plan', {
        name,
        description,
        totalAmount: 0,
    });
}