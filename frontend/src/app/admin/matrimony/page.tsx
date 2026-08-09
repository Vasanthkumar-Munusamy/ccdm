'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ConfirmModal from '@/components/ConfirmModal';

const PdfThumbnail = dynamic(() => import('@/components/PdfThumbnail'), { ssr: false });

interface Profile {
  id: number;
  name: string;
  gender: string;
  age: number;
  location: string;
  height: string;
  education: string;
  occupation: string;
  expectation: string;
  contact_info: string;
  pdf_url: string;
  image_url?: string;
  created_at: string;
}

export default function AdminMatrimonyManager() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewDetailsProfile, setPreviewDetailsProfile] = useState<Profile | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuth(true);
      fetchProfiles();
    }
  }, [router]);

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

  const handleDeleteClick = (id: number) => {
    setProfileToDelete(id);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (profileToDelete === null) return;

    try {
      const response = await fetch(`http://localhost:8080/api/matrimony/${profileToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (response.ok) {
        setProfiles(profiles.filter(p => p.id !== profileToDelete));
      } else {
        alert('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Error deleting profile');
    } finally {
      setProfileToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  if (!isAuth) return <div className="min-h-screen bg-slate-100 p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-[#c2185b] text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="text-white hover:text-pink-200 transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold">Manage Matrimonial Profiles</h1>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
          }}
          className="text-sm bg-[#ad1457] hover:bg-pink-800 px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Biodata Profiles</h2>
        </div>

        <div className="bg-pink-50 border border-pink-200 text-pink-900 p-4 rounded-lg shadow-sm mb-6 text-center leading-relaxed text-sm md:text-base">
          <p>சகோதரர்களே, நமது ஊழியத்தின்மூலம் சாதி மறுப்பு கொள்கையை ஏற்றுக்கொண்டவர்கள் பலர் நம்மிடம் உண்டு. அவர்களெல்லாரும் சாதி மறுப்பு திருமணத்துக்கென தங்களை ஒப்புக்கொடுத்துள்ளார்கள். எனவே, சாதி மறுப்பு திருமணம் செய்ய விருப்பமுடையோர் உங்கள் தனிப்பட்ட தகவல்களை எங்களுக்கு அனுப்பினால் நமது குழுக்களில் பிரசுரிக்கலாம். மிக விரைவில் ஏற்ற துணைகளை கண்டுபிடிக்கலாம், உங்களுக்கு திருமணம் நிச்சயிக்கப்பட்டாலோ அல்லது திருமணம் நடந்தாலோ எங்களுக்கு தெரியபடுத்தும் பட்ச்சத்தில் உங்கள் தகவல்களை எங்களுடைய கோப்பிலிருந்து நீக்கிவிடுவோம் எக்காரணத்தை கொண்டு மணமகள் மணமகன் என்ன ஜாதி என்று தெரிந்து கொள்வதை தவிர்த்துவிடுங்கள், அதுபோன்று உங்கள் தகவல்களில் ஜாதி பெயரை குறிப்பிட வேண்டாம் என்று கேட்டுக் கொள்கிறோம், மிக விரைவில் உங்களுக்கு வரன் கிடைக்க ஜெபித்துக்கொள்கிறோம், வாழ்த்துக்கள்.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading profiles...</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded shadow p-8">
            No matrimonial profiles found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map(profile => {
              const isPdfOnly = profile.age === 0 && profile.pdf_url;
              const uploadDate = new Date(profile.created_at);

              if (isPdfOnly) {
                return (
                  <div
                    key={profile.id}
                    className="bg-white rounded-2xl shadow-md border border-[#c2185b] p-2 flex flex-col group relative"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteClick(profile.id); }}
                      className="absolute -top-2 -right-2 bg-white border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 shadow-sm z-50 transition-colors"
                      title="Delete Profile"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>

                    <div
                      className="flex flex-col rounded-xl overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setPreviewPdfUrl(`http://localhost:8080${profile.pdf_url}`)}
                    >
                      <div className="h-48 bg-gray-50 flex items-start justify-center relative overflow-hidden border-b border-gray-200">
                        <PdfThumbnail url={`http://localhost:8080${profile.pdf_url}`} />
                        <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 transition-colors flex items-center justify-center z-10">
                          <span className="opacity-0 group-hover:opacity-100 text-white bg-black/60 px-4 py-2 rounded-full font-medium text-sm transition-opacity duration-300 shadow-sm flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            View PDF
                          </span>
                        </div>
                      </div>
                      <div className="bg-[#c2185b] p-5 text-center flex-grow">
                        <h3 className="text-xl font-bold text-white truncate drop-shadow-sm">{profile.name}</h3>
                        <p className="text-white mt-2 text-sm opacity-90">{uploadDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={profile.id} className="bg-white rounded-2xl shadow-md border border-[#c2185b] p-2 flex flex-col relative group">
                  <button
                    onClick={() => handleDeleteClick(profile.id)}
                    className="absolute -top-2 -right-2 bg-white border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 shadow-sm z-50 transition-colors"
                    title="Delete Profile"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>

                  <div
                    className="flex flex-col rounded-xl overflow-hidden h-full cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setPreviewDetailsProfile(profile)}
                  >
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

                    <div className="bg-[#c2185b] p-5 text-center flex-grow">
                      <h3 className="text-xl font-bold text-white truncate drop-shadow-sm">{profile.name}</h3>
                      <p className="text-white mt-2 text-sm opacity-90">{uploadDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProfileToDelete(null);
        }}
        onConfirm={executeDelete}
        title="Delete Profile"
        message="Are you sure you want to delete this matrimonial profile? This action cannot be undone."
        confirmText="Delete"
        confirmColor="bg-red-600 hover:bg-red-700 focus:ring-red-500"
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

                <div className="w-full md:w-2/3 space-y-4">
                  <div className="border-b border-pink-100 pb-4">
                    <h3 className="text-3xl font-bold text-[#881337] mb-1">{previewDetailsProfile.name}</h3>
                    <p className="text-lg text-gray-600 font-medium">
                      {previewDetailsProfile.gender} • {previewDetailsProfile.age} yrs • {previewDetailsProfile.height}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {previewDetailsProfile.location && previewDetailsProfile.location !== 'Not specified' && (
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Location</p>
                        <p className="font-medium text-gray-900">{previewDetailsProfile.location}</p>
                      </div>
                    )}
                    {previewDetailsProfile.education && (
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Education</p>
                        <p className="font-medium text-gray-900">{previewDetailsProfile.education}</p>
                      </div>
                    )}
                    {previewDetailsProfile.occupation && (
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Occupation</p>
                        <p className="font-medium text-gray-900">{previewDetailsProfile.occupation}</p>
                      </div>
                    )}
                    {previewDetailsProfile.contact_info && previewDetailsProfile.contact_info !== 'Not specified' && (
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact</p>
                        <p className="font-medium text-gray-900">{previewDetailsProfile.contact_info}</p>
                      </div>
                    )}
                  </div>

                  {previewDetailsProfile.expectation && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Partner Expectations</p>
                      <p className="text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                        {previewDetailsProfile.expectation}
                      </p>
                    </div>
                  )}

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
