'use client';
import { useState, useEffect } from 'react';

interface AVType {
  _id: string;
  antivirustypeIDP: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  validityInMonths: number;
  maxDevices: number;
  features: string[];
  image?: string;
  isActive: boolean;
}

interface AVKey {
  _id: string;
  antivirustypeIDF: string;
  key: string;
  isActive: boolean;
  isIssue: boolean;
  orderIDF: string;
  expiryDate: string;
  validityInMonths: number;
  createdAt: string;
}

interface AVOrder {
  _id: string;
  orderIDP: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  antivirusType: string;
  keyID?: string;
  key?: string;
  price: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const iconOptions = [
  'fa-shield-alt', 'fa-lock', 'fa-user-shield', 'fa-virus-slash',
  'fa-windows', 'fa-linux', 'fa-apple', 'fa-mobile-alt',
  'fa-laptop', 'fa-server', 'fa-database', 'fa-cloud',
];

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('types');
  const [toast, setToast] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  // Data states
  const [avTypes, setAvTypes] = useState<AVType[]>([]);
  const [avKeys, setAvKeys] = useState<AVKey[]>([]);
  const [avOrders, setAvOrders] = useState<AVOrder[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);

  // Form states
  const [typeForm, setTypeForm] = useState({
    antivirustypeIDP: '',
    name: '',
    description: '',
    icon: 'fa-shield-alt',
    price: '',
    validityInMonths: '',
    maxDevices: '1',
    features: '',
    image: '',
    isActive: true,
  });
  const [editingType, setEditingType] = useState<AVType | null>(null);

  const [keyForm, setKeyForm] = useState({
    antivirustypeIDF: '',
    key: '',
    expiryDate: '',
    validityInMonths: '',
    isActive: true,
  });
  const [editingKey, setEditingKey] = useState<AVKey | null>(null);
  const [bulkKeys, setBulkKeys] = useState('');
  const [bulkType, setBulkType] = useState('');
  const [bulkExpiry, setBulkExpiry] = useState('');
  const [bulkValidity, setBulkValidity] = useState('');

