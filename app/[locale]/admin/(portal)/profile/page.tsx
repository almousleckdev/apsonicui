'use client';

import React, { useState, useEffect, useRef } from 'react';
import { authService } from '@/services/auth-service';
import { uploadMediaFile } from '@/services/media';
import { useAuth } from '@/context/AuthContext';
import type { UserProfileResponse } from '@/lib/types/auth';
import { ProfileHeaderCard } from '@/components/admin/profile/ProfileHeaderCard';
import { AccountInfoSection } from '@/components/admin/profile/AccountInfoSection';
import { PasswordChangeSection } from '@/components/admin/profile/PasswordChangeSection';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminProfilePage() {
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  // User Profile Form State
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const u = await authService.getCurrentUser();
        if (u) {
          setProfile(u);
          setUsername(u.username || '');
          setEmail(u.email || '');
          setFirstName(u.firstName || '');
          setLastName(u.lastName || '');
          setAvatarUrl(u.avatarUrl || '/images/logo/apsoniclogo.png');
          updateUser(u);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setUsername('superadmin');
        setEmail('superadmin@apsonic.com');
        setFirstName('Super');
        setLastName('Admin');
        setAvatarUrl('/images/logo/apsoniclogo.png');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [updateUser]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const uploadedUrl = await uploadMediaFile(file);
      if (uploadedUrl) {
        setAvatarUrl(uploadedUrl);
        const updated = await authService.updateProfile({ avatarUrl: uploadedUrl });
        if (updated) {
          setProfile(updated);
          updateUser(updated);
          setSuccessMsg('Profile picture updated and saved successfully!');
        }
      }
    } catch (err: unknown) {
      console.error('Avatar upload error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to process profile picture.');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword) {
      if (!currentPassword) {
        setErrorMsg('Please enter your current password to set a new password.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New password and confirm password do not match.');
        return;
      }
    }

    setSaving(true);
    try {
      const updated = await authService.updateProfile({
        firstName,
        lastName,
        username,
        email,
        avatarUrl,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      if (updated) {
        setProfile(updated);
        setUsername(updated.username || username);
        setEmail(updated.email || email);
        setFirstName(updated.firstName || firstName);
        setLastName(updated.lastName || lastName);
        setAvatarUrl(updated.avatarUrl || avatarUrl);
        updateUser(updated);
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('Profile details and security settings saved successfully!');
    } catch (err: unknown) {
      console.error('Save profile error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
      <>
        <input
          type="file"
          ref={avatarInputRef}
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
        />

        <div className="max-w-4xl mx-auto space-y-8 pb-20 font-sans">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950">
              Admin Profile Settings
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Manage your administrator credentials, personal details, profile picture, and account security.
            </p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-brand-green text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className="p-16 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-brand-green animate-spin" />
              <p className="text-xs font-semibold text-zinc-500">Loading profile details...</p>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-8">
              <ProfileHeaderCard
                avatarUrl={avatarUrl}
                username={username}
                firstName={firstName}
                lastName={lastName}
                profile={profile}
                uploadingAvatar={uploadingAvatar}
                onTriggerAvatarUpload={() => avatarInputRef.current?.click()}
              />

              <AccountInfoSection
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
              />

              <PasswordChangeSection
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
              />

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 bg-brand-green text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-brand-green/20 hover:bg-green-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </>
  );
}
