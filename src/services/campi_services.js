import Api from "./Api";

export const campi_lista_all = async () =>{
    try {
        const resp = await Api.get(`/campi/listall`);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const campi_delete = async (id) => {
    try {
        const resp = await Api.delete(`/campi/${id}`);
        console.log('campi_delete.resp', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const campi_add = async (obj) => {
    console.log('campi_add', obj);
    try {
        const resp = await Api.post(`/campi/`, obj);
        console.log('campi_add.resp', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const campi_find_by_id = async (id) => {
    try {
        const resp = await Api.get(`/campi/${id}`);
        console.log('campi_find_by_id', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}

export const campi_update = async (obj) => {
    console.log('campi_update', obj);
    try {
        const resp = await Api.put(`/campi/${obj.id}`, obj);
        console.log('campi_update.resp', resp);
        return resp
    } catch (error) {
        console.error(error);
    }
}