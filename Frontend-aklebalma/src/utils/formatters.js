// Formatage prix en FCFA
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-SN', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(price);
};

// Formatage informations de crédit
export const formatCreditInfo = (creditData) => {
  return {
    ...creditData,
    formattedPurchasingPower: formatPrice(creditData.purchasingPower),
    formattedRemainingToPay: formatPrice(creditData.remainingToPay),
    formattedAvailableCredit: formatPrice(creditData.availableCredit),
    creditPercentage: Math.round((creditData.availableCredit / creditData.purchasingPower) * 100)
  };
};

// Formatage nom complet
export const formatFullName = (firstName, lastName) => {
  return `${firstName} ${lastName}`.trim();
};

// Formatage numéro de téléphone sénégalais
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Supprimer tous les espaces et caractères spéciaux
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format sénégalais : +221 XX XXX XX XX
  if (cleaned.startsWith('221') && cleaned.length === 12) {
    return `+221 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
  }
  
  return phoneNumber;
};
