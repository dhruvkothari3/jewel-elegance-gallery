interface WhatsAppProduct {
  name: string;
  description?: string;
  priceRange?: string;
  images: string[];
}

export const generateWhatsAppMessage = (product: WhatsAppProduct): string => {
  const { name, description, priceRange, images } = product;
  
  let message = `Hi, I'm interested in this jewellery. Here are the details:\n\n`;
  message += `- Product: ${name}\n`;
  
  if (description) {
    message += `- Description: ${description}\n`;
  }
  
  if (priceRange) {
    message += `- Price: ${priceRange}\n`;
  }
  
  if (images && images.length > 0) {
    message += `- Images:\n`;
    images.forEach(imageUrl => {
      if (imageUrl) {
        message += `${imageUrl}\n`;
      }
    });
  }
  
  return message;
};

export const getWhatsAppUrl = (product: WhatsAppProduct): string => {
  const message = generateWhatsAppMessage(product);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/918369543332?text=${encodedMessage}`;
};