const fallbackApiBase =
  typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:8000/v1`
    : 'http://localhost:8000/v1';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || fallbackApiBase;

function buildHeaders(token, contentType = 'application/json') {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options.token, options.contentType),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || 'Request failed');
  }
  return data;
}

export const api = {
  getSession(token) {
    return request('/auth/session', { method: 'GET', token });
  },
  signUpload(token, payload) {
    return request('/upload/sign', { method: 'POST', body: JSON.stringify(payload), token });
  },
  listCards(token) {
    return request('/cards', { method: 'GET', token });
  },
  getCard(token, cardId) {
    return request(`/cards/${cardId}`, { method: 'GET', token });
  },
  createCard(token, payload) {
    return request('/cards', { method: 'POST', body: JSON.stringify(payload), token });
  },
  updateCard(token, cardId, payload) {
    return request(`/cards/${cardId}`, { method: 'PATCH', body: JSON.stringify(payload), token });
  },
  deleteCard(token, cardId) {
    return request(`/cards/${cardId}`, { method: 'DELETE', token });
  },
  viewer(cardId) {
    return request(`/viewer/${cardId}`, { method: 'GET' });
  },
  analytics(token, cardId) {
    return request(`/cards/${cardId}/analytics`, { method: 'GET', token });
  }
};

export async function uploadToCloudinary(token, file, { folder, resourceType }) {
  const sign = await api.signUpload(token, { folder, resource_type: resourceType });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sign.api_key);
  formData.append('timestamp', String(sign.timestamp));
  formData.append('signature', sign.signature);
  formData.append('folder', sign.folder);

  const upload = await fetch(sign.upload_url, {
    method: 'POST',
    body: formData
  });

  const payload = await upload.json();
  if (!upload.ok) {
    throw new Error(payload.error?.message || 'Cloudinary upload failed');
  }

  return payload.secure_url;
}
