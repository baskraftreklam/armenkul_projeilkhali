import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import MapPicker from '../components/MapPicker';
import { useAuth } from '../context/AuthContext';
import { turkishCities } from '../data/cities';
import './AddPortfolio.css';

const atakumNeighborhoods = [ "Aksu", "Alanlı", "Atakent", "Balaç", "Beypınar", "Büyükkolpınar", "Cumhuriyet", "Çamlıyazı", "Çatalçam", "Denizevleri", "Elmaçukuru", "Erikli", "Esenevler", "Güzelyalı", "İncesu", "İstiklal", "Karakavuk", "Kamalı", "Kesilli", "Körfez", "Küçükkolpınar", "Mevlana", "Mimar Sinan", "Taflan", "Yeni Mahalle", "Yeşiltepe" ];
atakumNeighborhoods.sort();

function AddPortfolio({ properties, onAddPortfolio, onUpdatePortfolio }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = id !== undefined;
  const { currentUser } = useAuth(); 
  
  const [formData, setFormData] = useState({
    ownerId: currentUser ? currentUser.id : null,
    city: currentUser ? currentUser.city : '',
    title: '', ownerName: '', ownerPhone: '', address: '', neighborhood: '',
    roomCount: '1+1', squareMeters: '', price: '', loanAmount: '', bathroomCount: 1,
    ensuiteBathroom: false, buildingAge: '', totalFloors: '', floor: '',
    occupancyStatus: 'Boş', kitchenType: 'Kapalı Mutfak', features: '',
    images: [], location: null, videoUrl: '',
    listingStatus: 'Satılık', propertyType: 'Daire', brutSquareMeters: '',
    furnished: false, heatingType: 'Doğalgaz', deedStatus: 'İskan Mevcut',
    tradeable: false, parking: false, dues: '', deposit: '',
    doorCode: '', privateNote: '',
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
      if (portfolioToEdit) { setFormData({ ...portfolioToEdit, images: portfolioToEdit.images.join(', ') }); }
    }
  }, [id, isEditMode, properties]);

  const handleLocationSelect = useCallback((location) => { setFormData(prev => ({ ...prev, location: { lat: location.lat, lng: location.lng } })); }, []);
  
  useEffect(() => {
    const getAddressFromCoords = async (lat, lng) => {
      setAddressLoading(true);
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        const addressDetails = response.data.address;
        const neighborhoodFromApi = addressDetails.suburb || addressDetails.city_district || addressDetails.village;
        const street = addressDetails.road || addressDetails.street;
        const houseNumber = addressDetails.house_number;
        let shortAddress = '';
        if (neighborhoodFromApi) shortAddress += `${neighborhoodFromApi} Mah.`;
        if (street) shortAddress += ` ${street}`;
        if (houseNumber) shortAddress += ` No:${houseNumber}`;
        setFormData(prev => ({ ...prev, address: shortAddress, neighborhood: neighborhoodFromApi || prev.neighborhood }));
      } catch (error) { setFormData(prev => ({ ...prev, address: 'Adres alınamadı. Lütfen elle girin.' }));
      } finally { setAddressLoading(false); }
    };
    if (formData.location && !isEditMode) { getAddressFromCoords(formData.location.lat, formData.location.lng); }
  }, [formData.location, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = value;
    if (value === "true") finalValue = true;
    if (value === "false") finalValue = false;
    setFormData(prevState => ({ ...prevState, [name]: type === 'checkbox' ? checked : finalValue }));
  };
  
  const handleFileChange = (event) => setSelectedFiles([...event.target.files]);
  const handleVideoChange = (event) => setSelectedVideo(event.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError('');
    let uploadedImageUrls = typeof formData.images === 'string' ? formData.images.split(',').map(i => i.trim()).filter(i => i) : formData.images;
    let uploadedVideoUrl = formData.videoUrl;
    try {
      if (selectedVideo) {
        const vfd = new FormData();
        vfd.append('file', selectedVideo);
        vfd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, vfd);
        uploadedVideoUrl = res.data.secure_url;
      }
      if (selectedFiles.length > 0) {
        uploadedImageUrls = [];
        for (const file of selectedFiles) {
          const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };
          const compressedFile = await imageCompression(file, options);
          const ifd = new FormData();
          ifd.append('file', compressedFile);
          ifd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
          const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, ifd);
          uploadedImageUrls.push(res.data.secure_url);
        }
      }
      const finalFormData = { ...formData, images: uploadedImageUrls, videoUrl: uploadedVideoUrl, ownerId: currentUser.id };
      if (isEditMode) {
        onUpdatePortfolio(finalFormData);
      } else {
        onAddPortfolio(finalFormData);
      }
      navigate('/profil');
    } catch (error) {
      let message = 'Yüklenirken bir hata oluştu.';
      if (error.response?.data?.error) message = `Cloudinary Hatası: ${error.response.data.error.message}`;
      else if (error.message.includes('CORS')) message = "Yükleme engellendi (CORS).";
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
                    <div className="form-group full-width"><label>İlan Başlığı <span className="required-star">*</span></label><input type="text" name="title" value={formData.title} onChange={handleChange} required /></div>
                    
                    <div className="form-group"><label>Portföyün Bulunduğu Şehir <span className="required-star">*</span></label>
                        <select name="city" value={formData.city} onChange={handleChange} required>
                            <option value="">Şehir Seçiniz...</option>
                            {turkishCities.map(city => <option key={city} value={city}>{city}</option>)}
                        </select>
                    </div>

                    <div className="form-group"><label>Durumu <span className="required-star">*</span></label><select name="listingStatus" value={formData.listingStatus} onChange={handleChange}><option value="Satılık">Satılık</option><option value="Kiralık">Kiralık</option></select></div>
                    <div className="form-group"><label>Portföy Tipi <span className="required-star">*</span></label><select name="propertyType" value={formData.propertyType} onChange={handleChange}><option value="Daire">Daire</option><option value="Villa">Villa</option><option value="Arsa">Arsa</option></select></div>
                    <div className="form-group"><label>Oda Sayısı</label><select name="roomCount" value={formData.roomCount} onChange={handleChange}><option value="1+1">1+1</option><option value="2+1">2+1</option><option value="3+1">3+1</option><option value="4+1">4+1</option><option value="Diğer">Diğer</option></select></div>
                    <div className="form-group"><label>Net Metrekare (m²) <span className="required-star">*</span></label><input type="number" name="squareMeters" value={formData.squareMeters} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Brüt Metrekare (m²)</label><input type="number" name="brutSquareMeters" value={formData.brutSquareMeters} onChange={handleChange} /></div>
                    <div className="form-group"><label>Fiyat (₺) <span className="required-star">*</span></label><input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="Örn: 3500000"/></div>
                    <div className="form-group"><label>Aidat (₺)</label><input type="number" name="dues" value={formData.dues} onChange={handleChange} /></div>
                    <div className="form-group"><label>Banyo Sayısı <span className="required-star">*</span></label><input type="number" name="bathroomCount" value={formData.bathroomCount} onChange={handleChange} required /></div>
                    {formData.listingStatus === 'Kiralık' && (<div className="form-group"><label>Depozito (₺)</label><input type="number" name="deposit" value={formData.deposit} onChange={handleChange} /></div>)}
                </div>
            </div>

            <div className="form-section">
                <h3>Konum Bilgileri</h3>
                <p className="form--description">Haritadan bir nokta seçerek adresi otomatik dolmasını sağlayabilirsiniz.</p>
                <div className="map-picker-container"><MapPicker onLocationSelect={handleLocationSelect} /></div>
                 <div className="form-grid" style={{marginTop: '20px'}}>
                    <div className="form-group"><label>Mahalle (Atakum) <span className="required-star">*</span></label><select name="neighborhood" value={formData.neighborhood} onChange={handleChange} required><option value="">Seçiniz...</option>{atakumNeighborhoods.map(hood => <option key={hood} value={hood}>{hood}</option>)}</select></div>
                    <div className="form-group full-width"><label>Açık Adres <span className="required-star">*</span> {addressLoading && <span className="loading-text">(Adres yükleniyor...)</span>}</label><textarea name="address" value={formData.address} onChange={handleChange} required placeholder="Haritadan seçin veya elle girin..."></textarea></div>
                </div>
            </div>

            <div className="form-section">
                <h3>Bina ve Daire Detayları</h3>
                <div className="form-grid">
                    <div className="form-group"><label>Bina Yaşı</label><input type="number" name="buildingAge" value={formData.buildingAge} onChange={handleChange}/></div>
                    <div className="form-group"><label>Toplam Kat Sayısı</label><input type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange}/></div>
                    <div className="form-group"><label>Bulunduğu Kat</label><input type="number" name="floor" value={formData.floor} onChange={handleChange}/></div>
                    <div className="form-group"><label>Mutfak Tipi</label><select name="kitchenType" value={formData.kitchenType} onChange={handleChange}><option>Kapalı Mutfak</option><option>Amerikan Mutfak</option></select></div>
                    <div className="form-group"><label>Isıtma Tipi</label><select name="heatingType" value={formData.heatingType} onChange={handleChange}><option>Doğalgaz</option><option>Yerden Isıtma</option><option>Merkezi Sistem</option></select></div>
                    <div className="form-group"><label>Eşya Durumu</label><select name="furnished" value={formData.furnished} onChange={handleChange}><option value={false}>Eşyasız</option><option value={true}>Eşyalı</option></select></div>
                    <div className="form-group"><label>Ebeveyn Banyosu</label><select name="ensuiteBathroom" value={formData.ensuiteBathroom} onChange={handleChange}><option value={true}>Var</option><option value={false}>Yok</option></select></div>
                    <div className="form-group"><label>Otopark</label><select name="parking" value={formData.parking} onChange={handleChange}><option value={false}>Yok</option><option value={true}>Var</option></select></div>
                    {formData.listingStatus === 'Satılık' && (
                      <>
                        <div className="form-group"><label>Kullanım Durumu</label><select name="occupancyStatus" value={formData.occupancyStatus} onChange={handleChange}><option>Boş</option><option>Kiracılı</option><option>Mülk Sahibi</option></select></div>
                        <div className="form-group"><label>Kredi Limiti (₺)</label><input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} placeholder="Örn: 1500000" /></div>
                        <div className="form-group"><label>Tapu Durumu</label><select name="deedStatus" value={formData.deedStatus} onChange={handleChange}><option>İskan Mevcut</option><option>İskan Mevcut Değil</option><option>Arsa Payı</option></select></div>
                        <div className="form-group"><label>Takas</label><select name="tradeable" value={formData.tradeable} onChange={handleChange}><option value={false}>Yok</option><option value={true}>Var</option></select></div>
                      </>
                    )}
                </div>
            </div>

            <div className="form-section">
                <h3>Açıklama / Özellikler</h3>
                <div className="form-grid">
                    <div className="form-group full-width"><label>Portföy Açıklaması</label><textarea name="features" value={formData.features} onChange={handleChange} placeholder="Deniz manzaralı, Ebeveyn banyolu..."></textarea></div>
                </div>
            </div>
            
            <div className="form-section">
                 <h3>Medya (Resim ve Video)</h3>
                 <div className="form-grid">
                     <div className="form-group full-width"><label htmlFor="image-upload">Portföy Resimleri</label>{isEditMode && <textarea className="image-url-input" name="images" value={formData.images} onChange={handleChange} placeholder="Mevcut resim URL'leri..." />}{' '}<p className="form--description">{isEditMode ? "Yeni resimler yükle (mevcutların yerine geçer)." : "Birden fazla resim seçebilirsiniz."}</p><input type="file" id="image-upload" multiple accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} className="file-input"/></div>
                     <div className="form-group full-width"><label htmlFor="video-upload">Tanıtım Videosu</label>{isEditMode && formData.videoUrl && <p className="form--description">Mevcut Video: <a href={formData.videoUrl} target="_blank" rel="noopener noreferrer">Görüntüle</a></p>}{' '}<p className="form--description">{isEditMode ? "Videoyu değiştirmek için yeni bir dosya seçin." : "Portföy için bir tanıtım videosu seçin."}</p><input type="file" id="video-upload" accept="video/*" onChange={handleVideoChange} className="file-input"/></div>
                 </div>
             </div>
            
            <div className="form-section">
                <h3>Portföy Sahibi (Admin Özel)</h3>
                <div className="form-grid">
                     <div className="form-group"><label>Sahibi Adı <span className="required-star">*</span></label><input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} required /></div>
                     <div className="form-group"><label>Sahibi Telefon <span className="required-star">*</span></label><input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} required /></div>
                     <div className="form-group"><label>Kapı Şifresi</label><input type="text" name="doorCode" value={formData.doorCode} onChange={handleChange} /></div>
                     <div className="form-group full-width"><label>Özel Not</label><textarea name="privateNote" value={formData.privateNote} onChange={handleChange}></textarea></div>
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
