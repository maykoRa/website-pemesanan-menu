import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama_pengguna: '',
    username: '',
    email: '',
    kata_sandi: '',
    profile_picture: ''
  });

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('User profile not found');
      }
      const profileData = await response.json();
      setProfile(profileData);
      setFormData({
        nama_pengguna: profileData.nama_pengguna,
        username: profileData.username,
        email: profileData.email,
        kata_sandi: profileData.kata_sandi,
        profile_picture: ''
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profile_picture: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetch(`http://localhost:5000/pengguna/${profile.id_pengguna}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      await fetchUserProfile(); 
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <form className="profile-info" onSubmit={handleSubmit}>
          <h2>Fullname</h2>
          {isEditing ? (
            <input
              type="text"
              name="nama_pengguna"
              value={formData.nama_pengguna}
              onChange={handleInputChange}
            />
          ) : (
            <p>{profile.nama_pengguna}</p>
          )}
          <hr />
          <h2>Username</h2>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          ) : (
            <p>{profile.username}</p>
          )}
          <hr />
          <h2>Email Address</h2>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          ) : (
            <p>{profile.email}</p>
          )}
          <hr />
          <h2>Password</h2>
          {isEditing ? (
            <input
              type="password"
              name="kata_sandi"
              value={formData.kata_sandi}
              onChange={handleInputChange}
            />
          ) : (
            <p>{profile.kata_sandi}</p>
          )}
          <hr />
          {isEditing && (
            <div>
              <button type="submit" className="edit-profile-button">
                SAVE CHANGES
              </button>
            </div>
          )}
        </form>
        <div className="profile-picture">
          <img src={profile.profile_picture || '/assets/def.jpg'} alt="User" />
          {isEditing && (
            <input
              type="file"
              name="profile_picture"
              onChange={handleFileChange}
            />
          )}
          <button
            type="button"
            className="edit-profile-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'CANCEL' : 'EDIT PROFILE'} <i className="fas fa-edit"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
