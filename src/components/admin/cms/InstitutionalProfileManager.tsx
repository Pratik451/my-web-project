import React, { useState, useEffect } from 'react';
import { InstitutionalProfileItemCMS } from '../../../types';
import { INITIAL_CMS_INSTITUTIONAL_PROFILES } from '../../../data/cmsInitialData';
import { uploadSingleMediaImage, deleteMediaByPath } from '../../../services/mediaApi';
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle2,
  X,
  Upload,
  ChevronUp,
  ChevronDown,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface Props {
  profiles?: InstitutionalProfileItemCMS[];
  onSave: (updated: InstitutionalProfileItemCMS[]) => Promise<void> | void;
}

export const InstitutionalProfileManager: React.FC<Props> = ({ profiles, onSave }) => {
  const [profileList, setProfileList] = useState<InstitutionalProfileItemCMS[]>(
    profiles && profiles.length > 0 ? profiles : INITIAL_CMS_INSTITUTIONAL_PROFILES
  );
  const [editingItem, setEditingItem] = useState<InstitutionalProfileItemCMS | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InstitutionalProfileItemCMS | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setProfileList(profiles);
    }
  }, [profiles]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingItem({
      id: `inst-profile-${Date.now()}`,
      titleEn: '',
      titleNp: '',
      categoryEn: 'Institutional Profile',
      categoryNp: 'संस्थागत विवरण',
      subtitleEn: '',
      subtitleNp: '',
      contentEn: '',
      contentNp: '',
      highlightsEn: [''],
      highlightsNp: [''],
      badgeEn: 'Verified Profile',
      badgeNp: 'संस्थागत पहिचान',
      imageUrl: '',
      isPublished: true,
      sortOrder: profileList.length + 1,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
    setIsNew(true);
  };

  const handleOpenEdit = (item: InstitutionalProfileItemCMS) => {
    setEditingItem({
      ...item,
      highlightsEn: Array.isArray(item.highlightsEn) && item.highlightsEn.length > 0 ? [...item.highlightsEn] : [''],
      highlightsNp: Array.isArray(item.highlightsNp) && item.highlightsNp.length > 0 ? [...item.highlightsNp] : [''],
    });
    setIsNew(false);
  };

  const handleImageUpload = async (file: File) => {
    if (!editingItem) return;
    setUploadingImage(true);
    try {
      const oldUrl = editingItem.imageUrl;
      const res = await uploadSingleMediaImage(file, 'general', editingItem.titleEn || 'institutional-profile');
      if (res.success && res.file) {
        if (oldUrl && oldUrl.startsWith('/uploads/')) {
          await deleteMediaByPath(oldUrl);
        }
        setEditingItem({ ...editingItem, imageUrl: res.file.url });
        showToast('Banner image uploaded to server! Click Save to persist in MySQL.');
      }
    } catch (err: any) {
      showToast(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteModalImage = async () => {
    if (!editingItem || !editingItem.imageUrl) return;
    setUploadingImage(true);
    try {
      if (editingItem.imageUrl.startsWith('/uploads/')) {
        await deleteMediaByPath(editingItem.imageUrl);
      }
      setEditingItem({ ...editingItem, imageUrl: '' });
      showToast('Banner image deleted from server.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCardImageUpload = async (itemId: string, file: File) => {
    setUploadingImage(true);
    try {
      const targetItem = profileList.find((p) => p.id === itemId);
      const res = await uploadSingleMediaImage(file, 'general', targetItem?.titleEn || 'institutional-profile');
      if (res.success && res.file) {
        if (targetItem?.imageUrl && targetItem.imageUrl.startsWith('/uploads/')) {
          await deleteMediaByPath(targetItem.imageUrl);
        }
        const updatedList = profileList.map((p) =>
          p.id === itemId ? { ...p, imageUrl: res.file!.url, updatedAt: new Date().toISOString().slice(0, 10) } : p
        );
        setProfileList(updatedList);
        await onSave(updatedList);
        showToast('Banner image uploaded to server and saved in MySQL database!');
      }
    } catch (err: any) {
      showToast(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCardImageDelete = async (itemId: string) => {
    const targetItem = profileList.find((p) => p.id === itemId);
    if (!targetItem || !targetItem.imageUrl) return;
    setUploadingImage(true);
    try {
      if (targetItem.imageUrl.startsWith('/uploads/')) {
        await deleteMediaByPath(targetItem.imageUrl);
      }
      const updatedList = profileList.map((p) =>
        p.id === itemId ? { ...p, imageUrl: '', updatedAt: new Date().toISOString().slice(0, 10) } : p
      );
      setProfileList(updatedList);
      await onSave(updatedList);
      showToast('Banner image deleted from server and updated in MySQL database!');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.titleEn.trim() || !editingItem.contentEn.trim()) {
      showToast('Please fill in Title (English) and Profile Content (English).');
      return;
    }

    const cleaned: InstitutionalProfileItemCMS = {
      ...editingItem,
      highlightsEn: (editingItem.highlightsEn || []).map((h) => h.trim()).filter(Boolean),
      highlightsNp: (editingItem.highlightsNp || []).map((h) => h.trim()).filter(Boolean),
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    const updatedList = isNew
      ? [...profileList, cleaned]
      : profileList.map((p) => (p.id === cleaned.id ? cleaned : p));

    setProfileList(updatedList);
    setEditingItem(null);
    setIsSaving(true);
    try {
      await onSave(updatedList);
      showToast(
        isNew
          ? 'Institutional Profile section created and saved to MySQL database!'
          : 'Institutional Profile section updated in MySQL database!'
      );
    } catch (err: any) {
      showToast(`Save error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    const updatedList = profileList.filter((p) => p.id !== itemToDelete.id);
    setProfileList(updatedList);
    setItemToDelete(null);
    setIsSaving(true);
    try {
      await onSave(updatedList);
      showToast('Institutional Profile section deleted from database!');
    } catch (err: any) {
      showToast(`Delete failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (item: InstitutionalProfileItemCMS) => {
    const updatedList = profileList.map((p) =>
      p.id === item.id ? { ...p, isPublished: !p.isPublished } : p
    );
    setProfileList(updatedList);
    setIsSaving(true);
    try {
      await onSave(updatedList);
      showToast(`Visibility updated for "${item.titleEn}"`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= profileList.length) return;
    const copy = [...profileList];
    const tmp = copy[idx];
    copy[idx] = copy[target];
    copy[target] = tmp;
    const reordered = copy.map((item, i) => ({ ...item, sortOrder: i + 1 }));
    setProfileList(reordered);
    setIsSaving(true);
    try {
      await onSave(reordered);
      showToast('Profile display order saved to database!');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-sky-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-sky-700 text-sm">
          <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Full Image Preview Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-600" />
                Institutional Profile Banner Preview
              </h4>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-100 rounded-xl p-3 flex items-center justify-center max-h-[65vh] overflow-hidden">
              <img
                src={previewImageUrl}
                alt="Institutional Profile Preview"
                className="max-h-[60vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
              <span className="truncate">{previewImageUrl}</span>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-sans font-bold text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-600" />
            <span>Institutional Profile CRUD Manager (संस्थागत प्रोफाइल व्यवस्थापन)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, reorder, publish/unpublish, and delete detailed Institutional Profile blocks displayed on the frontend About Us → Our Profile page.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Institutional Profile Section
        </button>
      </div>

      {/* Profile Items List */}
      <div className="grid grid-cols-1 gap-4">
        {profileList.map((item, idx) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col lg:flex-row lg:items-start justify-between gap-5"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-sky-800">{item.categoryEn}</span>
                <span>·</span>
                <span>{item.categoryNp}</span>
                {item.badgeEn && (
                  <>
                    <span>·</span>
                    <span className="text-slate-700 font-semibold">{item.badgeEn}</span>
                  </>
                )}
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  className={`font-bold cursor-pointer underline ${
                    item.isPublished ? 'text-sky-700' : 'text-amber-600'
                  }`}
                >
                  {item.isPublished ? 'Published on Website' : 'Draft (Hidden)'}
                </button>
              </div>

              <h4 className="text-base font-bold text-slate-900">
                {idx + 1}. {item.titleEn}
              </h4>
              <div className="text-sm font-semibold text-sky-800">{item.titleNp}</div>
              {item.subtitleEn && (
                <div className="text-xs text-slate-500">{item.subtitleEn}</div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed pt-1">{item.contentEn}</p>

              {item.highlightsEn && item.highlightsEn.length > 0 && (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2 text-xs text-slate-700">
                  {item.highlightsEn.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-sky-600 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Banner Image Upload, Preview, Replace & Delete on Card */}
              <div className="pt-3 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {item.imageUrl ? (
                    <div
                      onClick={() => setPreviewImageUrl(item.imageUrl!)}
                      className="w-16 h-11 rounded-lg overflow-hidden border border-sky-300 bg-slate-100 shrink-0 cursor-pointer"
                      title="Click to Preview Banner Image"
                    >
                      <img src={item.imageUrl} alt={item.titleEn} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-11 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                      No Image
                    </div>
                  )}
                  <div className="text-[11px]">
                    <span className="font-bold text-slate-700 block">Section Banner Image</span>
                    <span className="font-mono text-[10px] text-slate-500 truncate block max-w-[200px]">
                      {item.imageUrl || 'No banner image uploaded'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <label className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-[11px] font-bold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{item.imageUrl ? 'Replace Banner' : 'Upload Banner'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleCardImageUpload(item.id, e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                  {item.imageUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() => setPreviewImageUrl(item.imageUrl!)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-700" />
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCardImageDelete(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-semibold cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Image
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex lg:flex-col items-center lg:items-end justify-end gap-2 shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === profileList.length - 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenEdit(item)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 cursor-pointer"
                  title="Delete Profile Block"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h4 className="text-base font-bold text-slate-900">
                {isNew
                  ? 'Add Institutional Profile Section'
                  : `Edit Institutional Profile: ${editingItem.titleEn}`}
              </h4>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title (English) *</label>
                  <input
                    type="text"
                    value={editingItem.titleEn}
                    onChange={(e) => setEditingItem({ ...editingItem, titleEn: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title (नेपाली)</label>
                  <input
                    type="text"
                    value={editingItem.titleNp}
                    onChange={(e) => setEditingItem({ ...editingItem, titleNp: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category (English)</label>
                  <input
                    type="text"
                    value={editingItem.categoryEn}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, categoryEn: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category (नेपाली)</label>
                  <input
                    type="text"
                    value={editingItem.categoryNp}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, categoryNp: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtitle (English)</label>
                  <input
                    type="text"
                    value={editingItem.subtitleEn || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, subtitleEn: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subtitle (नेपाली)</label>
                  <input
                    type="text"
                    value={editingItem.subtitleNp || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, subtitleNp: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detailed Description (English) *
                </label>
                <textarea
                  rows={3}
                  value={editingItem.contentEn}
                  onChange={(e) => setEditingItem({ ...editingItem, contentEn: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Detailed Description (नेपाली)
                </label>
                <textarea
                  rows={3}
                  value={editingItem.contentNp}
                  onChange={(e) => setEditingItem({ ...editingItem, contentNp: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Key Highlights (English)</label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingItem({
                          ...editingItem,
                          highlightsEn: [...(editingItem.highlightsEn || []), ''],
                        })
                      }
                      className="text-sky-700 font-bold hover:underline cursor-pointer"
                    >
                      + Add Point
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(editingItem.highlightsEn || []).map((pt, i) => (
                      <div key={i} className="flex gap-1.5">
                        <input
                          type="text"
                          value={pt}
                          onChange={(e) => {
                            const next = [...(editingItem.highlightsEn || [])];
                            next[i] = e.target.value;
                            setEditingItem({ ...editingItem, highlightsEn: next });
                          }}
                          className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditingItem({
                              ...editingItem,
                              highlightsEn: (editingItem.highlightsEn || []).filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                          className="text-rose-500 px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Key Highlights (नेपाली)</label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditingItem({
                          ...editingItem,
                          highlightsNp: [...(editingItem.highlightsNp || []), ''],
                        })
                      }
                      className="text-sky-700 font-bold hover:underline cursor-pointer"
                    >
                      + बुँदा थप्नुहोस्
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(editingItem.highlightsNp || []).map((pt, i) => (
                      <div key={i} className="flex gap-1.5">
                        <input
                          type="text"
                          value={pt}
                          onChange={(e) => {
                            const next = [...(editingItem.highlightsNp || [])];
                            next[i] = e.target.value;
                            setEditingItem({ ...editingItem, highlightsNp: next });
                          }}
                          className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setEditingItem({
                              ...editingItem,
                              highlightsNp: (editingItem.highlightsNp || []).filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                          className="text-rose-500 px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    {editingItem.imageUrl ? (
                      <img
                        src={editingItem.imageUrl}
                        alt="Banner Preview"
                        onClick={() => setPreviewImageUrl(editingItem.imageUrl!)}
                        className="w-16 h-12 rounded-lg object-cover border border-sky-300 cursor-pointer shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-12 rounded-lg border border-dashed border-slate-300 bg-white flex items-center justify-center text-[10px] text-slate-400 shrink-0">
                        No Banner
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-slate-800 block">Section Banner Image (Server Upload)</span>
                      <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[220px]">
                        {editingItem.imageUrl || 'Upload JPG, PNG, WEBP, or SVG'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white cursor-pointer font-bold">
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {uploadingImage
                          ? 'Uploading...'
                          : editingItem.imageUrl
                          ? 'Replace Banner'
                          : 'Upload Banner'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleImageUpload(f);
                        }}
                      />
                    </label>
                    {editingItem.imageUrl && (
                      <>
                        <button
                          type="button"
                          onClick={() => setPreviewImageUrl(editingItem.imageUrl!)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-sky-700" />
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={handleDeleteModalImage}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPublished}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, isPublished: e.target.checked })
                    }
                  />
                  <span>Publish on Website (Our Profile Page)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 inline mr-1.5" />
                  {isNew ? 'Create & Save to Database' : 'Save Changes to Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-bold text-slate-900">
              Delete Institutional Profile Section?
            </h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently remove <strong>{itemToDelete.titleEn}</strong> from the database?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
