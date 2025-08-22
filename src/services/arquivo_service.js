import Api from "./Api";

export const arquivo_get_list_by_emp = async (emp_id) => {
  try {
    const resp = await Api.get(`arq/${emp_id}`);
    console.log("arquivo_get_list_by_emp", resp)
    return resp;
  } catch (error) {
    console.error(error); 
  }
}

export const arquivo_upload = async (formData) => {
  var responde;
  Api.postMultipart( "/arq/upload", formData)
  .then( (resp) => {
      console.log("arquivo_upload.Upload: ", resp);
      // file_id.value = e.data;
      // uploading.value = false;
      responde = resp;
  })
  .catch( (err) => {
      console.log("arquivo_upload.err", err);
  })
  return responde;
}

export const arquivo_download = async (obj_id) => {
  var responde;
  Api.get( `/arq/download/${obj_id}`, obj_id)
  .then( (resp) => {
      console.log("arquivo_download.download: ", resp);
      // file_id.value = e.data;
      // uploading.value = false;
      responde = resp;
  })
  .catch( (err) => {
      console.log("arquivo_upload.err", err);
  })
  return responde;
}

export const arquivo_delete = async (emp_id, file_id) => {
  const resp = await Api.delete( `/arq/${emp_id}/${file_id}`, null)
  return resp;
}

export const arquivo_process = async (emp_id, user_id, arq_id) => {
    console.log('arquivo_process: ', emp_id, user_id, arq_id)
    
    const formData = new FormData();
    formData.append("emp_id", emp_id);
    formData.append("user_id", user_id);
    formData.append("arq_id", arq_id);
    console.log('arquivo_process.formData', formData)
    
    try {
      const resp = await Api.post(`/arq/process/`, formData);
      console.log('arquivo_process: ', resp);
      return resp;
    } catch (error) {
      console.error(error);
    }
}

export const arquivo_count_upload = async (emp_id) => {
    console.log('arquivo_count_upload: ', emp_id)
    try {
      const resp = await Api.get(`/arq/count_upload/${emp_id}`, null);
      console.log('arquivo_process: ', resp);
      return resp;
    } catch (error) {
      console.error(error);
    }
}

export const arquivo_count_upload_status = async (emp_id, status) => {
    console.log('arquivo_count_upload_status: ', emp_id, status)
    try {
      const resp = await Api.get(`/arq/count_upload_status/${emp_id}/${status}`, null);
      console.log('arquivo_count_upload_status: ', resp);
      return resp;
    } catch (error) {
      console.error(error);
    }
}


status