import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Dashboard
    'dashboard.title': 'Student Dashboard',
    'dashboard.welcome': 'Welcome back',
    'dashboard.currentExam': 'Current Exam',
    'dashboard.practiceSection': 'Practice Sections',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.performance': 'Performance',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.achievements': 'Recent Achievements',
    
    // Exam Types
    'exam.police': 'Police Bharti',
    'exam.talathi': 'Talathi Bharti',
    
    // Sections
    'section.pyq': 'Previous Year Questions',
    'section.pyq.desc': 'Practice with actual exam questions from 2015-2024',
    'section.model': 'Model Questions',
    'section.model.desc': 'Expert-created practice sets based on latest patterns',
    'section.district': 'District-wise Questions',
    'section.district.desc': 'Region-specific questions and local knowledge tests',
    'section.subject': 'Subject wise Questions',
    'section.subject.desc': 'Practice questions organized by subjects',
    
    // Buttons
    'btn.start': 'Start',
    'btn.view': 'View',
    'btn.logout': 'Logout',
    'btn.profile': 'Profile',
    'btn.settings': 'Settings',
    'btn.back': 'Back to Dashboard',
    
    // Stats
    'stats.averageScore': 'Average Score',
    'stats.testsTaken': 'Tests Taken',
    'stats.hoursStudied': 'Hours Studied',
    'stats.rankInClass': 'Rank in Class',
    'stats.streak': 'Streak',
    'stats.questions': 'Questions',
    
    // Quick Actions
    'action.mockTest': 'Take Mock Test',
    'action.studyMaterials': 'Study Materials',
    'action.leaderboard': 'View Leaderboard',
    'action.schedule': 'Study Schedule',
    
    // Subjects
    'subject.mathematics': 'Mathematics',
    'subject.reasoning': 'Reasoning',
    'subject.gk': 'GK',
    'subject.marathi': 'Marathi Grammar',
    'subject.english': 'English Grammar'
  },
  mr: {
    // Dashboard
    'dashboard.title': 'विद्यार्थी डॅशबोर्ड',
    'dashboard.welcome': 'परत स्वागत',
    'dashboard.currentExam': 'सध्याची परीक्षा',
    'dashboard.practiceSection': 'सराव विभाग',
    'dashboard.recentActivity': 'अलीकडील क्रियाकलाप',
    'dashboard.performance': 'कामगिरी',
    'dashboard.quickActions': 'त्वरित क्रिया',
    'dashboard.achievements': 'अलीकडील उपलब्धी',
    
    // Exam Types
    'exam.police': 'पोलीस भरती',
    'exam.talathi': 'तलाठी भरती',
    
    // Sections
    'section.pyq': 'मागील वर्षांचे प्रश्न',
    'section.pyq.desc': '२०१५-२०२४ पासूनच्या वास्तविक परीक्षा प्रश्नांचा सराव करा',
    'section.model': 'मॉडेल प्रश्न',
    'section.model.desc': 'नवीनतम पॅटर्नवर आधारित तज्ञांनी तयार केलेले सराव सेट',
    'section.district': 'जिल्हानिहाय प्रश्न',
    'section.district.desc': 'प्रादेशिक प्रश्न आणि स्थानिक ज्ञान चाचण्या',
    'section.subject': 'विषयनिहाय प्रश्न',
    'section.subject.desc': 'विषयांनुसार व्यवस्थित केलेले सराव प्रश्न',
    
    // Buttons
    'btn.start': 'सुरू करा',
    'btn.view': 'पहा',
    'btn.logout': 'लॉगआउट',
    'btn.profile': 'प्रोफाइल',
    'btn.settings': 'सेटिंग्ज',
    'btn.back': 'डॅशबोर्डवर परत',
    
    // Stats
    'stats.averageScore': 'सरासरी गुण',
    'stats.testsTaken': 'घेतलेल्या चाचण्या',
    'stats.hoursStudied': 'अभ्यासाचे तास',
    'stats.rankInClass': 'वर्गातील स्थान',
    'stats.streak': 'सलग दिवस',
    'stats.questions': 'प्रश्न',
    
    // Quick Actions
    'action.mockTest': 'मॉक टेस्ट घ्या',
    'action.studyMaterials': 'अभ्यास साहित्य',
    'action.leaderboard': 'लीडरबोर्ड पहा',
    'action.schedule': 'अभ्यास वेळापत्रक',
    
    // Subjects
    'subject.mathematics': 'गणित',
    'subject.reasoning': 'तर्कशुद्धता',
    'subject.gk': 'सामान्य ज्ञान',
    'subject.marathi': 'मराठी व्याकरण',
    'subject.english': 'इंग्रजी व्याकरण'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'mr')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};