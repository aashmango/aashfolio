'use client';

import { useState, useEffect } from 'react';
import SignInButton from '@/components/SignInButton';
import { supabase } from '@/utils/supabase/server';
import '../styles/pageStyles.css';

export default function Page() {
  const [allItems, setAllItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: texts } = await supabase.from('text').select();
      const { data: videos } = await supabase.from('videos').select();
      const { data: images } = await supabase.from('images').select();

      setAllItems([
        ...(texts || []).map((text: any) => ({ ...text, type: 'text' })),
        ...(videos || []).map((video: any) => ({ ...video, type: 'video' })),
        ...(images || []).map((image: any) => ({ ...image, type: 'image' })),
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <SignInButton />
      <div className="grid-container">
        {allItems.map((item: any) => (
          <div
            key={item.id}
            className={`card ${item.size || 'small'}`}
          >
            {item.type === 'text' && <p className="item-text">{item.content || 'No content available'}</p>}
            {item.type === 'video' && (
              <>
                <video controls width="100%" height="100%">
                  <source src={item.src || ''} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="item-description">{item.description || 'No description available'}</p>
              </>
            )}
            {item.type === 'image' && (
              <>
                <img src={item.src || ''} alt={`Image ${item.id}`} width="100%" height="100%" />
                <p className="item-description">{item.description || 'No description available'}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