  const [keyFilter, setKeyFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const openConfirm = (message: string, onConfirm: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => onConfirm);
    setConfirmOpen(true);
  };

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user?.isAdmin) setIsAdmin(true);
      } catch {
        // not logged in
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Fetch data on tab change
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'types') fetchTypes();
    else if (activeTab === 'keys') fetchKeys();
    else if (activeTab === 'orders') fetchOrders();
    else if (activeTab === 'contacts') fetchContacts();
  }, [activeTab, isAdmin, keyFilter, orderStatusFilter]);

  const fetchTypes = async () => {
    try {
      const res = await fetch('/api/admin/antivirus/types');
      const data = await res.json();
      setAvTypes(data.success ? data.data : []);
    } catch { setAvTypes([]); }
  };

  const fetchKeys = async () => {
    try {
      const url = keyFilter
        ? `/api/admin/antivirus/keys?antivirustypeIDF=${encodeURIComponent(keyFilter)}`
        : '/api/admin/antivirus/keys';
      const res = await fetch(url);
      const data = await res.json();
      setAvKeys(data.success ? data.data : []);
    } catch { setAvKeys([]); }
  };

  const fetchOrders = async () => {
    try {
      const url = orderStatusFilter
        ? `/api/admin/antivirus/orders?status=${orderStatusFilter}`
        : '/api/admin/antivirus/orders';
      const res = await fetch(url);
      const data = await res.json();
      setAvOrders(data.success ? data.data : []);
    } catch { setAvOrders([]); }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : (data.contacts || []));
    } catch { setContacts([]); }
  };

  const logout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    window.location.replace('/');
  };

  // === TYPE CRUD ===
  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const featuresArray = typeForm.features.split('\n').map(f => f.trim()).filter(Boolean);

    const body = {
      antivirustypeIDP: typeForm.antivirustypeIDP,
      name: typeForm.name,
      description: typeForm.description,
      icon: typeForm.icon,
      price: Number(typeForm.price),
      validityInMonths: Number(typeForm.validityInMonths),
      maxDevices: Number(typeForm.maxDevices),
      features: featuresArray,
      image: typeForm.image,
      isActive: typeForm.isActive,
    };

    try {
      const url = editingType
        ? `/api/admin/antivirus/types/${editingType._id}`
        : '/api/admin/antivirus/types';
      const method = editingType ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        resetTypeForm();
        fetchTypes();
        showToast(editingType ? 'Type updated!' : 'Type created!');
      } else {
        const d = await res.json();
        alert(d.error || 'Failed');
      }
    } catch { alert('Something went wrong'); }
  };

  const deleteType = async (id: string) => {
    openConfirm('Delete this antivirus type?', async () => {
      await fetch(`/api/admin/antivirus/types/${id}`, { method: 'DELETE' });
      fetchTypes();
      showToast('Type deleted');
    });
  };

  const resetTypeForm = () => {
    setEditingType(null);
    setTypeForm({ antivirustypeIDP: '', name: '', description: '', icon: 'fa-shield-alt', image: '', price: '', validityInMonths: '', maxDevices: '1', features: '', isActive: true });
  };

  const startEditType = (t: AVType) => {
    setEditingType(t);
    setTypeForm({
      antivirustypeIDP: t.antivirustypeIDP,
      name: t.name,
      description: t.description,
      icon: t.icon,
      price: String(t.price),
      validityInMonths: String(t.validityInMonths),
      maxDevices: String(t.maxDevices),
      features: t.features.join('\n'),
      image: t.image || '',
      isActive: t.isActive,
    });
  };

  // === KEY CRUD ===
  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expiry = new Date(keyForm.expiryDate);
    if (isNaN(expiry.getTime())) { alert('Invalid expiry date'); return; }

    try {
      const url = editingKey
        ? `/api/admin/antivirus/keys/${editingKey._id}`
        : '/api/admin/antivirus/keys';
      const method = editingKey ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          antivirustypeIDF: keyForm.antivirustypeIDF,
          key: keyForm.key,
          expiryDate: expiry.toISOString(),
          validityInMonths: Number(keyForm.validityInMonths),
          isActive: keyForm.isActive,
        }),
      });
      if (res.ok) {
        resetKeyForm();
        fetchKeys();
        showToast(editingKey ? 'Key updated!' : 'Key added!');
      }
    } catch { alert('Something went wrong'); }
  };

  const handleBulkKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkKeys.split('\n').map(k => k.trim()).filter(Boolean);
    if (!bulkType || !bulkExpiry || !bulkValidity || lines.length === 0) {
      alert('Fill all fields and add at least one key');
      return;
    }
    const expiry = new Date(bulkExpiry);

    let success = 0, fail = 0;
    for (const keyStr of lines) {
      const res = await fetch('/api/admin/antivirus/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          antivirustypeIDF: bulkType,
          key: keyStr,
          expiryDate: expiry.toISOString(),
          validityInMonths: Number(bulkValidity),
        }),
      });
      if (res.ok) success++; else fail++;
    }
    showToast(`Added ${success} keys${fail > 0 ? `, ${fail} failed` : ''}`);
    setBulkKeys('');
    fetchKeys();
  };

  const deleteKey = async (id: string) => {
    openConfirm('Delete this license key?', async () => {
      await fetch(`/api/admin/antivirus/keys/${id}`, { method: 'DELETE' });
      fetchKeys();
      showToast('Key deleted');
    });
  };

  const resetKeyForm = () => {
    setEditingKey(null);
    setKeyForm({ antivirustypeIDF: '', key: '', expiryDate: '', validityInMonths: '', isActive: true });
  };

  const startEditKey = (k: AVKey) => {
    setEditingKey(k);
    setKeyForm({
      antivirustypeIDF: k.antivirustypeIDF,
      key: k.key,
      expiryDate: k.expiryDate ? new Date(k.expiryDate).toISOString().split('T')[0] : '',
      validityInMonths: String(k.validityInMonths),
      isActive: k.isActive,
    });
  };

  // === ORDER ACTIONS ===
  const assignKeyToOrder = async (order: AVOrder) => {
    // Find available keys for this type
    try {
      const res = await fetch(`/api/admin/antivirus/keys?antivirustypeIDF=${encodeURIComponent(order.antivirusType)}&isIssue=false`);
      const data = await res.json();
      const availableKeys: AVKey[] = data.success ? data.data : [];

      if (availableKeys.length === 0) {
        alert('No available keys for this antivirus type. Add keys first.');
        return;
      }

      const selectedKey = availableKeys[0];
      const updateRes = await fetch(`/api/admin/antivirus/orders/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: 'completed',
          paymentStatus: 'paid',
          keyID: selectedKey._id,
          key: selectedKey.key,
        }),
      });

      if (updateRes.ok) {
        fetchOrders();
        fetchKeys();
        showToast(`Key assigned! Order ${order.orderIDP} completed.`);
      }
    } catch { alert('Failed to assign key'); }
  };

  const updateOrderStatus = async (order: AVOrder, newStatus: string) => {
    await fetch(`/api/admin/antivirus/orders/${order._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus: newStatus }),
    });
    fetchOrders();
    showToast('Order status updated');
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1><i className="fas fa-shield-alt"></i> SecureGuard Admin</h1>
          <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1><i className="fas fa-lock"></i> Access Denied</h1>
          <p style={{ textAlign: 'center', color: '#666', margin: '1rem 0' }}>
            You do not have admin privileges.
          </p>
          <p style={{ textAlign: 'center' }}>
            <a href="/" style={{ color: '#ce962e' }}>Go back to homepage</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {toast && <div className="admin-toast"><i className="fas fa-check-circle"></i> {toast}</div>}

      <div className="admin-header">
        <h1><i className="fas fa-shield-alt"></i> SecureGuard Admin Panel</h1>
        <div className="header-actions">
          <a href="/" className="btn-back"><i className="fas fa-arrow-left"></i> Website</a>
          <button className="btn-logout" onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'types' ? 'active' : ''} onClick={() => setActiveTab('types')}>
          <i className="fas fa-shield-virus"></i> Antivirus Types ({avTypes.length})
        </button>
        <button className={activeTab === 'keys' ? 'active' : ''} onClick={() => setActiveTab('keys')}>
          <i className="fas fa-key"></i> License Keys ({avKeys.length})
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
          <i className="fas fa-shopping-cart"></i> Orders ({avOrders.length})
        </button>
        <button className={activeTab === 'contacts' ? 'active' : ''} onClick={() => setActiveTab('contacts')}>
          <i className="fas fa-envelope"></i> Contacts ({contacts.length})
        </button>
      </div>

      <div className="admin-content">
        {/* ==================== ANTIVIRUS TYPES ==================== */}
        {activeTab === 'types' && (
          <div>
            <form className="av-form" onSubmit={handleTypeSubmit}>
              <h2><i className="fas fa-plus-circle"></i> {editingType ? 'Edit Type' : 'Add Antivirus Type'}</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Type ID (unique) *</label>
                  <input type="text" className="box" placeholder="e.g. Norton-2025" value={typeForm.antivirustypeIDP}
                    onChange={e => setTypeForm({ ...typeForm, antivirustypeIDP: e.target.value })} required disabled={!!editingType} />
                </div>
                <div className="form-group">
                  <label>Display Name *</label>
                  <input type="text" className="box" placeholder="e.g. Norton Antivirus" value={typeForm.name}
                    onChange={e => setTypeForm({ ...typeForm, name: e.target.value })} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (Rs) *</label>
                  <input type="number" className="box" placeholder="1299" value={typeForm.price}
                    onChange={e => setTypeForm({ ...typeForm, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Validity (months) *</label>
                  <input type="number" className="box" placeholder="12" value={typeForm.validityInMonths}
                    onChange={e => setTypeForm({ ...typeForm, validityInMonths: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Max Devices</label>
                  <input type="number" className="box" placeholder="1" value={typeForm.maxDevices}
                    onChange={e => setTypeForm({ ...typeForm, maxDevices: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label>Icon (FontAwesome class)</label>
                <div className="icon-picker">
                  {iconOptions.map(icon => (
                    <button type="button" key={icon}
                      className={`icon-option ${typeForm.icon === icon ? 'selected' : ''}`}
                      onClick={() => setTypeForm({ ...typeForm, icon })}>
                      <i className={`fas ${icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="box" rows={2} placeholder="Brief description..."
                  value={typeForm.description}
                  onChange={e => setTypeForm({ ...typeForm, description: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Features (one per line)</label>
                <textarea className="box" rows={4} placeholder={"Real-time Protection\nPassword Manager\nSmart Firewall"}
                  value={typeForm.features}
                  onChange={e => setTypeForm({ ...typeForm, features: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Product Image</label>
                <input type="file" className="box" accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const formData = new FormData();
                      formData.append('file', e.target.files[0]);
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: formData });
                        const data = await res.json();
                        if (data.success) {
                          setTypeForm({ ...typeForm, image: data.url });
                        } else {
                          alert('Upload failed: ' + data.error);
                        }
                      } catch {
                        alert('Upload failed');
                      }
                    }
                  }} />
                {typeForm.image && (
                  <div style={{ marginTop: '1rem' }}>
                    <img src={typeForm.image} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>
                  <input type="checkbox" checked={typeForm.isActive}
                    onChange={e => setTypeForm({ ...typeForm, isActive: e.target.checked })} />
                  {' '}Active (visible to users)
                </label>
              </div>

              <div className="form-actions">
                {editingType && (
                  <button type="button" className="btn-cancel" onClick={resetTypeForm}>Cancel</button>
                )}
                <button type="submit" className="btn">
                  <i className="fas fa-check"></i> {editingType ? 'Update Type' : 'Add Type'}
                </button>
              </div>
            </form>

            <h2 style={{ marginTop: '3rem' }}><i className="fas fa-list"></i> All Antivirus Types ({avTypes.length})</h2>
            <div className="av-types-grid">
              {avTypes.map(t => (
                <div key={t._id} className={`av-type-card ${!t.isActive ? 'inactive' : ''}`}>
                  <div className="av-type-header">
                    <div className="av-type-icon">
                      {t.image ? (
                        <img src={t.image} alt={t.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                      ) : (
                        <i className={`fas ${t.icon}`}></i>
                      )}
                    </div>
                    <div>
                      <h3>{t.name}</h3>
                      <span className="av-type-id">{t.antivirustypeIDP}</span>
                    </div>
                    {!t.isActive && <span className="av-badge inactive">Inactive</span>}
                    {t.isActive && <span className="av-badge active">Active</span>}
                  </div>
                  <div className="av-type-body">
                    <p className="av-type-price">Rs.{t.price.toLocaleString()}</p>
                    <p className="av-type-meta"><i className="fas fa-calendar"></i> {t.validityInMonths} months | <i className="fas fa-laptop"></i> {t.maxDevices} device(s)</p>
                    {t.features.length > 0 && (
                      <ul className="av-type-features">
                        {t.features.slice(0, 3).map((f, i) => <li key={i}><i className="fas fa-check"></i> {f}</li>)}
                      </ul>
                    )}
                  </div>
                  <div className="av-type-actions">
                    <button className="btn-edit" onClick={() => startEditType(t)}><i className="fas fa-edit"></i> Edit</button>
                    <button className="btn-delete" onClick={() => deleteType(t._id)}><i className="fas fa-trash"></i> Delete</button>
                  </div>
                </div>
              ))}
              {avTypes.length === 0 && (
                <div className="empty-msg">No antivirus types yet. Add one above.</div>
              )}
            </div>
          </div>
        )}

        {/* ==================== LICENSE KEYS ==================== */}
        {activeTab === 'keys' && (
          <div>
            <div className="av-keys-layout">
              <form className="av-form" onSubmit={handleKeySubmit}>
                <h3><i className="fas fa-key"></i> {editingKey ? 'Edit Key' : 'Add Single Key'}</h3>
                <div className="form-group">
                  <label>Antivirus Type *</label>
                  <select className="box" value={keyForm.antivirustypeIDF}
                    onChange={e => setKeyForm({ ...keyForm, antivirustypeIDF: e.target.value })} required>
                    <option value="">Select type...</option>
                    {avTypes.map(t => <option key={t._id} value={t.antivirustypeIDP}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>License Key *</label>
                  <input type="text" className="box" placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={keyForm.key}
                    onChange={e => setKeyForm({ ...keyForm, key: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input type="date" className="box" value={keyForm.expiryDate}
                      onChange={e => setKeyForm({ ...keyForm, expiryDate: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Validity (months) *</label>
                    <input type="number" className="box" placeholder="12"
                      value={keyForm.validityInMonths}
                      onChange={e => setKeyForm({ ...keyForm, validityInMonths: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label><input type="checkbox" checked={keyForm.isActive}
                    onChange={e => setKeyForm({ ...keyForm, isActive: e.target.checked })} /> Active</label>
                </div>
                <div className="form-actions">
                  {editingKey && <button type="button" className="btn-cancel" onClick={resetKeyForm}>Cancel</button>}
                  <button type="submit" className="btn">
                    <i className="fas fa-check"></i> {editingKey ? 'Update' : 'Add Key'}
                  </button>
                </div>
              </form>

              <form className="av-form" onSubmit={handleBulkKeys}>
                <h3><i className="fas fa-list"></i> Bulk Add Keys</h3>
                <div className="form-group">
                  <label>Antivirus Type *</label>
                  <select className="box" value={bulkType}
                    onChange={e => setBulkType(e.target.value)} required>
                    <option value="">Select type...</option>
                    {avTypes.map(t => <option key={t._id} value={t.antivirustypeIDP}>{t.name}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input type="date" className="box" value={bulkExpiry}
                      onChange={e => setBulkExpiry(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Validity (months) *</label>
                    <input type="number" className="box" placeholder="12"
                      value={bulkValidity}
                      onChange={e => setBulkValidity(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>License Keys (one per line)</label>
                  <textarea className="box" rows={5} placeholder={"XXXX-XXXX-XXXX-0001\nXXXX-XXXX-XXXX-0002\nXXXX-XXXX-XXXX-0003"}
                    value={bulkKeys}
                    onChange={e => setBulkKeys(e.target.value)} />
                </div>
                <button type="submit" className="btn">
                  <i className="fas fa-plus"></i> Bulk Add All Keys
                </button>
              </form>
            </div>

            <div className="av-filter-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Filter by Type</label>
                <select className="box" value={keyFilter}
                  onChange={e => setKeyFilter(e.target.value)}>
                  <option value="">All Types</option>
                  {avTypes.map(t => <option key={t._id} value={t.antivirustypeIDP}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <table className="orders-table" style={{ marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Key</th>
                  <th>Antivirus Type</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Issued</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {avKeys.map((k, i) => {
                  const expiry = new Date(k.expiryDate);
                  const isExpired = expiry < new Date();
                  return (
                    <tr key={k._id} className={isExpired ? 'row-expired' : ''}>
                      <td>{i + 1}</td>
                      <td className="key-cell">{k.key}</td>
                      <td>{k.antivirustypeIDF}</td>
                      <td>{expiry.toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${isExpired || !k.isActive ? 'cancelled' : 'completed'}`}>
                          {isExpired ? 'Expired' : !k.isActive ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${k.isIssue ? 'completed' : 'pending'}`}>
                          {k.isIssue ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        {!k.isIssue && (
                          <button className="btn-edit" onClick={() => startEditKey(k)}>
                            <i className="fas fa-edit"></i>
                          </button>
                        )}
                        <button className="btn-delete" onClick={() => deleteKey(k._id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {avKeys.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No keys found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== ORDERS ==================== */}
        {activeTab === 'orders' && (
          <div>
            <div className="av-filter-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Filter by Status</label>
                <select className="box" value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}>
                  <option value="">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <table className="orders-table" style={{ marginTop: '1rem' }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Key</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {avOrders.map(order => (
                  <tr key={order._id}>
                    <td className="order-id-cell">{order.orderIDP}</td>
                    <td>{order.customerName}</td>
                    <td>{order.customerPhone}</td>
                    <td>{order.customerEmail}</td>
                    <td>{order.antivirusType}</td>
                    <td>Rs.{order.price.toLocaleString()}</td>
                    <td className="key-cell">
                      {order.key ? (
                        <span className="key-display">{order.key}</span>
                      ) : (
                        <span style={{ color: '#999', fontSize: '1.1rem' }}>—</span>
                      )}
                    </td>
                    <td>
                      <select className="box status-select"
                        value={order.orderStatus}
                        onChange={e => updateOrderStatus(order, e.target.value)}>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      {!order.key && order.orderStatus !== 'cancelled' && (
                        <button className="btn-approve" onClick={() => assignKeyToOrder(order)}>
                          <i className="fas fa-key"></i> Assign Key
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {avOrders.length === 0 && (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: '2rem' }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ==================== CONTACTS ==================== */}
        {activeTab === 'contacts' && (
          <div>
            <h2><i className="fas fa-envelope"></i> Contact Submissions ({contacts.length})</h2>
            <div className="contacts-list">
              {contacts.map((c: any) => (
                <div key={c._id} className="contact-admin-card">
                  <div className="contact-admin-header">
                    <h3>{c.name}</h3>
                    <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="contact-admin-details">
                    <p><i className="fas fa-phone"></i> {c.phone}</p>
                    <p><i className="fas fa-envelope"></i> {c.email}</p>
                    {c.projectType && <p><i className="fas fa-tag"></i> {c.projectType}</p>}
                  </div>
                  {c.message && <div className="contact-admin-message"><p>{c.message}</p></div>}
                  <div className="contact-admin-actions">
                    <a href={`tel:${c.phone}`} className="btn-call"><i className="fas fa-phone"></i> Call</a>
                    <a href={`mailto:${c.email}`} className="btn-email"><i className="fas fa-envelope"></i> Email</a>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="empty-msg">No contact submissions yet.</div>
              )}
            </div>
          </div>
        )}
      </div>

      {confirmOpen && (
        <div className="confirm-overlay" onClick={() => setConfirmOpen(false)}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon"><i className="fas fa-trash-alt"></i></div>
            <h3>Confirm Delete</h3>
            <p>{confirmMessage}</p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="confirm-delete" onClick={() => { if (confirmAction) confirmAction(); setConfirmOpen(false); }}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
