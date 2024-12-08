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
  | (VideoItem & { type: 'video' })
  | (ImageItem & { type: 'image' });

export default function Page() {
  const [allItems, setAllItems] = useState<Item[]>([]);

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

  return (
    <div className="container">
      <SignInButton />
      <div className="grid-container">
        {allItems.map((item) => (
          <div key={item.id} className={`card ${item.size || 'small'}`}>
            {item.type === 'text' && <p className="item-text">{item.content || 'No content available'}</p>}
            {item.type === 'video' && (
              <>
                <video controls width="100%" height="100%">
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="item-description">{item.description || 'No description available'}</p>
              </>
            )}
            {item.type === 'image' && (
              <>
                <Image src={item.src} alt={`Image ${item.id}`} layout="responsive" width={500} height={500} />
                <p className="item-description">{item.description || 'No description available'}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
