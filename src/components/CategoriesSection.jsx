import React, { useState } from 'react';
import { CATEGORIES } from '../data/healthcareData';
import {
  Bone, Brain, Smile, Sparkles, Scale, Activity, Ear, HeartHandshake,
  Stethoscope, ShieldPlus, Flower2, Droplet, ArrowRight, UserCheck
} from 'lucide-react';

const iconMap = {
  Bone,
  Brain,
  Smile,
  Sparkles,
  Scale,
  Activity,
  Ear,
  HeartHandshake,
  Stethoscope,
  ShieldPlus,
  Flower2,
  Droplet
};

export function CategoriesSection({ onSelectCategory, onViewCategoryDetail, onStartBooking }) {
  const [showAll, setShowAll] = useState(false);

  // By default, display the 4 main departments matching the user's BookDoc screenshot
  const displayedCategories = showAll ? CATEGORIES : CATEGORIES.slice(0, 4);

  return (
    <section className="bookdoc-departments-section" id="departments">
      <div className="bookdoc-departments-header">
        <div className="departments-title-block">
          <h2 className="departments-heading">Our Departments</h2>
          <p className="departments-subheading">
            Whatever your concern, our expert doctors are ready to help.
          </p>
        </div>

        <button
          type="button"
          className="bookdoc-see-all-btn"
          onClick={() => setShowAll(!showAll)}
          id="btn-see-all-departments"
        >
          <span>{showAll ? 'Show less' : 'See all department'}</span>
        </button>
      </div>

      <div className="bookdoc-departments-grid">
        {displayedCategories.map((cat) => {
          const IconComponent = iconMap[cat.iconName] || Stethoscope;

          return (
            <div
              key={cat.id}
              className="bookdoc-dept-card"
              onClick={() => onSelectCategory(cat.id)}
              role="button"
              tabIndex={0}
            >
              <div className="dept-card-top">
                <div className="dept-icon-box">
                  <IconComponent size={24} strokeWidth={2.2} />
                </div>
              </div>

              <h3 className="dept-card-title">{cat.name}</h3>
              <p className="dept-card-desc">{cat.shortDescription}</p>

              {/* Dedicated Doctor Badge (1 Major Problem = 1 Doctor) */}
              <div className="dept-doctor-assignment">
                <span className="assignment-badge">
                  <UserCheck size={12} />
                  <span>1 Dedicated Specialist Assigned</span>
                </span>
                <span className="free-consult-pill">Free Consultation</span>
              </div>

              <div className="dept-card-footer">
                <button
                  type="button"
                  className="dept-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectCategory(cat.id);
                  }}
                >
                  <span>Find Doctor</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
