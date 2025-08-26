import React from 'react';
import { useAuth } from '../context/AuthContext';
import moment from 'moment';
import 'moment/locale/tr';
import './AdminPanel.css';

function AdminPanel({ users, onExtendSubscription, onDeleteUser }) {
    const { currentUser } = useAuth();
    
    // Süper admin dışındaki tüm kullanıcıları listele
    const regularUsers = users.filter(user => user.role !== 'superadmin');

    return (
        <div className="admin-panel-container">
            <h1>Süper Admin Yönetim Paneli</h1>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Kullanıcı</th>
                        <th>İletişim</th>
                        <th>Abonelik Durumu</th>
                        <th>Bitiş Tarihi</th>
                        <th>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {regularUsers.map(user => (
                        <tr key={user.id}>
                            <td>
                                <div className="user-info">
                                    <img src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="user-avatar" />
                                    <div className="user-name-role">
                                        <div className="name">{user.name}</div>
                                        <div className="role">{user.role}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>{user.email}</div>
                                <div>{user.phone}</div>
                            </td>
                            <td className="status-cell">
                                {user.subscription && (
                                    <>
                                        <span className={`status ${user.subscription.status}`}>
                                            {user.subscription.status === 'active' ? 'Aktif' : 'Süresi Dolmuş'}
                                        </span>
                                        <div>{user.subscription.plan}</div>
                                    </>
                                )}
                            </td>
                            <td>
                                {user.subscription ? moment(user.subscription.endDate).format('LL') : 'Yok'}
                            </td>
                            <td className="actions-cell">
                                <button onClick={() => onExtendSubscription(user.id)} className="extend-btn">
                                    1 Ay Uzat
                                </button>
                                <button onClick={() => onDeleteUser(user.id)} className="delete-btn">
                                    Hesabı Sil
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminPanel;