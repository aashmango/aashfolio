'use client';

import { useState, useEffect } from 'react';
import SignInButton from '@/components/SignInButton';
import { supabase } from '@/utils/supabase/server';
import '../styles/pageStyles.css';
import Image from 'next/image';

interface TextItem {
  id: string;
  content: string;
  size?: string;
}

interface VideoItem {
  id: string;
  src: string;
  description?: string;
  size?: string;
}

interface ImageItem {
  id: string;
  src: string;
  description?: string;
  size?: string;
}

type Item = 
  | (TextItem & { type: 'text' })
  | (VideoItem & { type: 'videos' })
  | (ImageItem & { type: 'images' });

export default function Page() {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: texts } = await supabase.from('text').select();
      const { data: videos } = await supabase.from('videos').select();
      const { data: images } = await supabase.from('images').select();

      setAllItems([
        ...(texts || []).map((text) => ({ ...text, type: 'text' as const })),
        ...(videos || []).map((video) => ({ ...video, type: 'video' as const })),
        ...(images || []).map((image) => ({ ...image, type: 'image' as const })),
      ]);
    };

    fetchData();
  }, []);

  const handleSizeChange = (id: string, newSize: string) => {
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, size: newSize } : item
      )
    );
  };

  const handleSaveAll = async () => {
    try {
      const updates = allItems.map(async (item) => {
        console.log(`Attempting to update item ${item.id} of type ${item.type} with size ${item.size}`);
        const { error } = await supabase
          .from(item.type)
          .update({ size: item.size })
          .eq('id', item.id);
        if (error) {
          console.error(`Error updating item ${item.id}:`, error);
          throw error;
        } else {
          console.log(`Successfully updated item ${item.id}`);
        }
      });

      await Promise.all(updates);
      alert('All sizes updated successfully');
    } catch (error) {
      console.error('Error updating sizes:', (error as Error).message || error);
    }
  };

  return (
    <div className="container">
      <SignInButton isSignedIn={isSignedIn} setIsSignedIn={setIsSignedIn} />
      <div className="grid-container">
        {allItems.map((item) => (
          <div key={item.id} className={`card ${item.size || 'small'}`}>
            {item.type === 'text' && <p className="item-text">{item.content || 'No content available'}</p>}
            {item.type === 'videos' && (
              <>
                <video controls width="100%" height="100%">
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="item-description">{item.description || 'No description available'}</p>
              </>
            )}
            {item.type === 'images' && (
              <>
                <Image src={item.src} alt={`Image ${item.id}`} layout="responsive" width={500} height={500} />
                <p className="item-description">{item.description || 'No description available'}</p>
              </>
            )}
            {isSignedIn && (
              <div className="size-options">
                {['small', 'medium', 'large'].map((size) => (
                  <label key={size}>
                    <input
                      type="radio"
                      name={`size-${item.id}`}
                      value={size}
                      checked={item.size === size}
                      onChange={() => handleSizeChange(item.id, size)}
                    />
                    {size}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {isSignedIn && (
        <button onClick={handleSaveAll} className="global-save-button">
          Save All
        </button>
      )}
    </div>
  );
}
