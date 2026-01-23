import React, { useState, useEffect } from 'react';

const VideoSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sectionId = "rvp-video-100-accurate";

  // Prevent scrolling when video is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const toggleModal = (e) => {
    if (e) e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <style>
        {`
          .${sectionId} {
            position: relative;
            width: 100%;
            height: 550px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: url('https://script.viserlab.com/revptc/assets/images/frontend/how_work/6381e32817cd51669456680.jpg') no-repeat center center;
            background-size: cover;
            overflow: hidden;
          }

          /* Exact color grade overlay */
          .${sectionId}::after {
            content: '';
            position: absolute;
            inset: 0;
            background: rgba(43, 33, 71, 0.7);
            z-index: 1;
          }

          .content-z { position: relative; z-index: 10; }

          /* Play Button with sharp triangle icon */
          .play-btn {
            width: 85px;
            height: 85px;
            background: #ff6b3d;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }

          .play-btn:hover { transform: scale(1.15); background: #ff5a26; }

          .sharp-triangle {
            width: 28px;
            height: 28px;
            fill: white;
            margin-left: 6px;
          }

          /* Bottom Wave with pink border/dots */
          .wave-divider {
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 120px;
            background: url('https://script.viserlab.com/revptc/assets/templates/basic/images/banner/wave.png') no-repeat bottom;
            background-size: 100% 100%;
            z-index: 5;
          }

          /* Modal - Video Overlay */
          .video-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            animation: fadeIn 0.3s ease;
          }

          .modal-container {
            position: relative;
            width: 100%;
            max-width: 1000px;
            aspect-ratio: 16 / 9;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }

          /* THE CROSS (CLOSE) ICON */
          .close-icon-btn {
            position: absolute;
            top: -50px;
            right: 0;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: sans-serif;
            font-weight: 500;
            transition: opacity 0.2s;
          }

          .close-icon-btn:hover { opacity: 0.7; }

          .close-svg { width: 30px; height: 30px; stroke: currentColor; stroke-width: 2.5; }

          .video-iframe {
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 4px;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      <section className={sectionId}>
        <div className="content-z">
          <button onClick={toggleModal} className="play-btn" aria-label="Play Video">
            <svg className="sharp-triangle" viewBox="0 0 100 100">
              <path d="M20 10 L85 50 L20 90 Z" />
            </svg>
          </button>
        </div>

        <div className="wave-divider"></div>

        {/* The Modal / Lightbox */}
        {isOpen && (
          <div className="video-modal-overlay" onClick={toggleModal}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              
              {/* CROSS ICON UI */}
              <button className="close-icon-btn" onClick={toggleModal}>
                <span>CLOSE</span>
                <svg className="close-svg" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <iframe 
                className="video-iframe"
                src="https://www.youtube.com/embed/WOb4cj7izpE?autoplay=1&rel=0" 
                title="Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default VideoSection;