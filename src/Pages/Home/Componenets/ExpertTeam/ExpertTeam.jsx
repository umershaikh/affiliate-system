import React from 'react';
import './ExpertTeam.css';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Shane Grilson",
    role: "CEO",
    img: "https://script.viserlab.com/revptc/assets/images/frontend/team/6381e8983b0091669458072.png",
    bio: "Shane Grilson is the driving force behind our company's growth and vision."
  },
  {
    id: 2,
    name: "Kathi Angel",
    role: "Marketing Executive",
    img: "https://script.viserlab.com/revptc/assets/images/frontend/team/6381e87735ba21669458039.png",
    bio: "Leads our marketing efforts with creativity and driving brand growth."
  },
  {
    id: 3,
    name: "William Trosyon",
    role: "Senior Consultant",
    img: "https://script.viserlab.com/revptc/assets/images/frontend/team/6381e8ab8f4b31669458091.png",
    bio: "Provides expert guidance and strategic insights, helping shape our company's direction."
  },
  {
    id: 4,
    name: "Asuntiry Siomony",
    role: "Senior Advisor",
    img: "https://script.viserlab.com/revptc/assets/images/frontend/team/6381e8b41541c1669458100.png",
    bio: "Offers valuable expertise and counsel, guiding our leadership team with wisdom and experience."
  }
];

const ExpertTeam = () => {
  return (
    <section className="exp-t-section">
      <div className="container">
        <header className="exp-t-header">
          <span className="exp-t-upper-title">OUR TEAM</span>
          <h2 className="exp-t-main-title">Let's Meet Our Experts</h2>
          <div className="exp-t-divider"></div>
        </header>

        <div className="row">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="col-lg-3 col-md-6 col-sm-12">
              <article className="exp-t-card">
                <div className="exp-t-image-container">
                  <img src={member.img} alt={member.name} className="exp-t-image" />
                  
                  {/* Hover Overlay */}
                  <div className="exp-t-overlay">
                    <h4 className="exp-t-name-alt">{member.name}</h4>
                    <p className="exp-t-role-alt">{member.role}</p>
                    <hr className="exp-t-sep" />
                    <p className="exp-t-bio">{member.bio}</p>
                  </div>
                </div>

                <div className="exp-t-details">
                  <h4 className="exp-t-name">{member.name}</h4>
                  <p className="exp-t-role">{member.role}</p>
                </div>
                <div className="exp-t-bottom-bar"></div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExpertTeam;