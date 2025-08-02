const BASE_URL = 'http://localhost:5000'; // Update if needed

export const uploadFile = async (formData) => {
  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  return await res.json();
};

export const getFiles = async () => {
  const res = await fetch(`${BASE_URL}/files`);
  return await res.json();
};

export const downloadFile = async (filename) => {
  const res = await fetch(`${BASE_URL}/download/${filename}`);
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const deleteFile = async (id) => {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: 'DELETE',
  });
  return await res.json();
};
