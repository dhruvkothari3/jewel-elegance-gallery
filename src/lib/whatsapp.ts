interface WhatsAppProduct {
  id: string | number;
  name: string;
  description?: string;
  priceRange?: string;
  images: string[];
}

export const generateWhatsAppMessage = (product: WhatsAppProduct): string => {
  const { id, name, description, priceRange } = product;

  let message = `Hi, I'm interested in this jewellery. Here are the details:\n\n`;
  message += `- Product: ${name}\n`;

  if (description) {
    message += `- Description: ${description}\n`;
  }

  if (priceRange) {
    message += `- Price: ${priceRange}\n`;
  }

  // 👇 Instead of images, add product link
  const productUrl = `${window.location.origin}/product/${id}`;
  message += `\nView product: ${productUrl}`;

  return message;
};

export const getWhatsAppUrl = (product: WhatsAppProduct): string => {
  const message = generateWhatsAppMessage(product);
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=918369543332&text=${encodedMessage}`;
};
