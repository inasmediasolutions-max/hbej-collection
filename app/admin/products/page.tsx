'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product, Category } from '@/types';
import { Plus, Edit2, Trash2, Search, X, Image as ImageIcon, Palette, Video, Play } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category_id: '',
    short_description: '',
    full_description: '',
    main_image: '',
    additional_images: [] as string[],
    video_url: '',
    material: '',
    color: '',
    dimensions: '',
    compartments: '',
    occasion: '',
    stock_status: 'available',
    is_featured: false,
    is_new_arrival: true,
    is_best_seller: false,
  });

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingVariants, setUploadingVariants] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('display_order', { ascending: true }),
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Handle Main Photo Upload
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMain(true);
      setMessage('Uploading main photo...');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `main_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hbej-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('hbej-media')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, main_image: urlData.publicUrl }));
      setMessage('Main photo uploaded successfully!');
    } catch (err: any) {
      setMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploadingMain(false);
    }
  };

  // Handle Video File Upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      setMessage('Uploading video... (this may take a moment)');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `video_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hbej-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('hbej-media')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, video_url: urlData.publicUrl }));
      setMessage('Video uploaded successfully!');
    } catch (err: any) {
      setMessage(`Video upload failed: ${err.message}`);
    } finally {
      setUploadingVideo(false);
    }
  };

  // Handle Multiple Color Variant Photos Upload
  const handleVariantImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingVariants(true);
      setMessage(`Uploading ${files.length} color variant photo(s)...`);

      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `variant_${Date.now()}_${i}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('hbej-media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('hbej-media')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      setFormData((prev) => ({
        ...prev,
        additional_images: [...prev.additional_images, ...uploadedUrls],
      }));
      setMessage('All color variant photos uploaded successfully!');
    } catch (err: any) {
      setMessage(`Color variant upload failed: ${err.message}`);
    } finally {
      setUploadingVariants(false);
    }
  };

  const removeVariantImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category_id: categories[0]?.id || '',
      short_description: '',
      full_description: '',
      main_image: '',
      additional_images: [],
      video_url: '',
      material: '',
      color: '',
      dimensions: '',
      compartments: '',
      occasion: '',
      stock_status: 'available',
      is_featured: false,
      is_new_arrival: true,
      is_best_seller: false,
    });
    setMessage('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category_id: product.category_id || '',
      short_description: product.short_description || '',
      full_description: product.full_description || '',
      main_image: product.main_image,
      additional_images: product.additional_images || [],
      video_url: product.video_url || '',
      material: product.material || '',
      color: product.color || '',
      dimensions: product.dimensions || '',
      compartments: product.compartments || '',
      occasion: product.occasion || '',
      stock_status: product.stock_status,
      is_featured: product.is_featured,
      is_new_arrival: product.is_new_arrival,
      is_best_seller: product.is_best_seller,
    });
    setMessage('');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.main_image) {
      setMessage('Please upload a main photo for the bag!');
      return;
    }

    try {
      setLoading(true);
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

      const payload = {
        name: formData.name,
        slug,
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        short_description: formData.short_description,
        full_description: formData.full_description,
        main_image: formData.main_image,
        additional_images: formData.additional_images,
        video_url: formData.video_url || null,
        material: formData.material,
        color: formData.color,
        dimensions: formData.dimensions,
        compartments: formData.compartments,
        occasion: formData.occasion,
        stock_status: formData.stock_status,
        is_featured: formData.is_featured,
        is_new_arrival: formData.is_new_arrival,
        is_best_seller: formData.is_best_seller,
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setMessage(`Save error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setDeleteConfirmId(null);
      fetchData();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gold-gradient">
            Manage Bag Catalog
          </h1>
          <p className="text-xs text-neutral-400">
            Add new bags, set prices, upload videos, color photos, and update stock
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl bg-gold-gradient text-black font-bold text-xs flex items-center gap-2 shadow-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> ADD NEW BAG
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
        <input
          type="text"
          placeholder="Search bags in catalog..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-900 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-900 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-neutral-500 uppercase border-b border-neutral-900">
            <tr>
              <th className="py-3 px-3">Main Photo</th>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Price</th>
              <th className="py-3 px-3">Media Options</th>
              <th className="py-3 px-3">Stock</th>
              <th className="py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-900/50">
                <td className="py-3 px-3">
                  <img src={p.main_image} alt="" className="w-12 h-12 rounded-lg object-cover bg-neutral-900" />
                </td>
                <td className="py-3 px-3 font-semibold text-white">{p.name}</td>
                <td className="py-3 px-3 text-neutral-400">{p.categories?.name || 'Uncategorized'}</td>
                <td className="py-3 px-3 font-bold text-amber-400">GH₵{p.price}</td>
                <td className="py-3 px-3 space-y-1">
                  {p.video_url && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-semibold border border-blue-500/20 block w-fit">
                      <Video className="w-3 h-3" /> Has Video
                    </span>
                  )}
                  {p.additional_images && p.additional_images.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[10px] font-semibold border border-amber-500/20 block w-fit">
                      <Palette className="w-3 h-3" /> {p.additional_images.length + 1} Colors
                    </span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.stock_status === 'available' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {p.stock_status}
                  </span>
                </td>
                <td className="py-3 px-3 space-x-2">
                  <button onClick={() => openEditModal(p)} className="p-1.5 bg-neutral-900 rounded-lg text-amber-400 hover:bg-neutral-800">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirmId(p.id)} className="p-1.5 bg-neutral-900 rounded-lg text-rose-400 hover:bg-neutral-800">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
              <h2 className="text-xl font-serif font-bold text-white">
                {editingProduct ? 'Edit Bag' : 'Add New Bag'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {message && <div className="p-3 bg-neutral-900 text-amber-400 text-xs rounded-xl">{message}</div>}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Main Photo Upload */}
              <div className="space-y-2">
                <label className="font-semibold text-neutral-300 block">Bag Main Photo *</label>
                <div className="flex items-center gap-4">
                  {formData.main_image ? (
                    <img src={formData.main_image} alt="" className="w-20 h-20 rounded-xl object-cover bg-neutral-900" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-neutral-900 border border-dashed border-neutral-800 flex items-center justify-center text-neutral-600">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20"
                  />
                </div>
              </div>

              {/* NEW SECTION: Video Upload */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-blue-500/20 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs">
                  <Video className="w-4 h-4" />
                  <span>Bag Showcase Video (Optional)</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Upload an MP4 or MOV video showing the bag model in action. A video badge and player will appear on the product page!
                </p>

                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/*"
                  onChange={handleVideoUpload}
                  className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30"
                />

                {formData.video_url && (
                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Uploaded Video Preview:</span>
                    <video src={formData.video_url} controls className="w-full h-40 rounded-xl bg-black" />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, video_url: '' })}
                      className="text-xs text-rose-400 hover:underline block"
                    >
                      Remove Video
                    </button>
                  </div>
                )}
              </div>

              {/* Color Variants Photos Upload */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                  <Palette className="w-4 h-4" />
                  <span>Available in Different Colors (Color Variant Photos)</span>
                </div>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleVariantImagesUpload}
                  className="text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30"
                />

                {formData.additional_images.length > 0 && (
                  <div className="pt-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.additional_images.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800">
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(idx)}
                            className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Bag Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Price (GH₵) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Category</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-300 block mb-1">Stock Status</label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  >
                    <option value="available">Available</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingMain || uploadingVariants || uploadingVideo}
                  className="px-6 py-2.5 rounded-xl bg-gold-gradient text-black font-bold"
                >
                  SAVE BAG TO CATALOG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Bag?</h3>
            <p className="text-xs text-neutral-400">
              Are you sure you want to permanently delete this bag from your catalog?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
