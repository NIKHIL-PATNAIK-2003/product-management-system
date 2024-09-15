// File: /pages/productDetails.js
"use client";

import { useRef, useState } from "react";
import { imageDb } from "../firebase.config"; // Ensure this is correctly pointing to your Firebase Storage instance
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop";
import setCanvasPreview from "../setCanvasPreview";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary Firebase storage functions
import { v4 as uuidv4 } from "uuid"; // Ensure correct import statement
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdUpload as UploadIcon } from "react-icons/md"; // Upload Icon from react-icons
import { MdClose as XIcon } from "react-icons/md"; // Close Icon from react-icons

// Additional states for handling product details
const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = ({ closeModal, updateAvatar }) => {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;

    if (width && height) {
      const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
      const crop = makeAspectCrop(
        {
          unit: "%",
          width: cropWidthInPercent,
        },
        ASPECT_RATIO,
        width,
        height
      );
      const centeredCrop = centerCrop(crop, width, height);
      setCrop(centeredCrop);
    }
  };

  const uploadToFirebase = async (dataUrl) => {
    setLoading(true);
    setError("");
    console.log("Starting the upload process..."); // Log: Start of the upload process
  
    try {
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const imgRef = ref(imageDb, `files/${uuidv4()}`);
  
      console.log("Uploading image to Firebase..."); // Log: Before uploading to Firebase
      const snapshot = await uploadBytes(imgRef, blob);
      const url = await getDownloadURL(snapshot.ref);
      setImageUrl(url); // Save the uploaded image URL to the state
      setUploadedImage(url); // Ensure uploadedImage state is set correctly
      console.log("Image uploaded successfully! URL:", url); // Log: Successful upload with URL
    } catch (uploadError) {
      console.error("Error during upload process:", uploadError); // Log: Error if upload fails
    } finally {
      setLoading(false);
      console.log("Upload process completed."); // Log: End of the upload process
    }
  };
  

  const deleteUploadedImage = () => {
    setUploadedImage(null);
    setImgSrc(null);
    setCrop({ aspect: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productDetails = {
      imageUrl: uploadedImage, // The URL after uploading to Firebase
    
      productName: document.getElementById('product-name').value,
      productDescription: document.getElementById('product-description').value,
      price: document.getElementById('price').value,
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productDetails),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error submitting review request:', error);
      alert('Failed to submit review request.');
    }
  };

  const handleCropAndUpload = () => {
    setCanvasPreview(
      imgRef.current, // HTMLImageElement
      previewCanvasRef.current, // HTMLCanvasElement
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );

    // Convert the canvas content to a data URL
    const dataUrl = previewCanvasRef.current.toDataURL();

    // Upload the cropped image to Firebase
    uploadToFirebase(dataUrl);

    closeModal();
  };
  
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4 sm:px-6 md:px-8 lg:px-12">
      <Card className="w-full max-w-md bg-gray-800 text-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-center relative">
            <div className="w-48 h-48 bg-gray-700 flex items-center justify-center rounded-lg hover:bg-gray-600 transition-colors duration-300 ease-in-out">
              <label htmlFor="product-image" className="cursor-pointer">
                <UploadIcon className="w-8 h-8 text-gray-400" />
                <span className="text-gray-400">Upload image</span>
                <input
                  id="product-image"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={onSelectFile}
                />
              </label>
            </div>
            {imgSrc && (
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-700">
                <Button variant="ghost" size="icon" className="w-full h-full" onClick={deleteUploadedImage}>
                  <XIcon className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            )}
          </div>
          {imgSrc && (
            <div className="relative">
              <ReactCrop
                src={imgSrc}
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onImageLoaded={onImageLoad}
                circularCrop
                keepSelection
                aspect={1}
              >
                <img ref={imgRef} src={imgSrc} alt="Upload" style={{ maxHeight: '70vh' }} />
              </ReactCrop>
              <Button className="bg-sky-500 text-white mt-2" onClick={handleCropAndUpload} disabled={loading}>
                Crop Image
              </Button>
            </div>
          )}
            {crop && (
          <canvas
            ref={previewCanvasRef}
            className="mt-4"
            style={{
              display: "none",
              border: "1px solid black",
              objectFit: "contain",
              width: 150,
              height: 150,
            }}
          />
        )}
          <div>
            <Label htmlFor="product-name" className="font-medium">
              Product Name
            </Label>
            <Input
              id="product-name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="bg-gray-900 text-white border-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter Product Name"
            />
          </div>
          <div>
            <Label htmlFor="product-description" className="font-medium">
              Product Description
            </Label>
            <Input
              id="product-description"
              type="text"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="bg-gray-900 text-white border-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter Product Description"
            />
          </div>
          <div>
            <Label htmlFor="price" className="font-medium">
              Price
            </Label>
            <Input
              id="price"
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-gray-900 text-white border-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter Product Price"
            />
          </div>
          <div>
          <Button
            className="bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 hover:text-white transition-colors duration-300 ease-in-out"
            onClick={handleSubmit}
          >
            Submit changes for approval
          </Button>

          </div>
          {/* {error && <p className="text-red-500">{error}</p>} */}
        </div>
      </Card>
    </div>
  );
};

export default ImageCropper;
