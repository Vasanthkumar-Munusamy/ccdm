'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import AlertModal from '@/components/AlertModal';
import { useAuth } from '@/context/AuthContext';

const PdfThumbnail = dynamic(() => import('@/components/PdfThumbnail'), { ssr: false });

interface Profile {
  id: number;
  name: string;
  gender: string;
  age: number;
  dob: string;
  contact_number: string;
  email: string;
  city: string;
  height: string;
  weight: string;
  mother_tongue: string;
  education: string;
  job: string;
  salary: string;
  father_name: string;
  father_job: string;
  mother_name: string;
  mother_job: string;
  siblings: string;
  siblings_job: string;
  church_denomination: string;
  church_name: string;
  pastor_name: string;
  pastor_contact: string;
  marital_status: string;
  hobbies: string;
  about_yourself: string;
  expectation: string;
  pdf_url: string;
  image_url?: string;
  created_at: string;
  user_id?: number;
  // Legacy
  location?: string;
  contact_info?: string;
  occupation?: string;
}

export default function MatrimonyPage() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewDetailsProfile, setPreviewDetailsProfile] = useState<Profile | null>(null);

  // Image upload state for standard biodata
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Alert modal state
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalTitle, setAlertModalTitle] = useState("");
  const [alertModalMessage, setAlertModalMessage] = useState("");

  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);

  const showAlert = (title: string, message: string) => {
    setAlertModalTitle(title);
    setAlertModalMessage(message);
    setAlertModalOpen(true);
  };

  // Form State
  const emptyForm = {
    name: '',
    gender: '',
    age: '',
    dob: '',
    contact_number: '',
    email: '',
    city: '',
    height: '',
    weight: '',
    mother_tongue: '',
    education: '',
    job: '',
    salary: '',
    father_name: '',
    father_job: '',
    mother_name: '',
    mother_job: '',
    siblings: '',
    siblings_job: '',
    church_denomination: '',
    church_name: '',
    pastor_name: '',
    pastor_contact: '',
    marital_status: '',
    hobbies: '',
    about_yourself: '',
    expectation: '',
    pdf_url: '',
    // Legacy maps
    location: '',
    occupation: '',
    contact_info: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/matrimony');
      if (res.ok) {
        const data = await res.json();
        setProfiles(data);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showAlert('Invalid File', 'Please upload a valid PDF file.');
      return;
    }

    setUploadingPdf(true);
    const data = new FormData();
    data.append('image', file); // Use 'image' to ensure compatibility with backend

    try {
      const res = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: data,
      });

      if (res.ok) {
        const result = await res.json();

        // Auto-submit the profile with the uploaded PDF
        const payload = {
          ...formData,
          name: formData.name || file.name,
          gender: formData.gender || 'Not specified',
          age: parseInt(formData.age) || 0,
          city: formData.city || 'Not specified',
          contact_number: formData.contact_number || 'Not specified',
          pdf_url: result.url
        };

        const submitRes = await fetch('http://localhost:8080/api/matrimony', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(payload)
        });

        if (submitRes.ok) {
          showAlert('Success', 'PDF Biodata uploaded and added successfully!');
          setIsModalOpen(false);
          setFormData({ name: '', gender: '', age: '', location: '', height: '', education: '', occupation: '', expectation: '', contact_info: '', pdf_url: '' });
          fetchProfiles();
        } else {
          showAlert('Error', 'Failed to save Biodata.');
        }
      } else {
        showAlert('Error', 'Failed to upload PDF.');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      showAlert('Error', 'Error uploading PDF.');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = '';
      if (selectedImage) {
        const data = new FormData();
        data.append('image', selectedImage);
        const uploadRes = await fetch('http://localhost:8080/api/upload', {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: data,
        });
        if (uploadRes.ok) {
          const result = await uploadRes.json();
          imageUrl = result.url;
        } else {
          showAlert('Error', 'Failed to upload image. Submitting without image.');
        }
      }

      const payload = {
        ...formData,
        age: parseInt(formData.age) || 0,
        image_url: imageUrl,
      };

      const endpoint = editingProfileId ? `http://localhost:8080/api/matrimony/${editingProfileId}` : 'http://localhost:8080/api/matrimony';
      const method = editingProfileId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showAlert('Success', editingProfileId ? 'Biodata updated successfully!' : 'Biodata submitted successfully!');
        setIsModalOpen(false);
        setEditingProfileId(null);
        setFormData(emptyForm);
        setSelectedImage(null);
        fetchProfiles();
      } else {
        showAlert('Error', 'Failed to submit biodata.');
      }
    } catch (error) {
      console.error('Error submitting biodata:', error);
      showAlert('Error', 'An error occurred while submitting.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this profile?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/matrimony/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (res.ok) {
        showAlert('Success', 'Profile deleted successfully');
        fetchProfiles();
      } else {
        const data = await res.json();
        showAlert('Error', data.error || 'Failed to delete profile');
      }
    } catch (error) {
      showAlert('Error', 'Network error while deleting');
    }
  };

  const openEditModal = (profile: Profile) => {
    setEditingProfileId(profile.id);
    setFormData({
      name: profile.name || '',
      gender: profile.gender || '',
      age: profile.age ? profile.age.toString() : '',
      dob: profile.dob || '',
      contact_number: profile.contact_number || profile.contact_info || '',
      email: profile.email || '',
      city: profile.city || profile.location || '',
      height: profile.height || '',
      weight: profile.weight || '',
      mother_tongue: profile.mother_tongue || '',
      education: profile.education || '',
      job: profile.job || profile.occupation || '',
      salary: profile.salary || '',
      father_name: profile.father_name || '',
      father_job: profile.father_job || '',
      mother_name: profile.mother_name || '',
      mother_job: profile.mother_job || '',
      siblings: profile.siblings || '',
      siblings_job: profile.siblings_job || '',
      church_denomination: profile.church_denomination || '',
      church_name: profile.church_name || '',
      pastor_name: profile.pastor_name || '',
      pastor_contact: profile.pastor_contact || '',
      marital_status: profile.marital_status || '',
      hobbies: profile.hobbies || '',
      about_yourself: profile.about_yourself || '',
      expectation: profile.expectation || '',
      pdf_url: profile.pdf_url || '',
      location: profile.location || '',
      occupation: profile.occupation || '',
      contact_info: profile.contact_info || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#881337]">Matrimonial Profiles</h1>
          <button
            onClick={() => {
              if (!user) {
                showAlert('Authentication Required', 'Please login to add your biodata.');
                setTimeout(() => router.push('/login'), 2000);
              } else {
                setIsModalOpen(true);
              }
            }}
            className="bg-[#c2185b] hover:bg-[#ad1457] text-white px-4 py-2 rounded shadow transition-colors font-medium"
          >
            Add Biodata
          </button>
        </div>

        <div className="bg-pink-50 border border-pink-200 text-pink-900 p-4 rounded-lg shadow-sm mb-8 text-center leading-relaxed text-sm md:text-base">
          <p>சகோதரர்களே, நமது ஊழியத்தின்மூலம் சாதி மறுப்பு கொள்கையை ஏற்றுக்கொண்டவர்கள் பலர் நம்மிடம் உண்டு. அவர்களெல்லாரும் சாதி மறுப்பு திருமணத்துக்கென தங்களை ஒப்புக்கொடுத்துள்ளார்கள். எனவே, சாதி மறுப்பு திருமணம் செய்ய விருப்பமுடையோர் உங்கள் தனிப்பட்ட தகவல்களை எங்களுக்கு அனுப்பினால் நமது குழுக்களில் பிரசுரிக்கலாம். மிக விரைவில் ஏற்ற துணைகளை கண்டுபிடிக்கலாம், உங்களுக்கு திருமணம் நிச்சயிக்கப்பட்டாலோ அல்லது திருமணம் நடந்தாலோ எங்களுக்கு தெரியபடுத்தும் பட்ச்சத்தில் உங்கள் தகவல்களை எங்களுடைய கோப்பிலிருந்து நீக்கிவிடுவோம் எக்காரணத்தை கொண்டு மணமகள் மணமகன் என்ன ஜாதி என்று தெரிந்து கொள்வதை தவிர்த்துவிடுங்கள், அதுபோன்று உங்கள் தகவல்களில் ஜாதி பெயரை குறிப்பிட வேண்டாம் என்று கேட்டுக் கொள்கிறோம், மிக விரைவில் உங்களுக்கு வரன் கிடைக்க ஜெபித்துக்கொள்கிறோம், வாழ்த்துக்கள்.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading profiles...</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded shadow p-8">
            No matrimonial profiles found. Be the first to add your biodata!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map(profile => {
              const isPdfOnly = profile.age === 0 && profile.pdf_url;

              if (isPdfOnly) {
                const uploadDate = new Date(profile.created_at);
                return (
                  <div
                    key={profile.id}
                    className="bg-white rounded-2xl shadow-md border border-[#c2185b] p-2 flex flex-col group relative"
                  >
                    <div
                      className="flex flex-col rounded-xl overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setPreviewPdfUrl(`http://localhost:8080${profile.pdf_url}`)}
                    >
                      {/* Portion 1: PDF Preview */}
                      <div className="h-48 bg-gray-50 flex items-start justify-center relative overflow-hidden border-b border-gray-200">
                        <PdfThumbnail url={`http://localhost:8080${profile.pdf_url}`} />
                        <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors flex items-center justify-center z-10">
                          <span className="opacity-0 group-hover:opacity-100 text-white bg-black/60 px-4 py-2 rounded-full font-medium text-sm transition-opacity duration-300 shadow-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View PDF
                          </span>
                        </div>
                      </div>

                      {/* Portion 2: Title and Date */}
                      <div className="bg-[#c2185b] text-white p-4 text-center">
                        <h3 className="font-bold text-lg mb-1 truncate">{profile.name}</h3>
                        <p className="text-pink-100 text-sm">
                          {uploadDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {user && user.id === profile.user_id && (
                      <div className="absolute top-2 right-2 flex gap-2 z-20">
                        <button onClick={(e) => { e.stopPropagation(); openEditModal(profile); }} className="bg-white text-[#c2185b] p-1.5 rounded-full shadow hover:bg-gray-100">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }} className="bg-white text-red-600 p-1.5 rounded-full shadow hover:bg-red-50">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div key={profile.id} className="bg-white rounded-2xl shadow-md border border-[#c2185b] p-2 flex flex-col relative group">

                  <div
                    className="flex flex-col rounded-xl overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setPreviewDetailsProfile(profile)}
                  >
                    {/* Portion 1: Photo Preview */}
                    <div className="h-48 bg-gray-50 flex items-start justify-center relative overflow-hidden border-b border-gray-200">
                      {profile.image_url ? (
                        <img src={`http://localhost:8080${profile.image_url}`} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400">
                          <svg className="w-12 h-12 mb-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                          <span className="text-sm font-medium">No Photo</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors flex items-center justify-center z-10">
                        <span className="opacity-0 group-hover:opacity-100 text-white bg-black/60 px-4 py-2 rounded-full font-medium text-sm transition-opacity duration-300 shadow-sm flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          View Details
                        </span>
                      </div>
                    </div>

                    {/* Portion 2: Title and Date */}
                    <div className="bg-[#c2185b] p-5 text-center flex-grow">
                      <h3 className="text-xl font-bold text-white truncate drop-shadow-sm">{profile.name}</h3>
                      <p className="text-white mt-2 text-sm opacity-90">{new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>

                  {user && user.id === profile.user_id && (
                    <div className="absolute top-4 right-4 flex gap-2 z-20">
                      <button onClick={(e) => { e.stopPropagation(); openEditModal(profile); }} className="bg-white text-[#c2185b] p-2 rounded-full shadow hover:bg-gray-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }} className="bg-white text-red-600 p-2 rounded-full shadow hover:bg-red-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}


      </main>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-[#fdf2f8]">
              <h2 className="text-xl font-bold text-[#881337]">{editingProfileId ? 'Edit Biodata' : 'Add Biodata'}</h2>

              <div className="flex items-center gap-4">
                {/* PDF Upload Button positioned at top right of the form */}
                <div className="relative">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="pdf-upload"
                  />
                  <label
                    htmlFor="pdf-upload"
                    className={`cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-[#c2185b] rounded text-sm font-medium ${formData.pdf_url ? 'bg-green-50 text-green-700 border-green-500' : 'text-[#c2185b] hover:bg-pink-50'
                      } transition-colors`}
                  >
                    {uploadingPdf ? 'Uploading...' : formData.pdf_url ? 'PDF Uploaded ✓' : 'Upload Biodata as PDF'}
                  </label>
                </div>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProfileId(null);
                    setFormData(emptyForm);
                    setSelectedImage(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 font-bold text-xl px-2"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form id="biodata-form" onSubmit={handleSubmit} className="space-y-4">

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                    className="w-full text-gray-900 border border-gray-300 rounded p-2 focus:ring-[#c2185b] focus:border-[#c2185b] bg-white"
                  />
                </div>

                {/* Personal Details Group */}
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h3 className="text-[#881337] font-bold text-lg mb-3 border-b pb-2">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div><label className="block text-sm text-gray-700 mb-1">Full Name *</label><input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Gender *</label>
                      <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900">
                        <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option>
                      </select>
                    </div>
                    <div><label className="block text-sm text-gray-700 mb-1">Age *</label><input required type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" min="18" max="100" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">DOB</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Contact Number *</label><input required type="text" name="contact_number" value={formData.contact_number} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">E-Mail</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">City *</label><input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Height</label><input type="text" name="height" value={formData.height} onChange={handleInputChange} placeholder="e.g. 5'8&quot;" className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Weight</label><input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 65kg" className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Mother Tongue</label><input type="text" name="mother_tongue" value={formData.mother_tongue} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Education</label><input type="text" name="education" value={formData.education} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Job</label><input type="text" name="job" value={formData.job} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Salary</label><input type="text" name="salary" value={formData.salary} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Marital Status</label>
                      <select name="marital_status" value={formData.marital_status} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900">
                        <option value="">Select</option><option value="Single">Single</option><option value="Widowed">Widowed</option><option value="Divorced">Divorced</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Family Details Group */}
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h3 className="text-[#881337] font-bold text-lg mb-3 border-b pb-2">Family Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-700 mb-1">Father's Name</label><input type="text" name="father_name" value={formData.father_name} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Father's Job</label><input type="text" name="father_job" value={formData.father_job} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Mother's Name</label><input type="text" name="mother_name" value={formData.mother_name} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Mother's Job</label><input type="text" name="mother_job" value={formData.mother_job} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Siblings</label><input type="text" name="siblings" value={formData.siblings} onChange={handleInputChange} placeholder="e.g. 1 Brother, 1 Sister" className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Siblings Job</label><input type="text" name="siblings_job" value={formData.siblings_job} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                  </div>
                </div>

                {/* Church & Religion Group */}
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h3 className="text-[#881337] font-bold text-lg mb-3 border-b pb-2">Church Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-700 mb-1">Church Denomination</label><input type="text" name="church_denomination" value={formData.church_denomination} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Church Name</label><input type="text" name="church_name" value={formData.church_name} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Pastor Name</label><input type="text" name="pastor_name" value={formData.pastor_name} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                    <div><label className="block text-sm text-gray-700 mb-1">Pastor Contact Number</label><input type="text" name="pastor_contact" value={formData.pastor_contact} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" /></div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-white p-4 rounded border border-gray-200 space-y-4">
                  <h3 className="text-[#881337] font-bold text-lg mb-3 border-b pb-2">Additional Information</h3>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Hobbies</label>
                    <input type="text" name="hobbies" value={formData.hobbies} onChange={handleInputChange} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">About Yourself</label>
                    <textarea name="about_yourself" value={formData.about_yourself} onChange={handleInputChange} rows={3} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" placeholder="Tell us about yourself..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Partner Expectations</label>
                    <textarea name="expectation" value={formData.expectation} onChange={handleInputChange} rows={3} className="w-full border p-2 rounded focus:ring-[#c2185b] bg-white text-gray-900" placeholder="What are you looking for in a partner?"></textarea>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProfileId(null);
                  setFormData(emptyForm);
                  setSelectedImage(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="biodata-form"
                disabled={submitting || uploadingPdf}
                className="px-6 py-2 bg-[#c2185b] text-white rounded hover:bg-[#ad1457] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : (editingProfileId ? 'Update Biodata' : 'Submit Biodata')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewPdfUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">Biodata Preview</h2>
              <div className="flex gap-4">
                <a
                  href={previewPdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#c2185b] text-white rounded hover:bg-[#ad1457] transition-colors text-sm font-medium"
                >
                  Download PDF
                </a>
                <button
                  onClick={() => setPreviewPdfUrl(null)}
                  className="text-gray-500 hover:text-gray-800 font-bold text-xl px-2"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-grow bg-gray-100 p-2">
              <iframe
                src={previewPdfUrl}
                className="w-full h-full border-0 rounded"
                title="PDF Preview"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Global Alert Modal */}
      <AlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title={alertModalTitle}
        message={alertModalMessage}
      />

      {/* Biodata Details Modal */}
      {previewDetailsProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Biodata Details</h2>
              <button
                onClick={() => setPreviewDetailsProfile(null)}
                className="text-gray-500 hover:text-gray-800 font-bold text-xl px-2"
              >
                ×
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-6">

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Photo */}
                <div className="w-full md:w-1/3 flex-shrink-0">
                  {previewDetailsProfile.image_url ? (
                    <img src={`http://localhost:8080${previewDetailsProfile.image_url}`} alt={previewDetailsProfile.name} className="w-full rounded-lg shadow-sm border border-gray-200" />
                  ) : (
                    <div className="w-full aspect-[3/4] rounded-lg shadow-sm border border-gray-200 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-16 h-16 mb-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                      <span className="font-medium">No Photo</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="border-b border-pink-100 pb-4">
                    <h3 className="text-3xl font-bold text-[#881337] mb-1">{previewDetailsProfile.name}</h3>
                    <p className="text-lg text-gray-600 font-medium">
                      {previewDetailsProfile.gender} • {previewDetailsProfile.age} yrs • {previewDetailsProfile.height}
                    </p>
                  </div>

                  <div className="space-y-6 pt-2">
                    {/* Personal Details */}
                    <div>
                      <h4 className="text-md font-bold text-[#881337] border-b pb-1 mb-3">Personal Details</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {previewDetailsProfile.dob && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">DOB</p><p className="font-medium text-gray-900">{previewDetailsProfile.dob}</p></div>}
                        {(previewDetailsProfile.city || previewDetailsProfile.location) && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">City</p><p className="font-medium text-gray-900">{previewDetailsProfile.city || previewDetailsProfile.location}</p></div>}
                        {previewDetailsProfile.weight && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Weight</p><p className="font-medium text-gray-900">{previewDetailsProfile.weight}</p></div>}
                        {previewDetailsProfile.mother_tongue && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mother Tongue</p><p className="font-medium text-gray-900">{previewDetailsProfile.mother_tongue}</p></div>}
                        {previewDetailsProfile.marital_status && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Marital Status</p><p className="font-medium text-gray-900">{previewDetailsProfile.marital_status}</p></div>}
                        {previewDetailsProfile.education && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Education</p><p className="font-medium text-gray-900">{previewDetailsProfile.education}</p></div>}
                        {(previewDetailsProfile.job || previewDetailsProfile.occupation) && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Job</p><p className="font-medium text-gray-900">{previewDetailsProfile.job || previewDetailsProfile.occupation}</p></div>}
                        {previewDetailsProfile.salary && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary</p><p className="font-medium text-gray-900">{previewDetailsProfile.salary}</p></div>}
                        {previewDetailsProfile.hobbies && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hobbies</p><p className="font-medium text-gray-900">{previewDetailsProfile.hobbies}</p></div>}
                        {(previewDetailsProfile.contact_number || previewDetailsProfile.contact_info) && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Number</p><p className="font-medium text-gray-900">{previewDetailsProfile.contact_number || previewDetailsProfile.contact_info}</p></div>}
                        {previewDetailsProfile.email && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</p><p className="font-medium text-gray-900">{previewDetailsProfile.email}</p></div>}
                      </div>
                    </div>

                    {/* Family Details */}
                    {(previewDetailsProfile.father_name || previewDetailsProfile.mother_name || previewDetailsProfile.siblings) && (
                      <div>
                        <h4 className="text-md font-bold text-[#881337] border-b pb-1 mb-3">Family Details</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {previewDetailsProfile.father_name && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Father's Name</p><p className="font-medium text-gray-900">{previewDetailsProfile.father_name}</p></div>}
                          {previewDetailsProfile.father_job && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Father's Job</p><p className="font-medium text-gray-900">{previewDetailsProfile.father_job}</p></div>}
                          {previewDetailsProfile.mother_name && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mother's Name</p><p className="font-medium text-gray-900">{previewDetailsProfile.mother_name}</p></div>}
                          {previewDetailsProfile.mother_job && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mother's Job</p><p className="font-medium text-gray-900">{previewDetailsProfile.mother_job}</p></div>}
                          {previewDetailsProfile.siblings && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Siblings</p><p className="font-medium text-gray-900">{previewDetailsProfile.siblings}</p></div>}
                          {previewDetailsProfile.siblings_job && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Siblings Job</p><p className="font-medium text-gray-900">{previewDetailsProfile.siblings_job}</p></div>}
                        </div>
                      </div>
                    )}

                    {/* Church Details */}
                    {(previewDetailsProfile.church_denomination || previewDetailsProfile.church_name) && (
                      <div>
                        <h4 className="text-md font-bold text-[#881337] border-b pb-1 mb-3">Church Details</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {previewDetailsProfile.church_denomination && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Denomination</p><p className="font-medium text-gray-900">{previewDetailsProfile.church_denomination}</p></div>}
                          {previewDetailsProfile.church_name && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Church Name</p><p className="font-medium text-gray-900">{previewDetailsProfile.church_name}</p></div>}
                          {previewDetailsProfile.pastor_name && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pastor Name</p><p className="font-medium text-gray-900">{previewDetailsProfile.pastor_name}</p></div>}
                          {previewDetailsProfile.pastor_contact && <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pastor Contact</p><p className="font-medium text-gray-900">{previewDetailsProfile.pastor_contact}</p></div>}
                        </div>
                      </div>
                    )}

                    {/* Descriptions */}
                    {(previewDetailsProfile.about_yourself || previewDetailsProfile.expectation) && (
                      <div className="space-y-4">
                        {previewDetailsProfile.about_yourself && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">About</p>
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{previewDetailsProfile.about_yourself}</p>
                          </div>
                        )}
                        {previewDetailsProfile.expectation && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Partner Expectations</p>
                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{previewDetailsProfile.expectation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {previewDetailsProfile.pdf_url && (
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setPreviewDetailsProfile(null);
                          setPreviewPdfUrl(`http://localhost:8080${previewDetailsProfile.pdf_url}`);
                        }}
                        className="inline-flex items-center gap-2 bg-[#c2185b] hover:bg-[#ad1457] text-white px-6 py-2 rounded-lg transition-colors font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        View Full Biodata PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
