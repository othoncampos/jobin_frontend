import Api from "./Api";

export const uf_lista_all = async () => {
    try {
        const resp = await Api.get(`/uf/listall`);
        console.log('uf_lista_all', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const uf_find_by_id = async (id) => {
    try {
        const resp = await Api.get(`/uf/${id}`);
        console.log('uf_find_by_id', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const uf_delete = async (id) => {
    try {
        const resp = await Api.delete(`/uf/${id}`);
        console.log('uf_delete.resp', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const uf_add = async (obj) => {
    console.log('uf_add', obj.id, obj.sigla, obj.nome);
    try {
        const resp = await Api.post(`/uf/`, obj);
        console.log('uf_add.resp', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const uf_update = async (obj) => {
    console.log('uf_update', obj.id, obj.sigla, obj.nome);
    try {
        const resp = await Api.put(`/uf/${obj.id}`, obj);
        console.log('uf_update.resp', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}