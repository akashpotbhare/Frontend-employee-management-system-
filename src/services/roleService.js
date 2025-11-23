import api from './api';

export const roleService = {
    assignRole: (data) => {
        return api.post('/role/assign-role', data);
    }
};