import Api from "./Api";

export const banco_lista_all = async () => {
    try {
        const resp = await Api.get(`/bank`);
        // console.log('cidade_lista_all', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const banco_delete = async (id) => {
    try {
        const resp = await Api.delete(`/cidade/${id}`);
        console.log('cidade_delete.resp', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const banco_add = async (obj) => {
    console.log('cidade_add', obj);
    try {
        const resp = await Api.post(`/cidade/`, obj);
        console.log('cidade_add.resp', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const banco_find_by_id = async (id) => {
    try {
        const resp = await Api.get(`/cidade/${id}`);
        console.log('cidade_find_by_id', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const banco_update = async (obj) => {
    console.log('cidade_update', obj);
    try {
        const resp = await Api.put(`/cidade/${obj.id}`, obj);
        console.log('cidade_update.resp', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}