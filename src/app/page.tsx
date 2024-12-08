import SignInButton from '@/components/SignInButton';
import { supabase } from '@/utils/supabase/server'
import '../styles/pageStyles.css'; 

export default async function Page() {
  // Fetch all columns from the three tables
  const { data: texts } = await supabase.from('text').select();
  const { data: videos } = await supabase.from('videos').select();
  const { data: images } = await supabase.from('images').select();

  return (
    <div className="grid-container">
      <SignInButton />
      <h2>Texts</h2>
      <div className="grid">
        {texts?.map((text: any) => (
          <div key={text.id} className={`card ${text.size}`}>
            <p>{text.content || 'No content available'}</p>
          </div>
        ))}
      </div>

      <h2>Videos</h2>
      <div className="grid">
        {videos?.map((video: any) => (
          <div key={video.id} className={`card ${video.size}`}>
            <video controls width="100%">
              <source src={video.src || ''} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      <h2>Images</h2>
      <div className="grid">
        {images?.map((image: any) => (
          <div key={image.id} className={`card ${image.size}`}>
            <img src={image.src || ''} alt={`Image ${image.id}`} width="100%" />
          </div>
        ))}
      </div>
    </div>
  );
}
