import { useState, useEffect, useRef } from 'react';
import { backend } from '../Constain';

// lấy dữ liệu cả bảng init
const fetchInits = async () => {
  try {
    const res = await fetch(`${backend}inits`);
    const data = await res.json();
    if (data.success) {
      return data.data;
    } else {
      alert('get data fail: ' + data.message);
      return [];
    }
  } catch (err) {
    console.error(err);
    alert('Server error when getting data from inits');
    return [];
  }
};
export const useFetchInits = () => {
  const [inits, setInits] = useState([]);
  const firstRender = useRef(true); // thêm useRef
  useEffect(() => {
    const loadInits = async () => {
      const data = await fetchInits();
      setInits(data || []);
      if (firstRender.current) {
        firstRender.current = false;
      }
    };
    loadInits();
  }, []);
  return { inits };
};

// lấy init dựa theo type
const fetchInit = async ({ type }) => {
  try {
    const res = await fetch(`${backend}inits`);
    const data = await res.json();
    if (data.success) {
      const filtered = type
        ? data.data.filter((init) => init.type === type)
        : data.data;
      return filtered;
    } else {
      alert('Get data fail: ' + data.message);
      return [];
    }
  } catch (err) {
    console.error(err);
    alert('Server error when getting data from inits');
    return [];
  }
};
export const useFetchInit = (type) => {
  const [init, setInit] = useState([]);
  const firstRender = useRef(true); // thêm useRef
  useEffect(() => {
    const loadInit = async () => {
      const data = await fetchInit({ type });
      setInit(data || []);
      if (firstRender.current) {
        firstRender.current = false;
      }
    };
    loadInit();
  }, [type]);

  return { init };
};

export const useUpsertInits = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /**
   * upsertInits({ type, data, onSuccess })
   * type: string
   * data: object hoặc string
   * onSuccess: callback sau khi thành công
   */
  const upsertInits = async ({ type, data, onSuccess }) => {
    if (!type || !data) {
      alert('Lack of type or data!');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backend}inits/${type}`, {
        method: 'POST', // API upsert chúng ta đã viết
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Update successfully!');
        if (onSuccess) onSuccess(result);
      } else {
        alert('Update fail: ' + result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };
  return { upsertInits, loading, error };
};

export const handleUploadPdf = async ({ file, type, setFile }) => {
  if (!file) return;
  if (file.type !== 'application/pdf') {
    alert('PDF File only');
    return;
  }
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('type', type);
  try {
    const res = await fetch(`${backend}pdf/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message); // "PDF updated successfully" hoặc "PDF created successfully"
      setFile(null);
    } else {
      alert('Upload PDF fail: ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Server error when uploading PDF');
  }
};

export const useSendAnnouncement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const sendAnnouncement = async ({ subject, message, emails, imgs }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`${backend}send-announcement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          message,
          emails,
          imgs,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Send email failed');
      }
      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message || 'Unknown error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendAnnouncement,
    loading,
    error,
    success,
  };
};

// Lấy danh sách PDF (metadata, không trả file raw)
const fetchPdfs = async () => {
  try {
    const res = await fetch(`${backend}pdf`);
    const data = await res.json();
    if (data.success) {
      // map thêm field name từ backend
      return data.data.map((pdf) => ({
        id: pdf.id,
        type: pdf.type,
        name: pdf.name, // <- thêm name
        created_at: pdf.created_at,
        data: pdf.data, // base64 nếu cần preview
      }));
    } else {
      alert('Get PDF fail: ' + data.message);
      return [];
    }
  } catch (err) {
    console.error(err);
    alert('Server error when getting PDF');
    return [];
  }
};
export const useFetchPdfs = () => {
  const [pdfs, setPdfs] = useState([]);
  useEffect(() => {
    const loadPdfs = async () => {
      const data = await fetchPdfs();
      setPdfs(data || []);
    };
    loadPdfs();
  }, []);
  return { pdfs };
};
export const downloadPdfByType = async (type) => {
  try {
    // Lấy metadata PDF để có tên file
    const resMeta = await fetch(`${backend}pdf`);
    const dataMeta = await resMeta.json();
    const pdfMeta = dataMeta.data.find((p) => p.type === type);
    if (!pdfMeta) throw new Error('PDF File not found');
    const res = await fetch(`${backend}pdf/${type}`);
    if (!res.ok) throw new Error('PDF File not found');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfMeta.name; // sử dụng tên gốc
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(err);
    alert('Download PDF fail');
  }
};
