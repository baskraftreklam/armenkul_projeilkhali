// Bu fonksiyon, tek bir talebi ve tüm portföyleri alıp eşleşenleri döndürür.
export const findMatches = (request, allProperties) => {
  return allProperties.filter(property => {
    // Sadece yayında olan portföyleri dikkate al
    if (!property.isPublished) {
      return false;
    }

    // Satılık/Kiralık durumu eşleşmeli
    if (request.listingStatus !== property.listingStatus) {
      return false;
    }

    // --- DEĞİŞİKLİK: Kriterlerin varlığı kontrol ediliyor ---
    // Fiyat aralığı kontrolü (eğer talepte bütçe belirtilmişse)
    if (request.budget && (property.price < request.budget[0] || property.price > request.budget[1])) {
      return false;
    }

    // Metrekare aralığı kontrolü (eğer talepte metrekare belirtilmişse)
    if (request.squareMeters && (property.squareMeters < request.squareMeters[0] || property.squareMeters > request.squareMeters[1])) {
      return false;
    }
    
    // Bina yaşı kontrolü (eğer talepte bina yaşı belirtilmişse)
    if (request.buildingAge && (property.buildingAge < request.buildingAge[0] || property.buildingAge > request.buildingAge[1])) {
        return false;
    }
    // --- DEĞİŞİKLİK SONU ---
    
    // Oda sayısı kontrolü (eğer talepte belirtilmişse)
    if (request.roomCount && request.roomCount !== property.roomCount) {
      return false;
    }

    // Mahalle tercihi kontrolü (talepteki mahallelerden en az birine uymalı)
    const requestedNeighborhoods = [
      request.neighborhood1,
      request.neighborhood2,
      request.neighborhood3,
      request.neighborhood4
    ].filter(Boolean); // Sadece dolu olanları al

    if (requestedNeighborhoods.length > 0 && !requestedNeighborhoods.includes(property.neighborhood)) {
      return false;
    }
    
    // Tüm kontrollerden geçtiyse, bu bir eşleşmedir.
    return true;
  });
};