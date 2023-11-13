export const getImageIdFromImageUrl = (imageUrl: string) => {
  // Split the URL by '/'
    const urlParts = imageUrl.split('/');

    // Extract the image ID (second last element from the split array)
    const imageId = urlParts[urlParts.length - 2];

    return imageId;
};