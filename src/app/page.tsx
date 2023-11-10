'use client';
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { Crop } from 'react-image-crop';
import { useCallback, useState } from 'react';
import { Button } from '@mui/material';
import { Scale2D, Size2D, calcCanvasSize, calcImageScale } from '@/helpers/cropHelper';

export default function Home() {
  const [crop, setCrop] = useState<Crop>({
    unit: 'px',
    x: 0,
    y: 0,
    width: 200,
    height: 200,
  });
  const [imageUrl, setImageUrl] = useState<string>('');
  const [resizedImageUrl, setResizedImageUrl] = useState<string>('');
  const [image, setImage] = useState<HTMLImageElement>();

  const onChangeImage = async (e: any) => setImageUrl(URL.createObjectURL(e.target.files[0]));

  const onLoad = useCallback((image: React.SyntheticEvent<HTMLImageElement>) =>
    setImage(image.currentTarget), []);

  const onCreateCropedImageUrl = async () => {
    if (image) {
      const canvas = document.createElement('canvas');

      const imageScale: Scale2D = { x: 0, y: 0 };
      imageScale.x = image!.naturalWidth / image!.width;
      imageScale.y = image!.naturalHeight / image!.height;
      
      canvas.width = crop.width * imageScale.x;
      canvas.height = crop.height * imageScale.x;
      const context2d: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
      context2d.drawImage(
        image,
        crop.x * imageScale.x,
        crop.y * imageScale.y,
        crop.width * imageScale.x,
        crop.height * imageScale.y,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const imgUrl: string = canvas.toDataURL('image/jpeg', 0.5);
      setResizedImageUrl(imgUrl);
    }
  };

  return (<>
    <Button variant='contained' component='label' >
      画像追加<input type='file' hidden onChange={onChangeImage} />
    </Button>
    <Button onClick={onCreateCropedImageUrl}>切り取り</Button>
    <ReactCrop crop={crop} onChange={c => setCrop(c)}>
      <img src={imageUrl} onLoad={onLoad} />
    </ReactCrop>
    {resizedImageUrl &&
      <img src={resizedImageUrl} style={{ width: '200px', height: '200px' }} />}
  </>
  );
};