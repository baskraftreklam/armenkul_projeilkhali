import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import MapPicker from '../components/MapPicker';
import './AddPortfolio.css';

const atakumNeighborhoods = [ "Aksu", "Alanlı", "Atakent", "Balaç", "Beypınar", "Büyükkolpınar", "Cumhuriyet", "Çamlıyazı", "Çatalçam", "Denizevleri", "Elmaçukuru", "Erikli", "Esenevler", "Güzelyalı", "İncesu", "İstiklal", "Karakavuk", "Kamalı", "Kesilli", "Körfez", "Küçükkolpınar", "Mevlana", "Mimar Sinan", "Taflan", "Yeni Mahalle", "Yeşiltepe" ];
atakumNeighborhoods.sort();

function AddPortfolio({ properties, onAddPortfolio, onUpdatePortfolio }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined;
  
  const [formData, setFormData] = useState({
    title: '', ownerName: '', ownerPhone: '', address: '', neighborhood: '',
    roomCount: '1+1', squareMeters: '', price: '', loanAmount: '', bathroomCount: 1,
    ensuiteBathroom: false, buildingAge: '', totalFloors: '', floor: '',
    occupancyStatus: 'Boş', kitchenType: 'Kapalı Mutfak', features: '',
    images: [], location: null, videoUrl: '',
  });
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const CLOUDINARY_CLOUD_NAME = "dutsz2qlo"; 
  const CLOUDINARY_UPLOAD_PRESET = "armenkuL_preset";

  useEffect(() => {
    if (isEditMode) {
      const portfolioToEdit = properties.find(p => p.id.toString() === id);
      if (portfolioToEdit) {
        setFormData({
          ...portfolioToEdit,
          images: portfolioToEdit.images.join(', ') // Dizi olan resimleri virgüllü string'e çevir
        });
      }
    }
  }, [id, isEditMode, properties]);

  const handleLocationSelect = useCallback((location) => {
    setFormData(prev => ({ ...prev, location: { lat: location.lat, lng: location.lng } }));
  }, []);

  useEffect(() => {
    if (formData.location && !isEditMode) { // Sadece ekleme modunda adresi otomatik doldur
      // Adres getirme mantığı burada
    }
  }, [formData.location, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };
  const handleVideoChange = (event) => {
    setSelectedVideo(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError('');

    let uploadedImageUrls = typeof formData.images === 'string' 
      ? formData.images.split(',').map(i => i.trim()).filter(i => i) 
      : formData.images;
    let uploadedVideoUrl = formData.videoUrl;

    try {
      if(selectedVideo) {
        const videoFormData = new FormData();
        videoFormData.append('file', selectedVideo);
        videoFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, videoFormData);
        uploadedVideoUrl = res.data.secure_url;
      }
      if(selectedFiles.length > 0) {
        uploadedImageUrls = []; // Yeni resim seçildiyse eskileri temizle
        for (const file of selectedFiles) {
            const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);
            const imageFormData = new FormData();
            imageFormData.append('file', compressedFile);
            imageFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, imageFormData);
            uploadedImageUrls.push(res.data.secure_url);
        }
      }

      const finalFormData = { ...formData, images: uploadedImageUrls, videoUrl: uploadedVideoUrl };
      if (isEditMode) {
        onUpdatePortfolio(finalFormData);
      } else {
        onAddPortfolio(finalFormData);
      }
      navigate('/');

    } catch (error) {
        console.error("Yükleme hatası:", error.response);
        let message = 'Yüklenirken bir hata oluştu.';
        if (error.response?.data?.error) {
          message = `Cloudinary Hatası: ${error.response.data.error.message}`;
        }
        setUploadError(message);
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="add-portfolio-container">
      <h2>{isEditMode ? 'Portföyü Düzenle' : 'Yeni Portföy Ekle'}</h2>
      <form onSubmit={handleSubmit} className="portfolio-form">
        <div className="form-section">
            <h3>Temel Bilgiler</h3>
            <div className="form-grid">
                <div className="form-group full-width"><label>İlan Başlığı</label><input type="text" name="title" value={formData.title} onChange={handleChange} required /></div>
                <div className="form-group"><label>Oda Sayısı</label><select name="roomCount" value={formData.roomCount} onChange={handleChange}><option value="1+1">1+1</option><option value="2+1">2+1</option><option value="3+1">3+1</option><option value="4+1">4+1</option><option value="Diğer">Diğer</option></select></div>
                <div className="form-group"><label>Metrekare (m²)</label><input type="number" name="squareMeters" value={formData.squareMeters} onChange={handleChange} required /></div>
                <div className="form-group"><label>Fiyat (₺)</label><input type="number" name="price" value={formData.price} onChange={handleChange} required /></div>
                <div className="form-group"><label>Banyo Sayısı</label><input type="number" name="bathroomCount" value={formData.bathroomCount} onChange={handleChange} required /></div>
            </div>
        </div>
        <div className="form-section">
            <h3>Konum Bilgileri</h3>
            <p className="form--description">Haritadan bir nokta seçerek adresi otomatik dolmasını sağlayabilirsiniz (sadece yeni portföy eklerken).</p>
            <div className="map-picker-container">
                <MapPicker onLocationSelect={handleLocationSelect} />
            </div>
             <div className="form-grid" style={{marginTop: '20px'}}>
                <div className="form-group">
                    <label>Mahalle (Atakum)</label>
                     <select name="neighborhood" value={formData.neighborhood} onChange={handleChange} required>
                        <option value="">Seçiniz...</option>
                        {atakumNeighborhoods.map(hood => <option key={hood} value={hood}>{hood}</option>)}
                    </select>
                </div>
                <div className="form-group full-width">
                    <label>Açık Adres {addressLoading && <span className="loading-text">(Adres yükleniyor...)</span>}</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required placeholder="Haritadan seçin veya elle girin..."></textarea>
                </div>
            </div>
        </div>
        <div className="form-section">
            <h3>Bina ve Daire Detayları</h3>
            <div className="form-grid">
                <div className="form-group"><label>Bina Yaşı</label><input type="number" name="buildingAge" value={formData.buildingAge} onChange={handleChange}/></div>
                <div className="form-group"><label>Toplam Kat Sayısı</label><input type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange}/></div>
                <div className="form-group"><label>Bulunduğu Kat</label><input type="number" name="floor" value={formData.floor} onChange={handleChange}/></div>
                <div className="form-group"><label>Kullanım Durumu</label><select name="occupancyStatus" value={formData.occupancyStatus} onChange={handleChange}><option>Boş</option><option>Kiracılı</option><option>Mülk Sahibi</option></select></div>
                <div className="form-group"><label>Mutfak Tipi</label><select name="kitchenType" value={formData.kitchenType} onChange={handleChange}><option>Kapalı Mutfak</option><option>Amerikan Mutfak</option></select></div>
                <div className="form-group"><label>Ebeveyn Banyosu</label><select name="ensuiteBathroom" value={formData.ensuiteBathroom} onChange={handleChange}><option value={true}>Var</option><option value={false}>Yok</option></select></div>
                <div className="form-group"><label>Kredi Limiti (₺)</label><input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} placeholder="Örn: 1500000" /></div>
            </div>
        </div>
        <div className="form-section">
            <h3>Medya (Resim ve Video)</h3>
            <div className="form-grid">
                <div className="form-group full-width">
                    <label htmlFor="image-upload">Portföy Resimleri</label>
                    {isEditMode && <textarea className="image-url-input" name="images" value={formData.images} onChange={handleChange} placeholder="Mevcut resim URL'leri, virgülle ayırarak düzenleyebilirsiniz." />}
                    <p className="form--description">{isEditMode ? "Yeni resimler yüklemek için aşağıdan seçin (bu işlem mevcut resimlerin yerine geçer)." : "Birden fazla resim seçebilirsiniz (En fazla 10 adet)."}</p>
                    <input type="file" id="image-upload" multiple accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="file-input"/>
                </div>
                <div className="form-group full-width">
                    <label htmlFor="video-upload">Tanıtım Videosu</label>
                    {isEditMode && formData.videoUrl && <p className="form--description">Mevcut Video: <a href={formData.videoUrl} target="_blank" rel="noopener noreferrer">Görüntüle</a></p>}
                    <p className="form--description">{isEditMode ? "Videoyu değiştirmek için yeni bir dosya seçin." : "Portföy için bir tanıtım videosu seçin."}</p>
                    <input type="file" id="video-upload" accept="video/*" onChange={handleVideoChange} className="file-input"/>
                </div>
            </div>
        </div>
        <div className="form-section">
            <h3>Portföy Sahibi</h3>
            <div className="form-grid">
                 <div className="form-group"><label>Sahibi Adı</label><input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required /></div>
                 <div className="form-group"><label>Sahibi Telefon</label><input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required /></div>
            </div>
        </div>
        <button type="submit" className="submit-btn" disabled={isUploading}>
          {isUploading ? 'Yükleniyor...' : (isEditMode ? 'Değişiklikleri Kaydet' : 'Portföyü Kaydet')}
        </button>
        {uploadError && <p className="error-message" style={{textAlign: 'center', marginTop: '15px'}}>{uploadError}</p>}
      </form>
    </div>
  );
}
export default AddPortfolio;